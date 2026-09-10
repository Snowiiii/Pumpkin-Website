# Migrating Events from Bukkit

In Bukkit, events are handled by creating classes that implement `Listener` and annotating methods with `@EventHandler`.

In Pumpkin, event handlers are structs or objects registered explicitly via `context.register_event_handler(...)`. Pumpkin also differentiates between **Blocking** and **Non-blocking** events to maximize server concurrency.

---

## Key Differences

| Feature | Bukkit / Spigot | Pumpkin |
| :--- | :--- | :--- |
| **Listener Declaration** | `@EventHandler` annotation on methods | `EventHandler<E>` trait / interface implementation |
| **Registration** | `pm.registerEvents(listener, plugin)` | `context.register_event_handler(handler, priority, is_blocking)` |
| **Execution Model** | Main thread execution (`EventPriority`) | Choice between **Blocking** (sequential/cancellable) and **Non-blocking** (concurrent) |
| **Cancellation** | `event.setCancelled(true)` | `event.cancel()` on blocking events |

---

## Blocking vs. Non-Blocking Events in Pumpkin

Unlike Bukkit where all event handlers run sequentially on the main server thread, Pumpkin lets you specify whether an event handler is **blocking**:

```rust
// Registration signature in Rust:
context.register_event_handler(handler, priority, is_blocking)?;
```

- **Blocking (`is_blocking = true`)**: Executes in sequential priority order. Can modify event data (e.g. edit join message) or cancel the event.
- **Non-blocking (`is_blocking = false`)**: Executes concurrently across worker threads. Ideal for logging, metrics, or external notifications where cancellation is not needed.

---

## Code Comparison: Player Join Event

### 1. Bukkit Implementation (Java)

```java [JoinListener.java]
public class JoinListener implements Listener {
    @EventHandler(priority = EventPriority.NORMAL)
    public void onPlayerJoin(PlayerJoinEvent event) {
        Player player = event.getPlayer();
        event.setJoinMessage("Welcome " + player.getName() + " to the server!");
    }
}

// In JavaPlugin:
// getServer().getPluginManager().registerEvents(new JoinListener(), this);
```

### 2. Pumpkin Implementations

::: code-group

```rust [Rust]
use pumpkin_plugin_api::{
    Context, Plugin, PluginMetadata, Server,
    events::{EventData, EventHandler, EventPriority, PlayerJoinEvent},
    text::TextComponent,
};

struct JoinHandler;

impl EventHandler<PlayerJoinEvent> for JoinHandler {
    fn handle<'a>(
        &'a self,
        _server: Server,
        mut event: EventData<PlayerJoinEvent>,
    ) -> EventData<PlayerJoinEvent> {
        event.join_message = TextComponent::text("Welcome to the Pumpkin server!");
        event
    }
}

pub struct MyPlugin;

impl Plugin for MyPlugin {
    fn new() -> Self { MyPlugin }

    fn metadata(&self) -> PluginMetadata {
        PluginMetadata {
            name: "join_plugin".into(),
            version: "1.0.0".into(),
            authors: vec!["Developer".into()],
            description: "Join event handler".into(),
        }
    }

    fn on_load(&self, context: Context) -> pumpkin_plugin_api::Result<()> {
        // Register blocking event handler with Normal priority
        context.register_event_handler(JoinHandler, EventPriority::Normal, true)?;
        Ok(())
    }
}
```

```python [Python]
from pumpkin_api import (
    Plugin, PluginMetadata, register_plugin,
    event, server, context
)

class MyPlugin(Plugin):
    def metadata(self) -> PluginMetadata:
        return PluginMetadata(name="join_plugin", version="1.0.0", authors=["Dev"], description="Join event")

    def on_load(self, ctx: context.Context) -> None:
        self.register_event(ctx, event.EventType.PLAYER_JOIN_EVENT, self.on_player_join)

    def on_player_join(self, srv: server.Server, evt: event.PlayerJoinEventData) -> event.PlayerJoinEventData:
        print(f"Player joined!")
        return evt

register_plugin(MyPlugin)
```

:::
