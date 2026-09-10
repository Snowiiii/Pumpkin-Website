<!-- TODO(i18n): outdated, en uses pumpkin-plugin-api, not #[plugin_method]. -->

# 编写命令处理器

在 Minecraft 中，命令是普通玩家和服务器管理员与游戏进行底层交互的主要方式。它们可用于执行从简单的聊天消息到复杂的服务器管理等广泛任务。在本教程中，我们将创建一个基本的“石头剪刀布”命令处理器，让玩家可以与服务器进行游戏。

Pumpkin 拥有自己的命令处理系统，其核心在于每个命令都有一个“树形结构”，该结构定义了命令及其参数的精确语法。树中的每个节点代表一个命令或参数，系统通过遍历这棵树来确定要执行的命令及其参数。

Pumpkin 中的命令是异步执行的，这意味着它们在执行时不会阻塞主线程。这有助于更高效地利用资源并提供更流畅的用户体验。

我们还要感谢 [ploxxxy](https://github.com/ploxxxy)
编写了最初的 “[石头剪刀布](https://github.com/ploxxxy/rock-paper-scissors-mc) ”插件，本教程正是基于此插件而创作的。

## 添加基础功能

Pumpkin 中的每个命令都被定义为实现 `CommandExecutor` trait 的结构体。此 trait 要求实现一个 `execute`
方法，该方法以发送者、服务器和消耗的参数作为参数，并返回 R`-> Result<(), CommandError>`。现在我们来定义这个结构体。

```rust
use pumpkin::{
    command::{ // [!code ++:4]
        args::ConsumedArgs, dispatcher::CommandError, tree::builder::literal, tree::CommandTree,
        CommandExecutor, CommandSender,
    },
    plugin::{player::player_join::PlayerJoinEvent, Context, EventHandler, EventPriority},
    server::Server,
};

struct RockPaperScissorsExecutor; // [!code ++]

impl CommandExecutor for RockPaperScissorsExecutor {
    fn execute<'a>(
        &self,
        sender: &mut CommandSender,
        _: &Server,
        _: &ConsumedArgs<'a>,
    ) -> Result<(), CommandError> {
        Box::pin(async {
            Ok(())
        })
    }
}
```

This code defines an empty structure `RockPaperScissorsExecutor` that implements the `CommandExecutor` trait. The
`execute` method is defined to return `Ok(())` when called.

这段代码定义了一个空结构体 `RockPaperScissorsExecutor` ，它实现了 `CommandExecutor` trait。其 `execute` 方法被定义为在调用时返回
`Ok(())`。

## 添加辅助枚举

为了让我们的开发工作更轻松，我们将在插件代码中定义一些枚举来表示游戏中可能的选择和结果，同时添加几个函数来生成随机选择和检查游戏结果。将这些内容添加到您的插件代码中。

```rust
use rand::{rng, Rng};

#[derive(PartialEq, Debug, Clone, Copy)]
enum Choice {
    Rock,
    Paper,
    Scissors,
}

enum Outcome {
    Win,
    Lose,
    Draw,
}

impl Choice {
    pub fn beats(&self, other: &Choice) -> Outcome {
        if self == other {
            return Outcome::Draw;
        }

        match (self, other) {
            (Choice::Rock, Choice::Scissors) => Outcome::Win,
            (Choice::Paper, Choice::Rock) => Outcome::Win,
            (Choice::Scissors, Choice::Paper) => Outcome::Win,
            _ => Outcome::Lose,
        }
    }
}

fn get_random_choice() -> Choice {
    let choices = [Choice::Rock, Choice::Paper, Choice::Scissors];
    let index = rng().random_range(0..3);
    choices[index]
}
```

好的，现在我们需要修改 `RockPaperScissorsExecutor` 结构体，使其能接受一个 `Choice` 参数并实现游戏逻辑。

```rust
struct RockPaperScissorsExecutor(Choice); // [!code ++]
struct RockPaperScissorsExecutor; // [!code --]

impl CommandExecutor for RockPaperScissorsExecutor {
    fn execute<'a>(
        &self,
        sender: &mut CommandSender,
        _: &Server,
        _: &ConsumedArgs<'a>,
    ) -> Result<(), CommandError> {
        Box::pin(async move { // [!code ++:3]
            let player_choice = self.0; 
            let computer_choice = get_random_choice();
            Ok(())
        })
    }
}
```

此代码将允许我们稍后传入玩家的选择并将其用于游戏逻辑中，同时将其与计算机的选择进行比较以确定游戏结果。

## 实现游戏逻辑

现在，我们可以继续前进，实际实现游戏逻辑，并向玩家展示游戏结果。

首先，我们将向玩家展示他们自己和计算机的选择。将此代码添加到您的插件中：

```rust
impl CommandExecutor for RockPaperScissorsExecutor {
    fn execute<'a>(
        &self,
        sender: &mut CommandSender,
        _: &Server,
        _: &ConsumedArgs<'a>,
    ) -> Result<(), CommandError> {
        Box::pin(async move {
            let player_choice = self.0;
            let computer_choice = get_random_choice();
            
            sender // [!code ++:15]
                .send_message(
                    TextComponent::text("你选择了： ")
                        .add_text(format!("{:?}", player_choice))
                        .color_named(NamedColor::Aqua),
                )
                .await;

            sender
                .send_message(
                    TextComponent::text("我选择了： ")
                        .add_text(format!("{:?}", computer_choice))
                        .color_named(NamedColor::Gold),
                )
                .await;
            
            Ok(())
        })
    }
}
```

接下来，我们可以计算游戏结果并将其展示给玩家。将此代码添加到您的插件中：

```rust
impl CommandExecutor for RockPaperScissorsExecutor {
    fn execute<'a>(
        &self,
        sender: &mut CommandSender,
        _: &Server,
        _: &ConsumedArgs<'a>,
    ) -> Result<(), CommandError> {
        Box::pin(async move {
            // Existing code
            

            match player_choice.beats(&computer_choice) { // [!code ++:19]
                Outcome::Win => {
                    sender
                        .send_message(TextComponent::text("你赢了！").color_named(NamedColor::Green))
                        .await;
                }
                Outcome::Lose => {
                    sender
                        .send_message(TextComponent::text("你输了！").color_named(NamedColor::Red))
                        .await;
                }
                Outcome::Draw => {
                    sender
                        .send_message(
                            TextComponent::text("平局了！").color_named(NamedColor::Yellow),
                        )
                        .await;
                }
            }
            
            Ok(())
        })
    }
}
```

就这样！核心逻辑已完成。现在我们只剩下最后一件事要做。

## 构建与注册命令树

如前所述，我们需要构建一个命令树并将其注册到服务器。这将允许玩家执行我们插件的命令。

构建命令树并不难，但您必须知道命令及其参数的确切结构。在本例中，我们有一个名为 `rock-paper-scissors` 的命令，它将接受一个必需参数（玩家的选择）。

命令树使用 `CommandTree::new()` 函数进行初始化。此函数接受两个参数：一个名称列表，其中第一个是主命令名称，其余的是该命令的别名；以及一个用于在帮助菜单中描述命令的命令描述。然后，我们可以使用
`.then()` 方法向树中添加“分支”。此方法接受一个“叶节点”，该节点可以使用 `literal()`, `argument()`, 或 `require()` 函数构建。

对于石头剪刀布命令，我们将创建 3 个独立的分支，每个分支都有一个代表玩家选择的 `literal()` 叶节点。我们还将以 `Zero` 的
`PermissionLvl` 向服务器注册该命令树，这将允许任何人执行该命令。请将以下代码添加到您的 `on_load()` 方法中。

```rust
use pumpkin_util::PermissionLvl; // [!code ++]

const NAMES: [&str; 2] = ["rps", "rockpaperscissors"]; // [!code ++:2]
const DESCRIPTION: &str = "与服务器玩石头剪刀布。";

#[plugin_method]
async fn on_load(&self, server: Arc<Context>) -> Result<(), String> {
    server.init_log();

    log::info!("你好, Pumpkin!");

    server.register_event(Arc::new(MyJoinHandler), EventPriority::Lowest, true).await;
    
    let command = CommandTree::new(NAMES, DESCRIPTION) // [!code ++:6]
        .then(literal("石头").execute(RockPaperScissorsExecutor(Choice::Rock)))
        .then(literal("布").execute(RockPaperScissorsExecutor(Choice::Paper)))
        .then(literal("剪刀").execute(RockPaperScissorsExecutor(Choice::Scissors)));

    server.register_command(command, PermissionLvl::Zero).await;

    Ok(())
}
```

就这样完成了！如果您已编译该插件，可以通过运行以下命令来测试它：

```bash
/rps rock
```
