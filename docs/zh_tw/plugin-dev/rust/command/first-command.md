# 建立您的第一個指令

在 Pumpkin 中註冊並處理自訂指令的設計對開發者友善、快速，且結構類似 Mojang 的 Brigadier 系統。

## 1. 快速範例

以下是一個完整且精簡的 Rust 外掛，它註冊了一個帶有權限檢查的 `/hello` 指令，並傳送回應給玩家。

```rust
use pumpkin_plugin_api::{
    command::{CommandHandler, CommandSender, ConsumedArgs, CommandError, Command},
    permission::{Permission, PermissionDefault},
    Context, Plugin, PluginMetadata, Server,
};

struct HelloExecutor;

impl CommandHandler for HelloExecutor {
    fn handle(
        &self,
        sender: CommandSender,
        _server: Server,
        _args: ConsumedArgs,
    ) -> Result<i32, CommandError> {
        sender.send_message("Hello from Pumpkin!");
        Ok(1)
    }
}

pub struct MyPlugin;

impl Plugin for MyPlugin {
    fn new() -> Self {
        MyPlugin
    }

    fn metadata(&self) -> PluginMetadata {
        PluginMetadata {
            name: "my_plugin".into(),
            version: env!("CARGO_PKG_VERSION").into(),
            authors: vec!["Developer".into()],
            description: "My first Pumpkin plugin".into(),
        }
    }

    fn on_load(&mut self, context: Context) -> pumpkin_plugin_api::Result<()> {
        // 1. 註冊權限節點
        context.register_permission(&Permission {
            node: "my_plugin:hello".to_string(),
            description: "Allows executing the /hello command".to_string(),
            default: PermissionDefault::Allow,
            children: Vec::new(),
        })?;

        // 2. 建立帶有別名與執行器的指令樹
        let names = ["hello".to_string(), "hi".to_string()];
        let command = Command::new(&names, "Greets the player").execute(HelloExecutor);

        // 3. 註冊指令
        context.register_command(command, "my_plugin:hello")?;

        Ok(())
    }
}
```

## 2. 遊戲內預覽

註冊完成後，您的指令會自動在 Minecraft 中獲得用戶端自動完成、語法驗證與色彩標亮功能：

<img src="/assets/first_command_preview.png" alt="遊戲內指令自動完成預覽" width="500"/>

## 3. 運作方式

::: details 逐步解析

**步驟 1：定義權限**

Pumpkin 中的指令需要一個權限節點。使用 `PermissionDefault::Allow` 可預設允許所有玩家執行：

```rust
context.register_permission(&Permission {
    node: "my_plugin:hello".to_string(),
    description: "Allows executing the /hello command".to_string(),
    default: PermissionDefault::Allow,
    children: Vec::new(),
})?;
```

**步驟 2：建立指令樹**

使用 `Command::new` 定義主要名稱與別名，然後使用 `.execute(...)` 附加您的 `CommandHandler` 結構：

```rust
let names = ["hello".to_string(), "hi".to_string()];
let command = Command::new(&names, "Greets the player")
    .execute(HelloExecutor);
```

**步驟 3：使用 Context 註冊**

將指令樹與權限節點字串傳入 `context.register_command`：

```rust
context.register_command(command, "my_plugin:hello")?;
```

:::

## 下一步

在[剪刀石頭布教學](./rock-paper-scissors)中探索複雜的子指令與參數解析。
了解如何在外掛邏輯中處理物品欄與 GUI 互動。