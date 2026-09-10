# Writing a Command Handler

In Minecraft, commands are the primary way for both regular players and server operators to
interact with the game on a lower level. They can be used to perform a wide range of tasks,
from simple chat messages to complex server management commands. In this tutorial, we will
create a basic Rock-Paper-Scissors command handler that allows players to play the game
against the server.

Pumpkin has its own system for handling commands, which is based around each command having a
'tree', which defines the exact structure of the command and its arguments. Each node in the
tree represents a command or argument, and the tree is traversed to determine the command to
execute and its parameters.

We would also like to thank [ploxxxy](https://github.com/ploxxxy) for writing the original
[Rock-Paper-Scissors plugin](https://github.com/ploxxxy/rock-paper-scissors-mc) from which
this tutorial is based.

## Adding the basics

Each command in Pumpkin is defined as a structure that implements the `CommandHandler` trait.
This trait requires the implementation of a `handle` method, which takes the sender, server,
and consumed arguments as parameters, and returns a `-> Result<(), CommandError>`. Let's
define this structure now:

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

This code defines an empty structure `RockPaperScissorsExecutor` that implements the
`CommandExecutor` trait. The `handler` method is defined to return `Ok(1)` when called.

## Adding helper enums

First install the `rand` crate via

```bash
cargo add rand
```

To make our lives easier, we will also define a couple of enums to represent the possible
choices and outcomes of the game, as well as well as a couple functions to generate random
choices and check the outcome. Add these to your plugin's code.

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

Now we need to modify the `RockPaperScissorsExecutor` struct to accept a `Choice` parameter
and implement the game logic.

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

This code will allow us to later pass in the player's choice and use it in the game logic,
as well as compare it with the computer's choice to determine the outcome of the game.

## Implementing the Game Logic

Now we can move on to actually implementing the game logic, and showing the outcome to the
players.

First we will show the player their and the computer's choice. Add this code to your plugin:

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

Next we can compute the game outcome and show it to the player. Add this code to your plugin:

```rust
impl CommandHandler for RockPaperScissorsExecutor {
    fn handle(
        &self,
        sender: CommandSender,
        _server: Server,
        _args: ConsumedArgs,
    ) -> Result<i32, CommandError> {
        // Existing Code

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

And that's it! The core logic is done. Now we only have one last thing to do.

## Building and registering a command tree

As stated earlier, we need to build a command tree and register it with the server. This will
allow players to execute our plugin's commands.

Building a command tree isn't very hard, but you have to know the exact structure of the command
and its arguments. In this case, we have a command named `rock-paper-scissors`, which will take
one required argument (the player's choice).

The command tree is initialized using the `Command::new()` function. This function takes two
arguments: a list of names, where the first is the main command name, and the others are aliases
for the command; and a command description which is used to describe the command in the help menu.
We can then add 'branches' to the tree using the `.then()` method. This method accepts a 'leaf'
which can be built with the `CommandNode::literal()`, `CommandNode::argument()`, or
`CommandNode::require()` functions.

For the rock-paper-scissors command, we'll create 3 separate branches, each with a `CommandNode::literal()`
leaf node for the player's choice. We will also register the command tree with the server and
with a `permission` of `hello-pumpkin:command.rockpaperscisors` which will allow anyone with that
permission to execute the command. Add the following code to your `on_load()` method:

```rust
struct HelloPlugin;
impl Plugin for HelloPlugin {
    fn new() -> Self {
        HelloPlugin
    }

    fn metadata(&self) -> PluginMetadata {
        // Existing Code
    }

    fn on_load(&self, context: Context) -> pumpkin_plugin_api::Result<()> {
        // Existing Code

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

And that's it! If you compile the plugin, you can test it by running the following command:

```bash
/rps rock
```
