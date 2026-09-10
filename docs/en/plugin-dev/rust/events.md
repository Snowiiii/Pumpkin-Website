# Writing a Event Handler

Event handlers are one of the main functions of plugins. They allow a plugin to tap into the
internal workings of the server and alter its behavior to perform some other action. For a
simple example, we will implement a handler for the `PlayerJoinEvent` and the `PlayerLeaveEvent`.

## Implementing an Event

Individual event handlers are just structs which implement the `EventHandler<E>` trait (where `E` is a specific event data).

### What are blocking events?

The Pumpkin plugin event system differentiates between two types of events: blocking and non-blocking. Each have their benefits:

#### Blocking events

```diff
Pros:
+ Can modify the event (like editing the join message)
+ Can cancel the event
+ Have a priority system
Cons:
- Are executed in sequence
- Can slow down the server if not implemented well
```

#### Non-blocking events

```diff
Pros:
+ Are executed concurrently
+ Are executed after all blocking events finish
+ Can still do some modifications (anything that is behind a Mutex or RwLock)
Cons:
- Cannot cancel the event
- Have no priority system
- Allow for less control over the event
```

### Writing a handler

Since our main aim here is to change the welcome message that the player sees when they join a server, we will be choosing the blocking event type with a normal priority.

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

**Explanation**:

- `struct MyJoinHandler;`: The struct for our event handler
- If the event is non-blocking, we still use the handle function, and return the event data. The event data will still be ignored.

### Registering the handler

Now that we have written the event handler, we need to tell the plugin to use it. We can do that by adding a single line into the `on_load` method:
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

    fn on_load(&self, context: Context) -> pumpkin_plugin_api::Result<()> {
        info!("Hello from the example plugin!");
        context.register_event_handler(MyJoinHandler, EventPriority::Normal, true)?;
        Ok(())
    }

    fn on_unload(&self, _context: Context) -> pumpkin_plugin_api::Result<()> {
        info!("Example plugin unloaded. Goodbye!");
        Ok(())
    }
}
```

:::
Now if we build the plugin and join the server, we should see a "Hello, World!" message!

## Adding a leave event

As an exercise for the reader, try adding a PlayerLeaveEvent
