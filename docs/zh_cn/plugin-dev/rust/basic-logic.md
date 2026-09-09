# 编写基本逻辑

## 插件基础

即使在一个基本插件中，底层也有很多工作，因此为了大大简化插件开发，我们将使用`pumpkin-api-macros` crate来创建一个基本的空插件。

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

这将创建一个空插件并实现所有必要的方法，使其能够被 Pumpkin 加载。

现在我们可以尝试首次编译我们的插件。为此，在项目文件夹中运行以下命令：

```bash
cargo build --release
```

::: tip 注意
如果您使用的是 Windows，您**必须**使用`--release`标志，否则会遇到问题。如果您使用的是其他平台，为了节省编译时间，可以不使用该标志。
:::
初始编译会花费一些时间，但不用担心，后续编译会更快。

如果一切顺利，您应该会看到类似这样的消息：

```log
╰─ cargo build --release
   Compiling hello-pumpkin v0.1.0 (/home/vypal/Dokumenty/GitHub/hello-pumpkin)
    Finished `release` profile [optimized] target(s) in 0.68s
```

现在您可以前往`./target/release`文件夹（如果您没有使用`--release`，则为`./target/debug`）并找到您的插件二进制文件。

根据您的操作系统，文件名称可能是以下三种之一：

- Windows：`hello-pumpkin.dll`
- MacOS：`libhello-pumpkin.dylib`
- Linux：`libhello-pumpkin.so`

::: info 说明
如果您在`Cargo.toml`文件中使用了不同的项目名称，请查找包含您项目名称的文件。
:::

您可以将此文件重命名为任何您喜欢的名称，但必须保持文件扩展名（`.dll`、`.dylib`或`.so`）不变。

## 测试插件

现在我们有了插件二进制文件，我们可以在 Pumpkin 服务器上进行测试。安装插件非常简单，只需将我们刚刚构建的插件二进制文件放入 Pumpkin 服务器的`plugins/`文件夹中！

由于`#[plugin_impl]`宏的作用，插件的详细信息（如名称、作者、版本和描述）会内置在二进制文件中，以便服务器能够读取它们。

当您启动服务器并运行`/plugins`命令时，您应该会看到类似这样的输出：

```bash
已加载 1 个插件：
hello-pumpkin
```

## 基本方法

 Pumpkin 服务器目前使用两个"方法"来告知插件其状态。这些方法是`on_load`和`on_unload`。

这些方法不是必须实现的，但您通常至少会实现`on_load`方法。在此方法中，您可以访问一个`Context`对象，该对象可以让插件访问有关服务器的信息，同时也允许插件注册命令处理器和事件。

为了使实现这些方法更容易，`pumpkin-api-macros` crate提供了另一个宏。
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

::: warning 重要
在`#[plugin_impl]`块之前定义任何插件方法是很重要的。
:::

此方法获取对其插件对象（在本例中为`MyPlugin`结构）的可变引用，可用于初始化存储在插件主结构中的任何数据，以及对`Context`对象的引用。该对象是根据插件的元数据专门为该插件构建的。

### 在 `Context` 对象上实现的方法

```rust
fn init_log()
```

通过 `log` crate 启用日志记录。

```rust
fn get_data_folder() -> String
```

返回专用于此插件的文件夹路径，应用于持久数据存储

```rust
async fn get_player_by_name(player_name: String) -> Option<Arc<Player>>
```

如果找到名为`player_name`的玩家（必须当前在线），此函数将返回对该玩家的引用。

```rust
async fn register_command(tree: CommandTree, permission: PermissionLvl)
```

注册一个新的命令处理器，具有最低所需权限级别。

```rust
async fn register_event(handler: Arc<H>, priority: EventPriority, blocking: bool)
```

注册一个新的事件处理器，具有设定的优先级，并指定是否为阻塞。
顺便说一下，`handler`是`Arc<T>`，这意味着您可以在一个处理器上实现多个事件，然后注册它。

## 基本 on-load 方法

现在我们将只实现一个非常基本的 `on_load` 方法，以便能够看到我们的插件正在运行。

在这里，我们将设置内部 Pumpkin 日志记录器，并设置一个 "Hello, Pumpkin !"消息，以便我们能够看到我们的插件正在运行。

在 `on_load` 方法中添加以下内容：
:::code-group

```rust [lib.rs]
#[plugin_method]
async fn on_load(&self, server: Arc<Context>) -> Result<(), String> {
    server.init_log(); // [!code ++:3]

    log::info!("你好, Pumpkin!");

    Ok(())
}
```

:::

如果我们再次构建插件并启动服务器，您现在应该能在日志中看到"你好, Pumpkin!"的消息。
