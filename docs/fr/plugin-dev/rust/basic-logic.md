# Écrire la logique de base

## Base du plugin

Même dans un plugin basique, il se passe beaucoup de choses sous le capot, donc pour simplifier grandement le développement des plugins, nous allons utiliser la `pumpkin-plugin-api` pour créer un plugin vide de base.

:::code-group

```rust:line-numbers [lib.rs]
use pumpkin_plugin_api::{Context, Plugin, PluginMetadata};
use tracing::*;

struct HelloPlugin;
impl Plugin for HelloPlugin {
    fn new() -> Self {
        HelloPlugin
    }

    fn metadata(&self) -> PluginMetadata {
        PluginMetadata {
            name: "Hello Plugin".into(),
            version: env!("CARGO_PKG_VERSION").into(),
            authors: vec!["Bjorn".into()],
            description: "A simple example plugin".into(),
        }
    }

    fn on_load(&mut self, _context: Context) -> pumpkin_plugin_api::Result<()> {
        info!("Hello from the example plugin!");
        Ok(())
    }

    fn on_unload(&mut self, _context: Context) -> pumpkin_plugin_api::Result<()> {
        info!("Example plugin unloaded. Goodbye!");
        Ok(())
    }
}

pumpkin_plugin_api::register_plugin!(HelloPlugin);
```

:::

Cela va créer un plugin vide et implémenter les méthodes nécessaires pour qu'il soit chagé par Pumpkin.

Nous pouvons maintenant essayer de compiler notre plugin pour la première fois. Pour ce faire, lancez cette commande depuis le dossier de votre projet:

```bash
cargo build --release
```

Il n'est pas obligatoire de compiler en mode publication, mais ça réduit la taille du plugin `wasm` et accélère le lancement.

Si tout c'est bien passé, vous devriez voir un message comme ça:

```log
╰─ cargo build --release
   Compiling hello-pumpkin-wasm v0.1.0 (/home/bjorn/Documents/GitHub/Hello-Pumpkin-Wasm)
    Finished `release` profile [optimized] target(s) in 0.05s
```

Maintenant, vous pouvez aller dans le dossier `./target/wasm32-wasip2/release` (ou `./target/wasm32-wasip2/debug` si vous n'avez pas utilisé `--release`) et trouver le binaire du plugin. Le nom du fichier devrait être le suivant.

```
hello_pumpkin_wasm.wasm
```

::: info NOTE
Si vous avez utilisé un différent nom de projet dans le fichier `Cargo.toml`, cherchez un fichier qui contient le nom de votre projet.
:::

Vous pouvez renommer ce fichier comme vous voulez, cependant vous devez garder l'exention (`.wasm`) inchangée.

## Tester le plugin

Maintentant que nous avons notre binaire, nous pouvons le tester sur sur notre serveur Pumpkin.
Installer le plugin se résume à placer le binaire que nous avons juste compilé dans le dossier `plugins/` de votre serveur Pumpkin !

Quand vous démarrez votre plugin et que vous utilisez la commande `/plugins`, vous devrez voir une sortie comme ça:

```text
There is 1 plugin loaded:
hello-pumpkin-wasm
```

## Méthodes mises en œuvre sur l’objet `Context`

```rust
fn get_server(&self) -> Server
```

Retourne une instance du serveur.

```rust
fn register_command(&self, command: Command, permission: &str)
```

Enregistre un nouveau gestionnaire de commande, avec l’autorisation correspondant à la commande.

```rust
fn register_event_handler<E, H>(&self, handler: H, event_priority: EventPriority, blocking: bool) -> Result<u32>
```

Enregistre un nouveau gestionnaire d’événement avec une priorité définie et s’il bloque ou non.