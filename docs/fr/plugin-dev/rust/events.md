# Écrire un gestionnaire d'événement

Les gestionnaires d'evénements sont une des fonctions principales d'un plugin. Ils permettent à un plugin de s'incruster dans le fonctionnement interne du serveur et modifier son comportement pour executer.
Pour un exemple, nous allons implémenter un gestionnaire pour les evénements `PlayerJoinEvent` et `PlayerLeaveEvent`.

## Implémenter un événement

Les gestionnaires d’événements individuels ne sont que des structures qui implémentent le trait `EventHandler<E>` (où `E` est une donnée d’événement spécifique).

### Qu'est ce qui bloque les evénements ?

Le système d'événements Pumpkin différentie deux types d'événements: bloquant et non-bloquant. Chaqu'un ayant leurs avantages:

#### Événements bloquant

```diff
Pour:
+ Puet éditer l'événement (modifier le message de connection par exemple)
+ Peut annuler l'événement
+ Ont un système de priorité
Contres:
- Sont éxécutés les uns après les autres
- Peut ralentir le serveur si mal implémenté
```

#### Évéments non-bloquant

```diff
Pour:
+ Sont tous exécutés en même temps
+ Sont toujours executés après les evénemnt bloquants
+ Peut toujours faire certaines modification (tout ce qui est derrière un Mutex ou RwLock)
Contres:
- Ne peux pas annuler l'événement
- N'a pas de système de priorité
- Permettre moins de contrôle sur l’événement
```

### Écrire un gestionnaire

Puisque notre objectif principal ici est de changer le message de bienvenue que le joueur voit lorsqu’il rejoint un serveur, nous choisirons le type d’événement bloquant avec une priorité normale.

:::code-group

```rust [lib.rs]
// [!code ++:20]
use pumpkin_plugin_api::{
    Context, Plugin, PluginMetadata, Server,
    events::{EventData, EventHandler, EventPriority, PlayerJoinEvent},
    text::TextComponent,
};
use tracing::*;

struct MyJoinHandler;
impl EventHandler<PlayerJoinEvent> for MyJoinHandler {
    fn handle<'a>(
        &'a self,
        server: Server,
        mut event: EventData<PlayerJoinEvent>,
    ) -> EventData<PlayerJoinEvent> { 
        event.join_message = TextComponent::text("Hello, world!");
        event
    }
}
```

:::

**Explications**:

- `struct MyJoinHandler;` : La structure de notre gestionnaire d’événements
- Si l’événement n’est pas bloquant, nous utilisons toujours la fonction handle et renvoyons les données de l’événement. Les données de l’événement restent ignorées.

### Enregistrer le gestionnaire

Maintenant que nous avons écrit le gestionnaire d’événements, nous devons dire au plugin de l’utiliser. Nous pouvons le faire en ajoutant une seule ligne dans la méthode `on_load` :
:::code-group

```rust [lib.rs]
struct HelloPlugin;
impl Plugin for HelloPlugin {
    fn new() -> Self {
        HelloPlugin
    }

    fn metadata(&self) -> PluginMetadata {
        // ...
    }

    fn on_load(&mut self, context: Context) -> pumpkin_plugin_api::Result<()> {
        info!("Hello from the example plugin!");
        context.register_event_handler(MyJoinHandler, EventPriority::Normal, true)?;
        Ok(())
    }

    fn on_unload(&mut self, _context: Context) -> pumpkin_plugin_api::Result<()> {
        info!("Example plugin unloaded. Goodbye!");
        Ok(())
    }
}
```

:::
Maintenant si nous compilons le plugin et rejoignons le serveur, nous devrions voir un "Hello, World !"
