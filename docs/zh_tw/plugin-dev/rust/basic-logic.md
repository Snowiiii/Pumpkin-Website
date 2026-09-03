# 撰寫基本邏輯

## 外掛基礎

即使是一個基本的外掛，底層也有許多事情在運作，因此為了大幅簡化外掛開發，我們將使用 `pumpkin-plugin-api` crate 來建立一個基本的空外掛。

:::code-group
```rust
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
        info!("Hello from the Example plugin!");
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

這將建立一個空的外掛，並實作所有讓 Pumpkin 能夠載入它的必要方法。

現在我們可以嘗試第一次編譯我們的外掛。為此，請在您的專案資料夾中執行以下指令：

```shell
cargo build --release
```

您不需要使用 release 模式建置，但它能大幅縮減 wasm 外掛的大小並縮短啟動時間。

如果一切順利，您應該會看到類似以下的訊息：

```
╰─ cargo build --release
   Compiling hello-pumpkin-wasm v0.1.0 (/home/bjorn/Documents/GitHub/Hello-Pumpkin-Wasm)
    Finished `release` profile [optimized] target(s) in 0.05s
```

現在您可以前往 `./target/wasm32-wasip2/release` 資料夾（如果您沒有使用 `--release`，則是 `./target/wasm32-wasip2/debug`）並找到您的外掛二進位檔。檔案名稱將如下所示。

```
hello_pumpkin_wasm.wasm
```

::: info 注意
如果您在 `Cargo.toml` 檔案中使用了不同的專案名稱，請尋找包含您專案名稱的檔案。
:::

您可以將此檔案重新命名為任何您喜歡的名稱，但必須保持副檔名 (`.wasm`) 不變。

## 測試外掛

現在我們已經有了外掛二進位檔，可以繼續在 Pumpkin 伺服器上測試它。安裝外掛非常簡單，只需將我們剛剛建置的外掛二進位檔放入 Pumpkin 伺服器的 `plugins/` 資料夾即可！

當您啟動伺服器並執行 `/plugins` 指令時，您應該會看到類似以下的輸出：

```
There is 1 plugin loaded:
hello-pumpkin-wasm
```

## 在 `Context` 物件上實作的方法

```rust
fn get_server(&self) -> Server
```
回傳伺服器實例。

```rust
fn register_command(&self, command: Command, permission: &str)
```
註冊新的指令處理器，並附上該指令的權限。

```rust
fn register_event_handler<E, H>(&self, handler: H, event_priority: EventPriority, blocking: bool) -> Result<u32>
```
註冊新的事件處理器，並設定優先權以及是否為阻塞式。