# Temel mantığı yazma

## Eklenti temeli

Basit bir eklentide bile perde arkasında çok şey olur, bu yüzden eklenti geliştirmeyi büyük ölçüde basitleştirmek için `pumpkin-api-macros` crate'ini kullanarak temel, boş bir eklenti oluşturacağız.

:::code-group

```rust:line-numbers [lib.rs]
use pumpkin_api_macros::plugin_impl;

#[plugin_impl]
pub struct MyPlugin {}

impl MyPlugin {
    pub fn new() -> Self {
        MyPlugin {}
    }
}

impl Default for MyPlugin {
    fn default() -> Self {
        Self::new()
    }
}
```

:::

Bu, boş bir eklenti oluşturur ve Pumpkin tarafından yüklenebilmesi için gerekli tüm yöntemleri uygular.

Artık eklentimizi ilk kez derlemeyi deneyebiliriz. Bunun için proje klasörünüzde şu komutu çalıştırın:

```bash
cargo build --release
```

::: tip NOTICE
Windows kullanıyorsanız **mutlaka** `--release` bayrağını kullanmalısınız; aksi halde sorun yaşarsınız. Başka bir platformdaysanız derleme süresinden tasarruf etmek için bunu kullanmak zorunda değilsiniz.
:::
İlk derleme biraz zaman alacaktır, ancak endişelenmeyin, sonraki derlemeler daha hızlı olacaktır.

Her şey yolunda gittiyse aşağıdakine benzer bir mesaj görmelisiniz:

```log
â•°â”€ cargo build --release
   Compiling hello-pumpkin v0.1.0 (/home/vypal/Dokumenty/GitHub/hello-pumpkin)
    Finished `release` profile [optimized] target(s) in 0.68s
```

Artık `./target/release` klasörüne (veya `--release` kullanmadıysanız `./target/debug` klasörüne) gidip eklenti ikili dosyanızı bulabilirsiniz.

İşletim sisteminize bağlı olarak dosyanın adı üç olası isimden biri olacaktır:

- Windows için: `hello-pumpkin.dll`
- MacOS için: `libhello-pumpkin.dylib`
- Linux için: `libhello-pumpkin.so`

::: info NOTE
`Cargo.toml` dosyasında farklı bir proje adı kullandıysanız, proje adınızı içeren bir dosya arayın.
:::

Bu dosyayı istediğiniz gibi yeniden adlandırabilirsiniz; ancak dosya uzantısını (`.dll`, `.dylib` veya `.so`) aynı tutmalısınız.

## Eklentiyi test etmek

Artık eklenti ikili dosyamız olduğuna göre, Pumpkin sunucusunda test edebiliriz. Eklenti yüklemek, yeni derlediğimiz eklenti ikili dosyasını Pumpkin sunucunuzun `plugins/` klasörüne koymak kadar basittir!

`#[plugin_impl]` makrosu sayesinde eklentinin detayları (isim, yazarlar, sürüm ve açıklama gibi) ikili dosyanın içine gömülür, böylece sunucu bunları okuyabilir.

Sunucuyu başlattığınızda ve `/plugins` komutunu çalıştırdığınızda şöyle bir çıktı görmelisiniz:

```text
There is 1 plugin loaded:
hello-pumpkin
```

## Temel yöntemler

Pumpkin sunucusu, eklentiye durumunu bildirmek için şu anda iki "yöntem" kullanır. Bu yöntemler `on_load` ve `on_unload`'dur.

Bu yöntemlerin uygulanması zorunlu değildir, ancak genellikle en az `on_load` yöntemini uygularsınız. Bu yöntemde, eklentiye sunucu hakkında bilgi sağlayabilen `Context` nesnesine erişirsiniz; ayrıca eklentinin komut işleyicileri ve olayları kaydetmesine olanak tanır.

Bu yöntemleri uygulamayı kolaylaştırmak için `pumpkin-api-macros` crate'i tarafından sağlanan başka bir macro daha vardır.
:::code-group

```rust [lib.rs]
use std::sync::Arc; // [!code ++:4]

use pumpkin_api_macros::{plugin_impl, plugin_method};
use pumpkin::plugin::Context;
use pumpkin_api_macros::plugin_impl; // [!code --]

#[plugin_method] // [!code ++:4]
async fn on_load(&self, server: Arc<Context>) -> Result<(), String> {
    Ok(())
}

#[plugin_impl]
pub struct MyPlugin {}

impl MyPlugin {
    pub fn new() -> Self {
        MyPlugin {}
    }
}

impl Default for MyPlugin {
    fn default() -> Self {
        Self::new()
    }
}
```

:::

::: warning IMPORTANT
Herhangi bir eklenti yöntemini `#[plugin_impl]` bloğundan önce tanımlamanız önemlidir.
:::

Bu yöntem, eklenti nesnesine (bu örnekte `MyPlugin` struct'ı) değiştirilebilir bir referans ve bir `Context` nesnesine referans alır. Bu nesne, eklentinin meta verilerine göre özellikle bu eklenti için oluşturulur.

### `Context` nesnesinde uygulanan yöntemler

```rust
fn init_log()
```

`log` crate'i üzerinden günlüklemeyi etkinleştirir.

```rust
fn get_data_folder() -> String
```

Bu eklentiye özel klasörün yolunu döndürür; kalıcı veri depolama için kullanılmalıdır

```rust
async fn get_player_by_name(player_name: String) -> Option<Arc<Player>>
```

`player_name` adlı bir oyuncu bulunursa (o anda çevrimiçi olmalıdır), bu fonksiyon ona bir referans döndürür.

```rust
async fn register_command(tree: CommandTree, permission: PermissionLvl)
```

Asgari gereken yetki seviyesiyle yeni bir komut işleyicisi kaydeder.

```rust
async fn register_event(handler: Arc<H>, priority: EventPriority, blocking: bool)
```

Belirli bir öncelik ve bloklayıcı olup olmadığıyla birlikte yeni bir olay işleyicisi kaydeder.
Bu arada `handler` bir `Arc<T>`'dir; bu, tek bir işleyicide birçok olayı uygulayıp sonra kaydedebileceğiniz anlamına gelir.

## Temel on-load yöntemi

Şimdilik, eklentinin çalıştığını görebilmek için çok basit bir `on_load` yöntemi uygulayacağız.

Burada iç Pumpkin günlükleyicisini ayarlayıp "Hello, Pumpkin!" mesajını görünür hale getireceğiz.

Bunu `on_load` yöntemine ekleyin:
:::code-group

```rust [lib.rs]
#[plugin_method]
async fn on_load(&self, server: Arc<Context>) -> Result<(), String> {
    server.init_log(); // [!code ++:3]

    log::info!("Hello, Pumpkin!");

    Ok(())
}
```

:::

Eklentiyi yeniden derleyip sunucuyu başlattığınızda, loglarda "Hello, Pumpkin!" mesajını görmelisiniz.
