# Creating a new project

Pumpkin plugins use the [Cargo](https://doc.rust-lang.org/book/ch01-03-hello-cargo.html) build system.

The complete code for this plugin can be found as a [template on GitHub](https://github.com/BjornTheProgrammer/Hello-Pumpkin-Wasm).

## Installing the toolchain

Before we can compile a plugin, we have to have the `wasm32-wasip2` target installed. You can install the target
by running:

```bash
rustup target add wasm32-wasip2
```

## Initializing a new crate

First we need to create a new project folder. You can do this by running this command in the folder you created:

```bash
cargo new <project-name> --lib
```

After adding this, we want to create a new directory called `.cargo` and add in a `config.toml` file with the following
contents

```toml [config.toml]
[build]
target = "wasm32-wasip2"
```

Altogether your new folder structure should look like this:

```bash
├── .cargo/
│   └── config.toml
├── src/
│   └── lib.rs
├── Cargo.toml
└── Cargo.lock
```

## Configuring the crate

Since Pumpkin plugins are loaded at runtime as dynamic libraries, we need to tell Cargo to build this crate as one.
:::code-group

```toml [Cargo.toml]
[package]
name = "hello-pumpkin-wasm"
version = "0.1.0"
edition = "2024"

[lib] // [!code ++:2]
crate-type = ["cdylib"]

[dependencies]
```

:::

Next we need to add some basic dependencies from [crates.io](https://crates.io):
:::code-group

```toml [Cargo.toml]
[package]
name = "hello-pumpkin"
version = "0.1.0"
edition = "2024"

[lib]
crate-type = ["cdylib"]

[dependencies]
// [!code ++:5]
# This is the api crate that makes creating plugins easier, and has wit definitions
pumpkin-plugin-api = "0.1.0-dev+26.2-26.45"
# Optional: utilities for marketplace licensing and update checking
pumpkin-plugin-utils = "0.1.0-dev+26.2-26.45"
tracing = "0.1"
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
<small>Enables LTO only for release builds.</small>
