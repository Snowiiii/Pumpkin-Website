<!-- TODO(i18n): outdated, plugin crates come from crates.io now, not git. -->

# 创建新项目

Pumpkin 插件使用 [Cargo](https://doc.rust-lang.org/book/ch01-03-hello-cargo.html) 构建系统。

此插件的完整代码可以在 [GitHub 上的模板](https://github.com/vyPal/Hello-Pumpkin)中找到。

## 初始化新的 crate

首先我们需要创建一个新的项目文件夹。您可以通过在您创建的文件夹中运行以下命令来完成：

```bash
cargo new <项目名称> --lib
```

这将创建一个包含几个文件的文件夹。文件夹结构应该如下所示：

```bash
├── Cargo.toml
└── src
    └── lib.rs
```

## 配置 crate

由于 Pumpkin 插件在运行时作为动态库加载，我们需要告诉 Cargo 将此 crate 构建为动态库。
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

接下来我们需要添加一些基本依赖项。由于 Pumpkin 仍处于早期开发阶段，内部crate尚未发布到 crates.io，所以我们需要告诉 Cargo 直接从 GitHub 下载依赖项。
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
# 这是包含大多数高级类型定义的基本 crate
pumpkin = { git = "https://github.com/Pumpkin-MC/Pumpkin.git", branch = "master", package = "pumpkin" } 
# Pumpkin 使用的其他工具（如 TextComponent、Vectors 等）
pumpkin-util = { git = "https://github.com/Pumpkin-MC/Pumpkin.git", branch = "master", package = "pumpkin-util" }
# 简化插件开发的宏
pumpkin-api-macros = { git = "https://github.com/Pumpkin-MC/Pumpkin.git", branch = "master", package = "pumpkin-api-macros" }

# Rust 异步运行时
tokio = "1.48"
# 日志记录
log = "0.4"
```

:::

为了提高性能和减小文件大小，我们建议启用链接时优化（Link-Time Optimization，LTO）。  
请注意，这将增加编译时间。
:::code-group

```toml [Cargo.toml]
[profile.release] // [!code ++:2]
lto = true
```

:::
<small>建议仅对发布版本启用 LTO。</small>
