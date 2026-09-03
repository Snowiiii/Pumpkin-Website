# 建立新專案

Pumpkin 外掛使用 [Cargo](https://doc.rust-lang.org/book/ch01-03-hello-cargo.html) 建置系統。
此外掛的完整程式碼可以在 [GitHub 範本](https://github.com/BjornTheProgrammer/Hello-Pumpkin-Wasm) 中找到。

## 安裝工具鏈

在編譯外掛之前，我們必須安裝 `wasm32-wasip2` 目標。您可以執行以下指令來安裝目標：

```shell
rustup target add wasm32-wasip2
```

## 初始化新 crate

首先，我們需要建立一個新的專案資料夾。您可以在您建立的資料夾中執行以下指令：

```shell
cargo new <project-name> --lib
```

新增後，我們需要建立一個名為 `.cargo` 的新目錄，並在其中新增一個包含以下內容的 `config.toml` 檔案：

```toml
[build]
target = "wasm32-wasip2"
```

您的新資料夾結構整體應該如下所示：

```
├── .cargo/
│   └── config.toml
├── src/
│   └── lib.rs
├── Cargo.toml
└── Cargo.lock
```

## 設定 crate

由於 Pumpkin 外掛在執行階段以動態函式庫的形式載入，我們需要告訴 Cargo 將此 crate 建置為動態函式庫。

:::code-group
```toml
[package]
name = "hello-pumpkin-wasm"
version = "0.1.0"
edition = "2024"
[lib] // [!code ++:2]
crate-type = ["cdylib"]
[dependencies]
```
:::

接下來，我們需要新增一些基本相依套件。由於 Pumpkin 仍處於早期開發階段，內部 crate 尚未發布至 crates.io，因此我們需要告訴 Cargo 直接從 GitHub 下載相依套件。

:::code-group
```toml
[package]
name = "hello-pumpkin"
version = "0.1.0"
edition = "2024"
[lib]
crate-type = ["cdylib"]
[dependencies]
// [!code ++:5]
# 這是讓建立外掛更容易的 API crate，並包含 wit 定義
pumpkin-plugin-api = { version = "0.1.0", git = "https://github.com/Pumpkin-MC/Pumpkin", package = "pumpkin-plugin-api" }
# 選用：市集授權與更新檢查的工具
pumpkin-plugin-utils = { version = "0.1.0", git = "https://github.com/Pumpkin-MC/Pumpkin", package = "pumpkin-plugin-utils" }
tracing = "0.1"
```
:::

為了提升效能並縮減檔案大小，我們建議啟用連結期最佳化 (LTO)。
請注意，這會增加編譯時間。

:::code-group
```toml
[profile.release] // [!code ++:2]
lto = true
```
:::

<small>僅在 release 建置中啟用 LTO。</small>