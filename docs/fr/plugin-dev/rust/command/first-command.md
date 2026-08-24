# Faire votre première commande

Avant d'enregistrer votre commande, vous devez trouver un nom. Dans cette exemple, nous le définissons comme une liste constante. Utiliser une liste nous permet de créer facilement des alias.

```rust
let names = ["test".to_string()]; 
// OU avec alias
let names = ["test".to_string(), "testcommande".to_string()];
```

Vous devriez aussi définir une description pour qu'elle soit affichée quand le joueur utilise `/help`.

```rust
let description = "Ma première commande !";
```

L’API Pumpkin’s Command est fortement inspirée de [Brigadier] de Mojang (https://github.com/Mojang/brigadier). Ce système vous permet de gérer facilement la syntaxe des commandes et fournit une tabulation automatique pour les joueurs.

#### Implémenter l'arbre de commandes

```rust
use pumpkin_plugin_api::command::Command;

pub fn init_command_tree() -> Command {
    let names = ["test".to_string(), "testcommande".to_string()];
    let description = "Ma première commande!";

    Command::new(&names, description)
}
```

#### Enregistrement et permissions

Pour rendre votre commande utilisable, vous devez enregistrer les permissions et la commande elle-même dans le contexte du plugin.

Premièrement, enregistrez la permission. Dans cette exemple, on définit `PermissionDefault::Allow` pour que tout le monde puisse utiliser cette commande par défaut. 

```rust
struct MyPlugin;
impl Plugin for MyPlugin {
    fn new() -> Self {
        MyPlugin
    }

    fn metadata(&self) -> PluginMetadata {
        PluginMetadata {
            name: "plugin_docs_plugin".into(),
            version: env!("CARGO_PKG_VERSION").into(),
            authors: vec!["Bjorn".into()],
            description: "Un simple plugin d'exemple".into(),
        }
    }

    fn on_load(&mut self, context: Context) -> pumpkin_plugin_api::Result<()> {
        tracing::info!("Hello, Pumpkin!");

        context.register_permission(&Permission { // [!code ++:7]
            // This has to have the same name space as provided in your PluginMetadata
            node: "plugin_docs_plugin:test".to_string(),
            description: "Important Test Permission".to_string(),
            default: PermissionDefault::Allow,
            children: Vec::new(),
        })?;

        Ok(())
    }
}
```

Ensuite, enregistrez la commande en utilisant la chaîne de permission crée si-dessus:

```rust
struct MyPlugin;
impl Plugin for MyPlugin {
    // ...

    fn on_load(&mut self, context: Context) -> pumpkin_plugin_api::Result<()> {
        tracing::info!("Hello, Pumpkin!");

        context.register_permission(&Permission {
            node: "plugin_docs_plugin:test".to_string(),
            description: "Important Test Permission".to_string(),
            default: PermissionDefault::Allow,
            children: Vec::new(),
        })?;
        
         context.register_command(init_command_tree(), "plugin_docs_plugin:test"); // [!code ++:1]

        Ok(())
    }
}
```

Recompliez votre plugin, déplacez vos fichier de plugin dans le dossier `plugins` et redémarrez votre serveur.

**Félicitation!**, La commande est maintenant enregistrée et devrait être surlignée en jeu et dans le console.

<img src="/assets/plugin-dev/first_command_preview.png" alt="drawing" width="1000"/>

L’exécution de la commande en ce moment a probablement déclenché une erreur de syntaxe car aucun exécuteur de commande n’a été mis en œuvre et la commande ne fait tout simplement rien.

```
$ test
$ Invalid Syntax. Usage: /test
```

### Ajouter un exécuteur

Permet de créer un exécuteur de commandes super simple sans nécessiter d’arguments

```rust
struct MyCommandExecutor;

impl CommandHandler for MyCommandExecutor {
    fn handle(
        &self,
        sender: pumpkin_plugin_api::command::CommandSender,
        server: pumpkin_plugin_api::Server,
        args: pumpkin_plugin_api::command::ConsumedArgs,
    ) -> pumpkin_plugin_api::Result<i32, CommandError> {
        Ok(1)
    }
}
```

### Attacher un exécuteur

Maintenant, afin de joindre l’exécuteur, tout ce que nous devons faire maintenant est de le fournir au commandement.

```rust
pub fn init_command_tree() -> Command {
    let names = ["test".to_string(), "testcommand".to_string()];
    let description = "My first Command!";

    Command::new(&names, description).execute(MyCommandExecutor) // [!code ++:1]
}
```

Maintenant, vous ne devriez obtenir aucune erreur de syntaxe lors de l’exécution de `/test`.
