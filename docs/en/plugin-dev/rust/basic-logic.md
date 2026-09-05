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

    fn on_load(&mut self, _context: Context) -> pumpkin_plugin_api::Result<()> {
        info!("Hello from the example plugin!");
        Ok(())
    }

    fn on_unload(&mut self, _context: Context) -> pumpkin_plugin_api::Result<()> {
        info!("Example plugin unloaded. Goodbye!");
        Ok(())
    }
}

pumpkin_plugin_api::register_plugin!(HelloPlugin);
```

:::

This will create an empty plugin and implement all the necessary methods for it to be loaded by Pumpkin.

We can now try to compile our plugin for the first time. To do so, run this command in your project folder:

```bash
cargo build --release
```

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
