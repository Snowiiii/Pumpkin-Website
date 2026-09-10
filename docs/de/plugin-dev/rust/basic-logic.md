# Grundlegende Logik schreiben

## Plugin-Basis

Ein einfaches Plugin benötigt im Hintergrund einiges an Komplexität. Daher wird versucht die Plugin-Entwicklung stark zu vereinfachen, weshalb das Crate `pumpkin-plugin-api` existiert, damit erstellen wir ein leerers Plugin:

```rust:line-numbers [lib.rs]
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
            dependencies: vec![],
            permissions: vec![],
        }
    }

    fn on_load(&self, _context: Context) -> pumpkin_plugin_api::Result<()> {
        info!("Hello from the example plugin!");
        Ok(())
    }

    fn on_unload(&self, _context: Context) -> pumpkin_plugin_api::Result<()> {
        info!("Example plugin unloaded. Goodbye!");
        Ok(())
    }
}

pumpkin_plugin_api::register_plugin!(HelloPlugin);
```

:::

Dies erzeugt ein leeres Plugin und implementiert alle nötigen Methoden, damit Pumpkin das Plugin laden kann.

## `Send + Sync` und interne Mutierbarkeit

`Plugin` verlangt `Send + Sync`, und `on_load`/`on_unload` (sowie jeder andere Lebenszyklus-Callback) nehmen
`&self` anstelle von `&mut self`. Das bedeutet, dass der Plugin-Typ kann aus mehreren Threads aufgerufen werden. Jeder
mutierbarer Zustand, den er hält, muss deshalb threadsichere interne Mutierbarkeit nutzen, wie etwa
`std::sync::Mutex`, `RwLock` oder die Typen aus `std::sync::atomic`, anstatt einfacher Felder, die ansonsten über
`&mut self` verändert würden.

```rust
use std::sync::atomic::{AtomicU32, Ordering};

struct HelloPlugin {
    load_count: AtomicU32,
}

impl Plugin for HelloPlugin {
    fn new() -> Self {
        HelloPlugin { load_count: AtomicU32::new(0) }
    }

    // ...

    fn on_load(&self, _context: Context) -> pumpkin_plugin_api::Result<()> {
        self.load_count.fetch_add(1, Ordering::Relaxed);
        Ok(())
    }
}
```

## Abhängigkeiten und Berechtigungen

Die Felder `dependencies` und `permissions` in `PluginMetadata` sind oben leer, weil unser Plugin beides nicht
braucht. Beide werden aber vom Host gelesen und ändern, wie dein Plugin geladen und sandboxed wird:

- `dependencies` listet den `name` anderer Plugins auf, welche vorher geladen werden müssen. Der Server
  sortiert alle Plugins topologisch nach diesem Feld. Ist es leer, lädt das Plugin ohne zu warten.
  Ist eine Abhängigkeit nicht installiert, schlägt das laden des Plugins fehl.
- `permissions` listet die Host-Funktionen auf, auf die das Plugin zugreifen muss. Der Server gewährt den sandboxed Zugriff (Netzwerk, Dateisystem,
  Umgebungsvariablen, ...) nur für die hier deklarierten Berechtigungen und fragt je nach Serverkonfiguration
  und zwischengespeichertem Freigabestand beim Serveradmin nach.

```rust:line-numbers [lib.rs]
use pumpkin_plugin_api::{Context, Plugin, PluginMetadata, permissions};

struct UpdateCheckerPlugin;
impl Plugin for UpdateCheckerPlugin {
    fn new() -> Self {
        UpdateCheckerPlugin
    }

    fn metadata(&self) -> PluginMetadata {
        PluginMetadata {
            name: "UpdateChecker".into(),
            version: env!("CARGO_PKG_VERSION").into(),
            authors: vec!["Bjorn".into()],
            description: "Pings a remote server to check for plugin updates".into(),
            // Wird erst geladen, nachdem "EconomyCore" initialisiert ist
            dependencies: vec!["EconomyCore".into()],
            // Nötig für ausgehende HTTP-Anfragen
            permissions: vec![permissions::HTTP_OUTBOUND.into()],
        }
    }

    fn on_load(&self, _context: Context) -> pumpkin_plugin_api::Result<()> {
        Ok(())
    }

    fn on_unload(&self, _context: Context) -> pumpkin_plugin_api::Result<()> {
        Ok(())
    }
}

pumpkin_plugin_api::register_plugin!(UpdateCheckerPlugin);
```

::: info NOTE
Ein Eintrag in `dependencies` muss exakt dem `metadata.name` des anderen Plugins entsprechen, nicht seinem
Crate-Namen.
:::

### Verfügbare Berechtigungen

