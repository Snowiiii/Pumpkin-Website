# 撰寫指令處理器

在 Minecraft 中，指令是一般玩家與伺服器管理員在較底層層面與遊戲互動的主要方式。它們可以用來執行各種任務，從簡單的聊天訊息到複雜的伺服器管理指令。在本教學中，我們將建立一個基本的剪刀石頭布指令處理器，讓玩家可以與伺服器進行遊戲。

Pumpkin 有自己的指令處理系統，該系統基於每個指令都擁有一棵「樹」，這棵樹定義了指令及其參數的確切結構。樹中的每個節點代表一個指令或參數，透過遍歷樹來確定要執行的指令及其參數。

我們也要感謝 [ploxxxy](https://github.com/ploxxxy) 撰寫了原始的[剪刀石頭布外掛](https://github.com/ploxxxy/rock-paper-scissors-mc)，本教學即是基於該外掛。

## 新增基本功能

Pumpkin 中的每個指令都被定義為一個實作 `CommandHandler` trait 的結構。此 trait 要求實作一個 `handle` 方法，該方法接收傳送者、伺服器和已消耗的參數作為參數，並回傳一個 `-> Result<(), CommandError>`。現在讓我們定義這個結構：

```rust
use pumpkin_plugin_api::{
    Server,
    command::{CommandError, CommandSender, ConsumedArgs},
    commands::CommandHandler,
};

struct RockPaperScissorsExecutor;

impl CommandHandler for RockPaperScissorsExecutor {
    fn handle(
        &self,
        _sender: CommandSender,
        _server: Server,
        _args: ConsumedArgs,
    ) -> Result<i32, CommandError> {
        Ok(1)
    }
}
```

這段程式碼定義了一個空的結構 `RockPaperScissorsExecutor`，它實作了 `CommandExecutor` trait。`handler` 方法被定義為在被呼叫時回傳 `Ok(1)`。

## 新增輔助列舉

首先透過以下指令安裝 `rand` crate：

```shell
cargo add rand
```

為了讓事情更簡單，我們還將定義幾個列舉來表示遊戲中可能的選擇與結果，以及一些產生隨機選擇和檢查結果的函式。將這些新增到您的外掛程式碼中。

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

現在我們需要修改 `RockPaperScissorsExecutor` 結構以接受一個 `Choice` 參數並實作遊戲邏輯。

```rust
struct RockPaperScissorsExecutor(Choice); // [!code ++]
struct RockPaperScissorsExecutor; // [!code --]

impl CommandHandler for RockPaperScissorsExecutor {
    fn handle(
        &self,
        sender: CommandSender,
        _server: Server,
        _args: ConsumedArgs,
    ) -> Result<i32, CommandError> {
        let player_choice = self.0; // [!code ++:3]
        let computer_choice = get_random_choice();
        Ok(1)
    }
}
```

這段程式碼將允許我們稍後傳入玩家的選擇並在遊戲邏輯中使用它，以及將其與電腦的選擇進行比較以確定遊戲結果。

## 實作遊戲邏輯

現在我們可以開始實際實作遊戲邏輯，並向玩家顯示結果。

首先，我們將向玩家顯示他們和電腦的選擇。將這段程式碼新增到您的外掛中：

```rust
impl CommandHandler for RockPaperScissorsExecutor {
    fn handle(
        &self,
        sender: CommandSender,
        _server: Server,
        _args: ConsumedArgs,
    ) -> Result<i32, CommandError> {
        let player_choice = self.0;
        let computer_choice = get_random_choice();

        // [!code ++:9]
        let you_chose = TextComponent::text("You chose: ");
        you_chose.add_child(TextComponent::text(&format!("{:?}", player_choice)));
        you_chose.color_named(NamedColor::Aqua);
        sender.send_message(you_chose);

        let i_chose = TextComponent::text("I chose: ");
        i_chose.add_child(TextComponent::text(&format!("{:?}", computer_choice)));
        i_chose.color_named(NamedColor::Gold);
        sender.send_message(i_chose);
    }
}
```

接下來，我們可以計算遊戲結果並向玩家顯示。將這段程式碼新增到您的外掛中：

```rust
impl CommandHandler for RockPaperScissorsExecutor {
    fn handle(
        &self,
        sender: CommandSender,
        _server: Server,
        _args: ConsumedArgs,
    ) -> Result<i32, CommandError> {
        // 現有程式碼

        match player_choice.beats(&computer_choice) { // [!code ++:17]
            Outcome::Win => {
                let message = TextComponent::text("You win!");
                message.color_named(NamedColor::Green);
                sender.send_message(message);
            }
            Outcome::Lose => {
                let message = TextComponent::text("You lose!");
                message.color_named(NamedColor::Red);
                sender.send_message(message);
            }
            Outcome::Draw => {
                let message = TextComponent::text("It's a tie!");
                message.color_named(NamedColor::Yellow);
                sender.send_message(message);
            }
        }

        Ok(1)
    }
}
```

就這樣！核心邏輯完成了。現在我們只需要做最後一件事。

## 建置並註冊指令樹

如前所述，我們需要建置一個指令樹並將其註冊到伺服器。這將允許玩家執行我們外掛的指令。

建置指令樹並不困難，但您必須了解指令及其參數的確切結構。在本例中，我們有一個名為 `rock-paper-scissors` 的指令，它將接受一個必要參數（玩家的選擇）。

指令樹使用 `Command::new()` 函式進行初始化。此函式接受兩個參數：一個名稱列表，其中第一個是主要指令名稱，其餘為指令的別名；以及一個指令描述，用於在說明選單中描述該指令。

然後我們可以使用 `.then()` 方法向樹中新增「分支」。此方法接受一個「葉節點」，該葉節點可以使用 `CommandNode::literal()`、`CommandNode::argument()` 或 `CommandNode::require()` 函式建置。

對於剪刀石頭布指令，我們將建立 3 個獨立的分支，每個分支都有一個 `CommandNode::literal()` 葉節點用於玩家的選擇。我們還將使用 `hello-pumpkin:command.rockpaperscisors` 的 `permission` 將指令樹註冊到伺服器，這將允許任何擁有該權限的人執行該指令。將以下程式碼新增到您的 `on_load()` 方法中：

```rust
struct HelloPlugin;

impl Plugin for HelloPlugin {
    fn new() -> Self {
        HelloPlugin
    }

    fn metadata(&self) -> PluginMetadata {
        // 現有程式碼
    }

    fn on_load(&mut self, context: Context) -> pumpkin_plugin_api::Result<()> {
        // 現有程式碼

        let command = Command::new( // [!code ++:20]
            &["rps".to_string(), "rockpaperscissors".to_string()],
            "Play Rock Paper Scissors with the server.",
        );

        command.then(CommandNode::literal("rock").execute(RockPaperScissorsExecutor(Choice::Rock)));
        command
            .then(CommandNode::literal("paper").execute(RockPaperScissorsExecutor(Choice::Paper)));
        command.then(
            CommandNode::literal("scissors").execute(RockPaperScissorsExecutor(Choice::Scissors)),
        );

        let permission = Permission {
            node: "hello-pumpkin:command.rockpaperscisors".to_string(),
            description: "Allows the player to play rock paper scisors".to_string(),
            default: PermissionDefault::Allow,
            children: Vec::new(),
        };

        context.register_permission(&permission)?;
        context.register_command(command, "hello-pumpkin:command.rockpaperscisors");

        Ok(())
    }
}
```

就這樣！如果您編譯外掛，可以透過執行以下指令來測試：

```
/rps rock
```