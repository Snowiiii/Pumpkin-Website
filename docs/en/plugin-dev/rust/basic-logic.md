# Writing the basic logic

## Plugin base

Even in a basic plugin, there is a lot going on under the hood, so to greatly simplify plugin development
we will use the `pumpkin-plugin-api` crate to create a basic empty plugin.

:::code-group

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

This will create an empty plugin and implement all the necessary methods for it to be loaded by Pumpkin.

## `Send + Sync` and interior mutability

`Plugin` requires `Send + Sync`, and `on_load`/`on_unload` (and every other lifecycle callback) take `&self`
rather than `&mut self`. This means your plugin type can be invoked concurrently from multiple threads, so any
mutable state it holds must use thread-safe interior mutability such as `std::sync::Mutex`, `RwLock`, or the
`std::sync::atomic` types, instead of plain fields you'd otherwise mutate through `&mut self`.

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

## Dependencies and permissions

The `dependencies` and `permissions` fields on `PluginMetadata` are empty above since our plugin doesn't need
either, but both are read by the host and change how your plugin is loaded and sandboxed:

- `dependencies` lists the `name` of other plugins that must finish loading before yours does. The server
  topologically sorts all plugins by this field, so if it is empty, your plugin loads without waiting on anything.
  If a named dependency isn't installed, the sort fails and your plugin does not load at all.
- `permissions` lists the host features your plugin needs access to, using the constants from
  `pumpkin_plugin_api::permissions`. The server only grants sandboxed access (networking, filesystem, env vars, ...)
  for permissions you declare here, and may prompt the server owner to approve them, depending on the server
  configuration and cached approval state.

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
            // Loaded only after "EconomyCore" has finished initializing
            dependencies: vec!["EconomyCore".into()],
            // Needed to make outbound HTTP requests, plus DNS to resolve the host
            permissions: vec![
                permissions::HTTP_OUTBOUND.into(),
                permissions::NETWORK_DNS.into(),
            ],
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
A `dependencies` entry must match the other plugin's `metadata.name` exactly, not its crate name.
:::

### Available permissions

| Constant | String | Description |
| --- | --- | --- |
| `NETWORK_DNS` | `network.dns` | Perform DNS resolution. |
| `NETWORK_TCP` | `network.tcp` | Use TCP sockets. |
| `NETWORK_TCP_CONNECT` | `network.tcp.connect` | Initiate outbound TCP connections. |
| `NETWORK_TCP_BIND` | `network.tcp.bind` | Bind TCP listeners (accept inbound connections). |
| `NETWORK_UDP` | `network.udp` | Use UDP sockets. |
| `NETWORK_UDP_CONNECT` | `network.udp.connect` | Send/receive UDP packets to specific destinations. |
| `NETWORK_UDP_BIND` | `network.udp.bind` | Bind UDP sockets to local ports. |
| `NETWORK_UDP_OUTGOING_DATAGRAM` | `network.udp.outgoingdatagram` | Send datagrams on a non-connected UDP socket. |
| `NETWORK_LOOPBACK` | `network.loopback` | Restricts all networking permissions above to loopback (localhost) only. |
| `NETWORK_OUTBOUND` | `network.outbound` | Make outbound TCP/UDP connections. Prefer the specific permissions above. |
| `HTTP_OUTBOUND` | `http.outbound` | Make outbound HTTP requests (`wasi:http`), separate from `NETWORK_OUTBOUND`'s raw sockets. |
| `FS_READ_DATA` | `fs.read.data` | Read files in the plugin's own data folder (`plugins/data/<name>`). |
| `FS_WRITE_DATA` | `fs.write.data` | Write (and read) files in the plugin's own data folder. Implies `FS_READ_DATA`. |
| `SYS_ENV` | `sys.env` | Read all environment variables. |
| `SYS_ENV_PREFIX` + name | `sys.env.<NAME>` | Read one specific environment variable, such as `sys.env.PATH`. |
| `SYS_INFO` | `sys.info` | Read system information (CPU, memory, OS). |
| `SYS_INFO_CPU` | `sys.info.cpu` | Read CPU information only. |
| `SYS_INFO_RAM` | `sys.info.ram` | Read RAM information only. |
| `SYS_INFO_OS` | `sys.info.os` | Read OS information only. |

We can now try to compile our plugin for the first time. To do so, run this command in your project folder:

```bash
cargo build --release
```

::: tip NOTE
Plugins are compiled to WebAssembly. If you do not have the target yet, install it once with
`rustup target add wasm32-wasip2`.
:::

You do not need to build in release mode, but it greatly reduces the size of the wasm plugin and
reduces startup times.

If all went well, you should be left with a message like this:

```log
╰─ cargo build --release
   Compiling hello-pumpkin-wasm v0.1.0 (/home/bjorn/Documents/GitHub/Hello-Pumpkin-Wasm)
    Finished `release` profile [optimized] target(s) in 0.05s
```

Now you can go to the `./target/wasm32-wasip2/release` folder (or `./target/wasm32-wasip2/debug`
if you didn't use `--release`) and locate your plugin binary. The filename will then be like the following.

```
hello_pumpkin_wasm.wasm
```

::: info NOTE
If you used a different project name in the `Cargo.toml` file, look for a file which contains your project name.
:::

You can rename this file to whatever you like, however you must keep the file extension (`.wasm`) the same.

## Testing the plugin

Now that we have our plugin binary, we can go ahead and test it on the Pumpkin server. Installing a plugin is as
simple as putting the plugin binary that we just built into the `plugins/` folder of your Pumpkin server!

When you start up the server and run the `/plugins` command, you should see an output like this:

```text
There is 1 plugin loaded:
hello-pumpkin-wasm
```

## Methods implemented on the `Context` object

```rust
fn get_server(&self) -> Server
```

Returns an instance of the server.

```rust
fn register_command(&self, command: Command, permission: &str)
```

Registers a new command handler, with the permission that is for the command.

```rust
fn register_event_handler<E, H>(&self, handler: H, event_priority: EventPriority, blocking: bool) -> Result<u32>
```

Registers a new event handler with a set priority and if it is blocking or not.
