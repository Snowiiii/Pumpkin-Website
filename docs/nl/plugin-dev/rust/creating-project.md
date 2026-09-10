<!-- TODO(i18n): outdated, plugin crates come from crates.io now, not git. -->

# Creating a new project
Pumpkin Plugins use the [Cargo](https://doc.rust-lang.org/book/ch01-03-hello-cargo.html) build system.

The complete code for this plugin can be found as a [template on GitHub](https://github.com/vyPal/Hello-Pumpkin).

## Initializing a new crate
First we need to create a new project folder,you can do this by running this command in the folder you created:
```bash
cargo new <project-name> --lib
```
This will create a folder with a couple files in it. The folder structure should look like this:
```
├── Cargo.toml
└── src
    └── lib.rs
```

## Configuring the crate
Since Pumpkin Plugins are loaded at runtime as dynamic libraries, we need to tell Cargo to build this crate as one.
:::code-group
```toml [Cargo.toml] 
[package]
name = "hello-pumpkin"
version = "0.1.0"
edition = "2024"

[lib] // [!code ++:3]
crate-type = ["cdylib"]

[dependencies]
```

:::

Next we need to add some basic dependencies. Since Pumpkin is still in early development, the internal crates aren't published to crates.io, so we need to tell Cargo to download the dependencies directly from GitHub.
:::code-group
```toml [Cargo.toml]
[package]
name = "hello-pumpkin"
version = "0.1.0"
edition = "2024"

[lib]
crate-type = ["cdylib"]

[dependencies]
// [!code ++:13]
# This is the base crate with most high-level type definitions
pumpkin = { git = "https://github.com/Pumpkin-MC/Pumpkin.git", branch = "master", package = "pumpkin" } 
# Other utilities used by Pumpkin (e.g. TextComponent, Vectors...)
pumpkin-util = { git = "https://github.com/Pumpkin-MC/Pumpkin.git", branch = "master", package = "pumpkin-util" }
# Macros for easier plugin development
pumpkin-api-macros = { git = "https://github.com/Pumpkin-MC/Pumpkin.git", branch = "master", package = "pumpkin-api-macros" }

# A rust asynchronous runtime
tokio = "1.48"
# Logging
log = "0.4"
```

:::

For improved performance and smaller file sizes, we recommend enabling Link-Time Optimization (LTO).  
Be aware that this will increase compilation time.
:::code-group
```toml [Cargo.toml]
[profile.release] // [!code ++:2]
lto = true
```
:::
<small>Only enables LTO for release builds</small>
