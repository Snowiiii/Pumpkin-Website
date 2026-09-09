# Event‑Handler schreiben (Join Event)

Event-Handler gehören zu den Hauptfunktionen von Plugins. Sie ermöglichen es einem Plugin, auf die internen Abläufe des Servers zuzugreifen und dessen Verhalten zu ändern, um bestimmte Aktionen auszuführen. Als einfaches Beispiel implementieren wir einen Handler für das `player_join`-Event.

Das Event-System des Pumpkin-Plugins versucht, das Event-System von Bukkit/Spigot nachzubilden, um Entwicklern, die von dort kommen, den Einstieg in Pumpkin zu erleichtern. Rust verfolgt jedoch andere Konzepte und Regeln, daher ist nicht alles mit Bukkit/Spigot vergleichbar. Rust kennt keine Vererbung, sondern nur Komposition.

Das Event-System verwendet Traits, um bestimmte Events dynamisch zu verarbeiten: `Event`, `Cancellable`, `PlayerEvent` usw. `Cancellable` kann auch ein Event sein, da es ein Trait ist. (TODO: Dies überprüfen)

## Implementierung des Join‑Events

Event‑Handler sind einfache Structs, die das Trait `EventHandler<T>` implementieren (wobei `T` das konkrete Event ist).

### Was sind blockierende Events?

Das Ereignissystem des Pumpkin-Plugins unterscheidet zwischen zwei Ereignistypen: blockierenden und nicht-blockierenden Ereignissen. Jeder Typ hat seine Vorteile:

### Blockierende Events

```diff
Vorteile:
+ Das Ereignis kann modifiziert werden (z. B. die Beitrittsnachricht bearbeiten).
+ Das Ereignis kann abgebrochen werden.
+ Es gibt ein Prioritätssystem.
Nachteile:
- Werden sequenziell ausgeführt.
- Können den Server verlangsamen, wenn sie nicht gut implementiert sind.
```

#### Nicht-blockierende Ereignisse

```diff
Vorteile:
+ Werden gleichzeitig ausgeführt.
+ Werden ausgeführt, nachdem alle blockierenden Ereignisse abgeschlossen sind.
+ Erlauben weiterhin einige Modifikationen (alles, was sich hinter einem Mutex oder RwLock befindet).
Nachteile:
- Das Ereignis kann nicht abgebrochen werden.
- Es gibt kein Prioritätssystem.
- Erlauben weniger Kontrolle über das Ereignis.
```

### Handler schreiben

Um die Willkommensnachricht beim Join zu ändern, wählen wir ein blockierendes Event mit niedriger Priorität.

Füge folgenden Code oberhalb von `on_load` ein:
:::code-group

```rust [lib.rs]
 // [!code ++:7]
use pumpkin_api_macros::with_runtime;
use pumpkin::{
    plugin::{player::player_join::PlayerJoinEvent, Context, EventHandler, EventPriority},
    server::Server,
};
use pumpkin_util::text::{color::NamedColor, TextComponent};

struct MyJoinHandler; // [!code ++:12]

#[with_runtime(global)]
impl EventHandler<PlayerJoinEvent> for MyJoinHandler {
    fn handle_blocking(&self, _server: &Arc<Server>, event: &mut PlayerJoinEvent) -> BoxFuture<'_, ()> {
        Box::pin(async move {
        event.join_message =
            TextComponent::text(format!("Welcome, {}!", event.player.gameprofile.name))
                .color_named(NamedColor::Green);
        })
    }
}
```

:::

**Erläuterungen**:

- `struct MyJoinHandler;`: Die Struktur für unseren Ereignishandler.
`#[with_runtime(global)]`: Pumpkin verwendet die Tokio-Async-Laufzeitumgebung, die sich an der Plugin-Grenze mitunter ungewöhnlich verhält. Obwohl es in diesem Beispiel nicht notwendig ist, empfiehlt es sich, alle asynchronen `impl`-Implementierungen, die mit asynchronem Code interagieren, mit diesem Makro zu umschließen.
`fn handle_blocking()`: Da wir dieses Ereignis als blockierend definiert haben, muss die Methode `handle_blocking()` anstelle der Methode `handle()` implementiert werden.

### Handler registrieren

Nachdem wir den Ereignishandler geschrieben haben, müssen wir dem Plugin mitteilen, dass es ihn verwenden soll. Dies erreichen wir durch Hinzufügen einer einzigen Zeile zur `on_load`-Methode:
:::code-group

```rust [lib.rs]
use pumpkin::{
    plugin::{player::player_join::PlayerJoinEvent, Context, EventHandler, EventPriority}, // [!code ++]
    server::Server,
};
use pumpkin::{
    plugin::{player::player_join::PlayerJoinEvent, Context, EventHandler}, // [!code --]
    server::Server,
};

#[plugin_method]
async fn on_load(&self, server: Arc<Context>) -> Result<(), String> {
    server.init_log();

    log::info!("Hello, Pumpkin!");

    server.register_event(Arc::new(MyJoinHandler), EventPriority::Lowest, true).await; // [!code ++]

    Ok(())
}
```

:::

Baue das Plugin und trete dem Server bei — die Willkommensnachricht sollte nun grün und personalisiert erscheinen.
