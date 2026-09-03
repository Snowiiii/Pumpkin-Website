# 撰寫事件處理器

事件處理器是外掛的主要功能之一。它們允許外掛深入伺服器的內部運作，並改變其行為以執行其他動作。以一個簡單的範例來說，我們將實作 `PlayerJoinEvent` 和 `PlayerLeaveEvent` 的處理器。

## 實作事件

個別的事件處理器只是實作 `EventHandler<E>` trait 的結構（其中 `E` 是特定的事件資料）。

### 什麼是阻塞事件？

Pumpkin 外掛事件系統區分兩種類型的事件：阻塞與非阻塞。兩者各有其優勢：

**阻塞事件**
優點：
+ 可以修改事件（例如編輯加入訊息）
+ 可以取消事件
+ 具有優先權系統

缺點：
- 依序執行
- 如果實作不佳，可能會拖慢伺服器

**非阻塞事件**
優點：
+ 並行執行
+ 在所有阻塞事件完成之後執行
+ 仍可以進行一些修改（任何位於 Mutex 或 RwLock 背後的內容）

缺點：
- 無法取消事件
- 沒有優先權系統
- 對事件的控制較少

## 撰寫處理器

由於我們這裡的主要目標是更改玩家加入伺服器時看到的歡迎訊息，我們將選擇具有 Normal 優先權的阻塞事件類型。

:::code-group
```rust
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

說明：
`struct MyJoinHandler;`：我們事件處理器的結構。

如果事件是非阻塞的，我們仍然使用 handle 函式並回傳事件資料。事件資料仍然會被忽略。

## 註冊處理器

現在我們已經撰寫了事件處理器，我們需要告訴外掛使用它。我們可以透過在 `on_load` 方法中新增一行程式碼來完成：

:::code-group
```rust
struct HelloPlugin;

impl Plugin for HelloPlugin {
    fn new() -> Self {
        HelloPlugin
    }

    fn metadata(&self) -> PluginMetadata {
        // ...
    }

    fn on_load(&mut self, context: Context) -> pumpkin_plugin_api::Result<()> {
        info!("Hello from the Example plugin!");
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

現在，如果我們建置外掛並加入伺服器，我們應該會看到 "Hello, World!" 訊息！

## 新增離開事件

作為讀者的練習，請嘗試新增一個 PlayerLeaveEvent。