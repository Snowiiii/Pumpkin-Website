# Escrevendo um Gerenciador de Evento

Gerenciadores de eventos são uma das funções principais dos plugins. Eles permitem que um plugin acesse o funcionamento interno do servidor e altere seu comportamento para realizar alguma outra ação. Como exemplo simples, vamos implementar um manipulador para o evento `player_join`.

O sistema de eventos do Pumpkin tenta imitar o sistema de eventos do Bukkit/Spigot, para que desenvolvedores que vêm de lá tenham uma experiência mais fácil ao aprender o Pumpkin. No entanto, Rust tem concepções e regras diferentes, por isso nem tudo é como no Bukkit/Spigot. Rust não tem herança; em vez disso, ele só tem composição.

O sistema de eventos usa traits para gerenciar dinamicamente alguns eventos: `Event`, `Cancellable`, `PlayerEvent` e etc. `Cancellable` também pode ser um evento, porque é uma trait. (TODO: verificar isso)

## Implementando o Evento de Entrada

Gerenciadores de eventos individuais são apenas structs que implementam a trait `EventHandler<T>` (onde `T` é uma implementação específica de evento).

### O que são eventos bloqueantes?

O sistema de eventos do Pumpkin diferencia dois tipos de eventos: bloqueantes e não bloqueantes. Cada um tem seus benefícios:

#### Eventos bloqueantes

```diff
Prós:
+ Podem modificar o evento (como editar a mensagem de entrada)
+ Podem cancelar o evento
+ Têm um sistema de prioridade
Contras:
- São executados em sequência
- Podem diminuir a performance do servidor se não forem bem implementados
```

#### Eventos não bloqueantes

```diff
Prós:
+ São executados simultaneamente
+ São executados depois de todos os eventos bloqueantes terminarem
+ Ainda podem fazer algumas modificações (qualquer coisa que esteja atrás de um Mutex ou RwLock)
Contras:
- Não podem cancelar o evento
- Não têm sistema de prioridade
- Oferecem menos controle sobre o evento
```

### Escrevendo um gerenciador

Como nosso objetivo principal aqui é mudar a mensagem de boas-vindas que o jogador vê quando entra no servidor, vamos escolher o tipo de evento bloqueante com uma prioridade baixa.

Adicione este código acima do método `on_load`:
:::code-group

```rust [lib.rs]
 // [!código ++:4]
use pumpkin_api_macros::with_runtime;
use pumpkin::plugin::{player::PlayerJoinEvent, Context, EventHandler};
use pumpkin_util::text::{color::NamedColor, TextComponent};

struct MyJoinHandler; // [!código ++:12]

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

**Explicação**:

-   `struct MyJoinHandler;`: A struct para nosso gerenciador de evento.
-   `#[with_runtime(global)]`: Pumpkin usa o runtime assíncrono tokio, que age de maneira estranha além dos limites do plugin. Embora não seja necessário neste exemplo específico, é uma boa prática envolver todos os `impl`s assíncronos que interagem com código assíncrono com essa macro.
-   `fn handle_blocking()`: Como escolhemos que este evento será bloqueante, é necessário implementar o método `handle_blocking()` ao invés do método `handle()`.

### Registrando o gerenciador

Agora que escrevemos o gerenciador de evento, precisamos informar ao plugin para usá-lo. Podemos fazer isso adicionando uma única linha no método `on_load`:

:::code-group

```rust [lib.rs]
use pumpkin::plugin::{player::PlayerJoinEvent, Context, EventHandler, EventPriority}; // [!código ++]
use pumpkin::plugin::{player::PlayerJoinEvent, Context, EventHandler}; // [!código --]

#[plugin_method]
async fn on_load(&self, server: Arc<Context>) -> Result<(), String> {
    server.init_log();

    log::info!("Olá, Pumpkin!");

    server.register_event(Arc::new(MyJoinHandler), EventPriority::Lowest, true).await; // [!código ++]

    Ok(())
}
```

:::

Agora, se compilarmos o plugin e entrarmos no servidor, devemos ver uma mensagem de boas-vindas verde com o nosso nome de usuário!
