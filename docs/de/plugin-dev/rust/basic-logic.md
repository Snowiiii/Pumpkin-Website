# Grundlegende Logik schreiben

## Plugin‑Basis

Auch ein einfaches Plugin hat unter der Haube einiges an Komplexität. Um die Plugin‑Entwicklung stark zu vereinfachen, verwenden wir die `pumpkin-api-macros`‑Crate, um ein einfaches leeres Plugin zu erstellen.

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

Dies erzeugt ein leeres Plugin und implementiert alle nötigen Methoden, damit Pumpkin das Plugin laden kann.

Kompiliere das Plugin mit:

```bash
cargo build --release
```

::: tip NOTICE
Unter Windows **muss** das Flag `--release` verwendet werden, sonst können Probleme auftreten. Auf anderen Plattformen ist das Flag optional, reduziert aber in der Regel die Kompilierdauer bei späteren Builds.
:::

Wenn alles gut gegangen ist, sollte eine Nachricht wie diese angezeigt werden:

```log
╰─ cargo build --release
   Compiling hello-pumpkin v0.1.0 (/home/vypal/Dokumenty/GitHub/hello-pumpkin)
    Finished `release` profile [optimized] target(s) in 0.68s
```

Nun kannst du in den Ordner `./target/release` (oder `./target/debug`, falls nicht `--release` verwendet wurde) wechseln und dort deine Plugin-Binärdatei finden.

Je nach Betriebssystem trägt die Datei eine der folgenden Endungen:

- Windows: `hello-pumpkin.dll`
- macOS: `libhello-pumpkin.dylib`
- Linux: `libhello-pumpkin.so`

::: info NOTE
Wenn du in der `Cargo.toml` einen anderen Projektnamen verwendet hast, suche nach einer Datei, die deinen Projektnamen enthält.
:::

Du kannst die Datei umbenennen, musst aber die Dateiendung (`.dll`, `.dylib`, `.so`) beibehalten.

## Plugin testen

Kopiere das Binary in den `plugins/`‑Ordner deines Pumpkin‑Servers. Dank des `#[plugin_impl]`‑Macros sind Metadaten wie Name, Autoren, Version und Beschreibung im Binary eingebettet und für den Server lesbar.

Starte den Server und führe `/plugins` aus — du solltest eine Ausgabe wie diese sehen:

```text
There is 1 plugin loaded:
hello-pumpkin
```

## Grundlegende Methoden

Der Pumpkin‑Server nutzt aktuell zwei „Methoden“, um das Plugin über seinen Zustand zu informieren: `on_load` und `on_unload`.

Diese Methoden müssen nicht zwingend implementiert werden, doch in der Regel implementiert man mindestens `on_load`. Diese Methode erhält ein `Context`‑Objekt, das dem Plugin Informationen über den Server gibt und es ermöglicht, Befehle und Events zu registrieren.

Um diese Methoden zu vereinfachen, stellt `pumpkin-api-macros` ein weiteres Macro bereit.

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

::: warning IMPORTANT
Definiere Plugin‑Methoden stets vor dem `#[plugin_impl]`‑Block.
:::

Die Methode erhält eine veränderbare Referenz auf das Plugin‑Objekt (hier `MyPlugin`) und das `Context`‑Objekt, das spezifisch für dieses Plugin anhand seiner Metadaten konstruiert wird.

### Methoden im `Context`‑Objekt (Auszug)

```rust
fn get_data_folder() -> String
```
Gibt den Pfad zum plugin‑spezifischen Datenordner zurück.

```rust
async fn get_player_by_name(player_name: String) -> Option<Arc<Player>>
```
Gibt, falls ein Spieler online ist, eine Referenz auf diesen zurück.

```rust
async fn register_command(tree: CommandTree, permission: PermissionLvl)
```
Registriert einen neuen Befehls‑Handler mit minimal erforderlichem Berechtigungslevel.

```rust
async fn register_event(handler: Arc<H>, priority: EventPriority, blocking: bool)
```
Registriert einen Event‑Handler mit Priorität und Angabe, ob er blockierend ist.

## Einfaches on_load Beispiel

In `on_load` initialisieren wir das Pumpkin‑Logging und geben eine Info‑Nachricht aus, damit wir sehen, dass das Plugin geladen wurde:

:::code-group

```rust [lib.rs]
#[plugin_method]
async fn on_load(&self, server: Arc<Context>) -> Result<(), String> {
    server.init_log(); // [!code ++:3]

    log::info!("Hello, Pumpkin!");

    Ok(())
}
```

:::

Baue das Plugin erneut und starte den Server; du solltest nun die Log‑Nachricht sehen.
