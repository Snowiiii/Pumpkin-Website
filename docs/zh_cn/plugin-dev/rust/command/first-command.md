# 制作您的第一个命令

在注册您的命令之前，您需要为其选择一个名称。在本示例中，我们将其定义为常量数组。使用数组可以方便地添加别名

```rust
const NAMES: [&str; 1] = ["test"]; 
// OR with aliases 
const NAMES: [&str; 2] = ["test", "testcommand"]; 
```

您还需要定义命令的描述，当玩家使用 /help 命令时，此描述将会显示出来

```rust
const DESCRIPTION: &str = "我的第一个命令！";
```

Pumpkin 的 Command API 很大程度上受到了 Mojang 的 [Brigadier](https://github.com/Mojang/brigadier) 的启发。这套系统能够让你轻松地管理命令语法，并为玩家提供自动的 Tab 补全功能。

#### 实现命令树

```rust
use pumpkin::command::tree::CommandTree;

pub fn init_command_tree() -> CommandTree {
    CommandTree::new(NAMES, DESCRIPTION)
}
```

#### 注册与权限

要让命令可用，您必须在您的插件上下文中同时注册权限和命令本身。

首先，注册权限。在本示例中，我们将  `PermissionDefault::Allow` ，以便默认情况下所有玩家都能使用此命令。

```diff
#[plugin_method]
async fn on_load(&self, context: Arc<Context>) -> Result<(), String> {
    context.init_log();

    log::info!("你好, Pumpkin!");

+    context
+        .register_permission(Permission::new(
+            "plugin_docs_plugin:test",
+            "重要：测试权限",
+            PermissionDefault::Allow,
+        ))
+        .await
+        .unwrap();


    Ok(())
}
```

接下来，使用上面创建的权限字符串来注册命令:

```diff
#[plugin_method]
async fn on_load(&self, context: Arc<Context>) -> Result<(), String> {
    context.init_log();

    log::info!("你好, Pumpkin!");

    context
        .register_permission(Permission::new(
            "plugin_docs_plugin:test",
            "重要：测试权限",
            PermissionDefault::Allow,
        ))
        .await
        .unwrap();

+    context
+        .register_command(command::init_command_tree(), "plugin_docs_plugin:test")
+        .await;

    Ok(())
}
```

重新构建您的插件，将生成的插件文件移动到服务器的 plugins 文件夹中，然后重启服务器。

**恭喜！** 命令现已注册成功，在游戏中及控制台里都应能正常使用并高亮显示。

<img src="/assets/plugin-dev/first_command_preview.png" alt="drawing" width="1000"/>

目前执行命令很可能会抛出语法错误，因为尚未实现命令执行器（Command Executor），该命令现在没有任何实际功能。

### 添加一个执行器

让我们创建一个超级简单的命令执行器，它不需要任何参数。

```rust
struct MyCommandExecutor; 

impl CommandExecutor for MyCommandExecutor {
    fn execute<'a>(
        &self,
        sender: &'a CommandSender,
        server: &'a Server,
        args: &ConsumedArgs<'a>,
    ) -> CommandResult<'a> {
        Box::pin(async {
            Ok((1))
        })
    }
}
```
