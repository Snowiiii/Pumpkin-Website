# Einen Kommando-Handler schreiben

In Minecraft sind Befehle der Hauptweg, über den sowohl normale Spieler als auch Operatoren mit dem Spiel auf einer niedrigeren Ebene interagieren. Sie können für eine Vielzahl von Aufgaben genutzt werden – von einfachen Chat-Nachrichten bis hin zu komplexen Serververwaltungsaktionen. In diesem Tutorial erstellen wir einen einfachen Schere‑Stein‑Papier‑Befehl, mit dem Spieler gegen den Server antreten können.

Pumpkin besitzt ein eigenes System zur Befehlsverarbeitung, das auf einem "Baum" basiert, welcher die genaue Struktur des Befehls und seiner Argumente beschreibt. Jeder Knoten im Baum repräsentiert einen Befehl oder ein Argument; der Baum wird traversiert, um den auszuführenden Befehl und seine Parameter zu bestimmen.

Befehle in Pumpkin sind asynchron, das heißt, sie blockieren während ihrer Ausführung nicht den Haupt-Thread. Dadurch wird die Ressourcennutzung effizienter und die Spielerfahrung flüssiger.

Wir möchten außerdem [ploxxxy](https://github.com/ploxxxy) für das ursprüngliche [Rock-Paper-Scissors Plugin](https://github.com/ploxxxy/rock-paper-scissors-mc) danken, auf dem dieses Tutorial basiert.

## Grundlagen hinzufügen

Jeder Befehl in Pumpkin wird als Struktur definiert, die das Trait `CommandExecutor` implementiert. Dieses Trait verlangt die Implementierung einer Methode `execute`, welche den Sender, den Server und die konsumierten Argumente entgegennimmt und `Result<(), CommandError>` zurückgibt. Definieren wir diese Struktur jetzt:

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

Dieser Code definiert eine leere Struktur `RockPaperScissorsExecutor`, die das Trait `CommandExecutor` implementiert. Die `execute`‑Methode liefert aktuell einfach `Ok(())` zurück.

## Hilfs-Enums hinzufügen

Um uns die Logik zu vereinfachen, definieren wir zwei Enums für mögliche Spielzüge und Spielausgänge sowie Hilfsfunktionen zur Zufallsauswahl und zur Auswertung des Ergebnisses. Füge diese deinem Plugin hinzu:

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

Nun müssen wir die Struktur `RockPaperScissorsExecutor` anpassen, damit sie eine `Choice` annimmt, und die Spiellogik vorbereiten:

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

Dieser Code erlaubt es uns später, die Spielerwahl zu übergeben und mit der Wahl des Servers zu vergleichen, um das Ergebnis zu bestimmen.

## Spiel-Logik implementieren

Nun implementieren wir die eigentliche Spiel-Logik und zeigen das Ergebnis an den Spieler.

Zuerst zeigen wir dem Spieler seine Wahl sowie die Wahl des Servers. Füge diesen Code hinzu:

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
                    TextComponent::text("Du wählst: ")
                        .add_text(format!("{:?}", player_choice))
                        .color_named(NamedColor::Aqua),
                )
                .await;

            sender
                .send_message(
                    TextComponent::text("Ich wähle: ")
                        .add_text(format!("{:?}", computer_choice))
                        .color_named(NamedColor::Gold),
                )
                .await;
            
            Ok(())
        })
    }
}
```

Als Nächstes berechnen wir das Ergebnis und zeigen es dem Spieler:

```rust
impl CommandExecutor for RockPaperScissorsExecutor {
    fn execute<'a>(
        &self,
        sender: &mut CommandSender,
        _: &Server,
        _: &ConsumedArgs<'a>,
    ) -> Result<(), CommandError> {
        Box::pin(async move {
            // Existierender Code
            

            match player_choice.beats(&computer_choice) { // [!code ++:19]
                Outcome::Win => {
                    sender
                        .send_message(TextComponent::text("Du gewinnst!").color_named(NamedColor::Green))
                        .await;
                }
                Outcome::Lose => {
                    sender
                        .send_message(TextComponent::text("Du verlierst!").color_named(NamedColor::Red))
                        .await;
                }
                Outcome::Draw => {
                    sender
                        .send_message(
                            TextComponent::text("Unentschieden!").color_named(NamedColor::Yellow),
                        )
                        .await;
                }
            }
            
            Ok(())
        })
    }
}
```

Damit ist die Kernlogik abgeschlossen. Es fehlt nur noch die Registrierung des Befehls.

## Befehlsbaum erstellen und registrieren

Wie bereits erwähnt müssen wir einen Befehlsbaum erstellen und beim Server registrieren. Dadurch können Spieler unseren Plugin-Befehl ausführen.

Der Baum wird über `CommandTree::new()` initialisiert. Diese Funktion nimmt zwei Argumente: eine Liste aus Namen (der erste ist der Hauptname, die folgenden sind Aliasse) sowie eine Beschreibung des Befehls für das Hilfe-Menü. Anschließend fügen wir mit `.then()` "Äste" hinzu. Diese Methode akzeptiert ein "Blatt", das mit `literal()`, `argument()` oder `require()` erstellt werden kann.

Für Schere‑Stein‑Papier erstellen wir drei getrennte Äste – jeweils ein `literal()` für die Spielerwahl. Danach registrieren wir den Baum mit einer `PermissionLvl` von `Zero`, sodass jeder den Befehl ausführen kann. Ergänze folgenden Code in deiner `on_load()` Methode:

```rust
use pumpkin_util::PermissionLvl; // [!code ++]

const NAMES: [&str; 2] = ["rps", "rockpaperscissors"]; // [!code ++:2]
const DESCRIPTION: &str = "Spiele Schere Stein Papier mit dem Server.";

#[plugin_method]
async fn on_load(&self, server: Arc<Context>) -> Result<(), String> {
    server.init_log();

    log::info!("Hallo, Pumpkin!");

    server.register_event(Arc::new(MyJoinHandler), EventPriority::Lowest, true).await;
    
    let command = CommandTree::new(NAMES, DESCRIPTION) // [!code ++:6]
        .then(literal("rock").execute(RockPaperScissorsExecutor(Choice::Rock)))
        .then(literal("paper").execute(RockPaperScissorsExecutor(Choice::Paper)))
        .then(literal("scissors").execute(RockPaperScissorsExecutor(Choice::Scissors)));

    server.register_command(command, PermissionLvl::Zero).await;

    Ok(())
}
```

Und das war's! Wenn du das Plugin kompiliert hast, kannst du es mit folgendem Befehl testen:

```bash
/rps rock
```
