# 從 Bukkit 遷移事件

在 Bukkit 中，事件的處理方式是透過建立實作 `Listener` 的類別，並在方法上標註 `@EventHandler`。
在 Pumpkin 中，事件處理器是透過 `context.register_event_handler(...)` 明確註冊的結構或物件。Pumpkin 還區分了阻塞與非阻塞事件，以最大化伺服器並行性。

## 主要差異

| 功能 | Bukkit / Spigot | Pumpkin |
| --- | --- | --- |
| 監聽器宣告 | 方法上的 `@EventHandler` 標註 | `EventHandler<E>` trait / 介面實作 |
| 註冊 | `pm.registerEvents(listener, plugin)` | `context.register_event_handler(handler, priority, is_blocking)` |
| 執行模型 | 主執行緒執行 (`EventPriority`) | 可選擇**阻塞**（依序執行/可取消）或**非阻塞**（並行） |
| 取消 | `event.setCancelled(true)` | 在阻塞事件上呼叫 `event.cancel()` |

## Pumpkin 中的阻塞與非阻塞事件

與 Bukkit 所有事件處理器都在伺服器主執行緒上依序執行不同，Pumpkin 允許您指定事件處理器是否為阻塞式：

```rust
// Rust 中的註冊簽章：
context.register_event_handler(handler, priority, is_blocking)?;
```

**阻塞** (`is_blocking = true`)：以依序優先權順序執行。可以修改事件資料（例如編輯加入訊息）或取消事件。
**非阻塞** (`is_blocking = false`)：在工作執行緒間並行執行。適用於紀錄、指標或外部通知等不需要取消的場景。

## 程式碼比較：玩家加入事件

### 1. Bukkit 實作 (Java)

```java
public class JoinListener implements Listener {
    @EventHandler(priority = EventPriority.NORMAL)
    public void onPlayerJoin(PlayerJoinEvent event) {
        Player player = event.getPlayer();
        event.setJoinMessage("Welcome " + player.getName() + " to the server!");
    }
}
// 在 JavaPlugin 中：
// getServer().getPluginManager().registerEvents(new JoinListener(), this);
```

### 2. Pumpkin 實作

::: code-group
```rust
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

    fn on_load(&mut self, context: Context) -> pumpkin_plugin_api::Result<()> {
        // 以 Normal 優先權註冊阻塞式事件處理器
        context.register_event_handler(JoinHandler, EventPriority::Normal, true)?;
        Ok(())
    }
}
```

```python
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