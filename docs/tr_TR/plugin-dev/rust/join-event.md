<!-- TODO(i18n): outdated, replaced in en by events.md. -->

﻿# Bir Olay İşleyicisi Yazma

Olay işleyicileri, eklentilerin ana işlevlerinden biridir. Bir eklentinin sunucunun iç işleyişine dokunmasına ve davranışını değiştirerek başka bir eylem gerçekleştirmesine olanak tanırlar. Basit bir örnek olarak `player_join` olayı için bir işleyici uygulayacağız.

Pumpkin eklenti olay sistemi, Bukkit/Spigot olay sistemini kopyalamaya çalışır; böylece oradan gelen geliştiriciler Pumpkin'i öğrenirken daha kolay eder.
Ancak Rust'ın farklı kavramları ve kuralları vardır, bu yüzden her şey Bukkit/Spigot'taki gibi değildir.
Rust'ta kalıtım yoktur; bunun yerine yalnızca bileşim vardır.

Olay sistemi, bazı olayları dinamik olarak ele almak için trait'leri kullanır: `Event`, `Cancellable`, `PlayerEvent` vb.
Cancellable bir Event de olabilir, çünkü bir trait'tir. (TODO: verify this)

## Katılma Olayını Uygulama

Tekil olay işleyicileri, `EventHandler<T>` trait'ini uygulayan struct'lardır (`T` belirli bir olay uygulamasıdır).

### Bloklayıcı olaylar nedir?

Pumpkin eklenti olay sistemi iki tür olayı ayırt eder: bloklayıcı ve bloklayıcı olmayan. Her birinin faydaları vardır:

#### Bloklayıcı olaylar

```diff
Pros:
+ Olayı değiştirebilir (ör. katılma mesajını düzenlemek)
+ Olayı iptal edebilir
+ Öncelik sistemi vardır
Cons:
- Sırayla yürütülür
- İyi uygulanmazsa sunucuyu yavaşlatabilir
```

#### Bloklayıcı olmayan olaylar

```diff
Pros:
+ Eşzamanlı yürütülür
+ Tüm bloklayıcı olaylar bittikten sonra yürütülür
+ Bazı değişiklikler yine yapılabilir (Mutex veya RwLock arkasındaki her şey)
Cons:
- Olayı iptal edemez
- Öncelik sistemi yoktur
- Olay üzerinde daha az kontrol sağlar
```

### Bir işleyici yazma

Buradaki temel amacımız oyuncunun sunucuya katıldığında gördüğü hoş geldin mesajını değiştirmek olduğu için, düşük öncelikli bloklayıcı olay türünü seçeceğiz.

Bu kodu `on_load` yönteminin üstüne ekleyin:
:::code-group

```rust [lib.rs]
 // [!code ++:7]
use pumpkin_api_macros::with_runtime;
use pumpkin::{
    plugin::{player::player_join::PlayerJoinEvent, Context, EventHandler, EventPriority},
    server::Server,
};
use pumpkin_util::text::{color::NamedColor, TextComponent};

struct MyJoinHandler; // [!code ++:12]

#[with_runtime(global)]
impl EventHandler<PlayerJoinEvent> for MyJoinHandler {
    fn handle_blocking(&self, _server: &Arc<Server>, event: &mut PlayerJoinEvent) -> BoxFuture<'_, ()> {
        Box::pin(async move {
        event.join_message =
            TextComponent::text(format!("Welcome, {}!", event.player.gameprofile.name))
                .color_named(NamedColor::Green);
        })
    }
}
```

:::

**Açıklama**:

- `struct MyJoinHandler;`: Olay işleyicimiz için struct
- `#[with_runtime(global)]`: Pumpkin tokio async runtime'ını kullanır ve bu, eklenti sınırı boyunca garip davranabilir. Bu örnekte zorunlu olmasa da, async kodla etkileşime giren tüm async `impl`'leri bu macro ile sarmak iyi bir pratiktir.
- `fn handle_blocking()`: Bu olayın bloklayıcı olmasını seçtiğimiz için `handle()` yerine `handle_blocking()` yöntemini uygulamak gerekir.

### İşleyiciyi kaydetme

Artık olay işleyicisini yazdığımıza göre, eklentiye bunu kullanmasını söylememiz gerekiyor. Bunu `on_load` yöntemine tek bir satır ekleyerek yapabiliriz:
:::code-group

```rust [lib.rs]
use pumpkin::{
    plugin::{player::player_join::PlayerJoinEvent, Context, EventHandler, EventPriority}, // [!code ++]
    server::Server,
};
use pumpkin::{
    plugin::{player::player_join::PlayerJoinEvent, Context, EventHandler}, // [!code --]
    server::Server,
};

#[plugin_method]
async fn on_load(&self, server: Arc<Context>) -> Result<(), String> {
    server.init_log();

    log::info!("Hello, Pumpkin!");

    server.register_event(Arc::new(MyJoinHandler), EventPriority::Lowest, true).await; // [!code ++]

    Ok(())
}
```

:::
Artık eklentiyi derleyip sunucuya katıldığımızda, kullanıcı adımızla birlikte yeşil bir "Welcome" mesajı görmeliyiz!