| Konstante | String | Beschreibung |
| --- | --- | --- |
| `NETWORK_DNS` | `network.dns` | DNS-Auflösung durchführen. |
| `NETWORK_TCP` | `network.tcp` | TCP-Sockets verwenden. |
| `NETWORK_TCP_CONNECT` | `network.tcp.connect` | Ausgehende TCP-Verbindungen aufbauen. |
| `NETWORK_TCP_BIND` | `network.tcp.bind` | TCP-Listener binden (eingehende Verbindungen annehmen). |
| `NETWORK_UDP` | `network.udp` | UDP-Sockets verwenden. |
| `NETWORK_UDP_CONNECT` | `network.udp.connect` | UDP-Pakete an bestimmte Ziele senden/empfangen. |
| `NETWORK_UDP_BIND` | `network.udp.bind` | UDP-Sockets an lokale Ports binden. |
| `NETWORK_UDP_OUTGOING_DATAGRAM` | `network.udp.outgoingdatagram` | Datagramme über ein nicht verbundenes UDP-Socket senden. |
| `NETWORK_LOOPBACK` | `network.loopback` | Beschränkt alle obigen Netzwerkberechtigungen auf Loopback (localhost). |
| `NETWORK_OUTBOUND` | `network.outbound` | Ausgehende TCP/UDP-Verbindungen aufbauen. Bevorzuge die spezifischen Berechtigungen oben. |
| `HTTP_OUTBOUND` | `http.outbound` | Ausgehende HTTP-Anfragen stellen (`wasi:http`), getrennt von den rohen Sockets aus `NETWORK_OUTBOUND`. |
| `FS_READ_DATA` | `fs.read.data` | Dateien im eigenen Datenordner des Plugins lesen (`plugins/data/<name>`). |
| `FS_WRITE_DATA` | `fs.write.data` | Dateien im eigenen Datenordner schreiben (und lesen). Impliziert `FS_READ_DATA`. |
| `SYS_ENV` | `sys.env` | Alle Umgebungsvariablen lesen. |
| `SYS_ENV_PREFIX` + Name | `sys.env.<NAME>` | Eine bestimmte Umgebungsvariable lesen, etwa `sys.env.PATH`. |
| `SYS_INFO` | `sys.info` | Systeminformationen lesen (CPU, Arbeitsspeicher, Betriebssystem). |
| `SYS_INFO_CPU` | `sys.info.cpu` | Nur CPU-Informationen lesen. |
| `SYS_INFO_RAM` | `sys.info.ram` | Nur RAM-Informationen lesen. |
| `SYS_INFO_OS` | `sys.info.os` | Nur Betriebssystem-Informationen lesen. |

Jetzt können wir unser Plugin zum ersten Mal kompilieren. Führe dazu diesen Befehl in deinem Projektordner aus:

```bash
cargo build --release
```

::: tip HINWEIS
Plugins werden nach WebAssembly kompiliert. Falls das Target noch fehlt, installiere es einmalig mit
`rustup target add wasm32-wasip2`.
:::

Du musst nicht im Release-Modus bauen, das verringert aber die Größe des WASM-Plugins deutlich und verkürzt die
Startzeiten.

Wenn alles gut gegangen ist, sollte eine Nachricht wie diese angezeigt werden:

```log
╰─ cargo build --release
   Compiling hello-pumpkin-wasm v0.1.0 (/home/bjorn/Documents/GitHub/Hello-Pumpkin-Wasm)
    Finished `release` profile [optimized] target(s) in 0.05s
```

Nun kannst du in den Ordner `./target/wasm32-wasip2/release` wechseln (oder `./target/wasm32-wasip2/debug`, falls
du `--release` nicht verwendet hast) und dort deine Plugin-Binärdatei finden. Der Dateiname sieht dann so aus:

```
hello_pumpkin_wasm.wasm
```

::: info NOTE
Wenn du in der `Cargo.toml` einen anderen Projektnamen verwendet hast, suche nach einer Datei, die deinen
Projektnamen enthält.
:::

Du kannst die Datei beliebig umbenennen, musst aber die Dateiendung (`.wasm`) beibehalten.

## Plugin testen

Ein Plugin zu installieren heißt schlicht, die eben gebaute Binärdatei in den Ordner `plugins/` deines Pumpkin-Servers zu
legen.

Starte den Server neu und führe den Befehl `/plugins` aus, dann solltest du eine Ausgabe wie diese sehen:

```text
There is 1 plugin loaded:
hello-pumpkin-wasm
```

## Methoden auf dem `Context`-Objekt

```rust
fn get_server(&self) -> Server
```

Gibt eine Instanz des Servers zurück.

```rust
fn register_command(&self, command: Command, permission: &str)
```

Registriert einen neuen Befehls-Handler zusammen mit der Berechtigung für diesen Befehl.

```rust
fn register_event_handler<E, H>(&self, handler: H, event_priority: EventPriority, blocking: bool) -> Result<u32>
```

Registriert einen neuen Event-Handler mit gesetzter Priorität und der Angabe, ob er blockierend ist.
