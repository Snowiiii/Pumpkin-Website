# Escrevendo a Lógica Básica

## Base do Plugin

Mesmo em um plugin básico, há muita coisa acontecendo nos bastidores, então, para simplificar bastante o desenvolvimento de plugins, usaremos o crate `pumpkin-api-macros` para criar um plugin básico vazio.

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

Isso criará um plugin vazio e implementará todos os métodos necessários para que ele seja carregado pelo Pumpkin.

Agora podemos tentar compilar nosso plugin pela primeira vez. Para isso, execute o seguinte comando na pasta do seu projeto:

```bash
cargo build --release
```

::: tip AVISO
Se você estiver usando o Windows, você **tem** que usar a flag `--release`, caso contrário, terá problemas. Se você estiver em outra plataforma, não precisa usá-la caso queira economizar tempo de compilação.
:::
A compilação inicial levará um pouco de tempo, mas não se preocupe, as compilações seguintes serão mais rápidas.

Se tudo correr bem, você deverá ver uma mensagem como esta:

```log
╰─ cargo build --release
   Compiling hello-pumpkin v0.1.0 (/home/vypal/Dokumenty/GitHub/hello-pumpkin)
    Finished `release` profile [optimized] target(s) in 0.68s
```

Agora você pode ir para a pasta `./target/release` (ou `./target/debug` se não usou `--release`) e localizar o binário do seu plugin.

Dependendo do seu sistema operacional, o arquivo terá um dos três nomes possíveis:

-   Para Windows: `hello-pumpkin.dll`
-   Para MacOS: `libhello-pumpkin.dylib`
-   Para Linux: `libhello-pumpkin.so`

::: info NOTA
Se você usou um nome de projeto diferente no arquivo `Cargo.toml`, procure o arquivo que contenha o nome do seu projeto.
:::

Você pode renomear este arquivo como quiser, mas deve manter a extensão do arquivo (`.dll`, `.dylib` ou `.so`) a mesma.

## Testando o Plugin

Agora que temos o binário do plugin, podemos testá-lo no servidor Pumpkin. Instalar um plugin é tão simples quanto colocar o binário do plugin que acabamos de construir na pasta `plugins/` do seu servidor Pumpkin!

Graças à macro `#[plugin_impl]`, o plugin terá seus detalhes (como nome, autores, versão e descrição) incorporados ao binário para que o servidor possa lê-los.

Quando você iniciar o servidor e executar o comando `/plugins`, deverá ver uma resposta como esta:

```
Há 1 plugin carregado:
hello-pumpkin
```

## Métodos Básicos

O servidor Pumpkin atualmente usa dois "métodos" para informar ao plugin sobre seu estado. Esses métodos são `on_load` e `on_unload`.

Esses métodos não precisam ser implementados, mas você normalmente implementará pelo menos o método `on_load`. Nesse método, você tem acesso a um objeto `Context`, que pode fornecer ao plugin acesso a informações sobre o servidor, além de permitir que o plugin registre gerenciadores de comandos e eventos.

Para facilitar a implementação desses métodos, há outra macro fornecida pelo crate `pumpkin-api-macros`.
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

::: warning IMPORTANTE
É importante que você defina qualquer método do plugin antes do bloco `#[plugin_impl]`.
:::

Este método recebe uma referência mutável ao objeto do plugin (neste caso, a struct `MyPlugin`), que pode ser usada para inicializar quaisquer dados armazenados na struct principal do plugin, e uma referência ao objeto `Context`. Esse objeto é especificamente construído para este plugin com base nos metadados do plugin.

### Métodos implementados no objeto `Context`:

```rust
fn get_data_folder() -> String
```

Retorna o caminho para a pasta dedicada a este plugin, que deve ser usada para armazenamento de dados persistentes.

```rust
async fn get_player_by_name(player_name: String) -> Option<Arc<Player>>
```

Se um jogador com o nome `player_name` for encontrado (ele precisa estar online no momento), esta função retornará uma referência a ele.

```rust
async fn register_command(tree: CommandTree, permission: PermissionLvl)
```

Registra um novo gerenciador de comandos, com um nível mínimo de permissão exigido.

```rust
async fn register_event(handler: Arc<H>, priority: EventPriority, blocking: bool)
```

Registra um novo gerenciador de eventos com uma prioridade definida e se é bloqueante ou não.
Aliás, `handler` é `Arc<T>`, o que significa que você pode implementar vários eventos em um único gerenciador e depois registrá-lo.

## Método Básico `on_load`

Por enquanto, vamos implementar apenas um método `on_load` bem básico para conseguirmos ver que o plugin está funcionando.

Aqui vamos configurar o logger interno do Pumpkin e exibir "Hello, Pumpkin!" para que possamos ver nosso plugin em ação.

Adicione isso ao método `on_load`:
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

Se compilarmos o plugin novamente e iniciarmos o servidor, agora você deverá ver "Hello, Pumpkin!" em algum lugar no log.
