# 快速入門

本指南將協助您開始使用 Kotlin 編寫 Pumpkin 伺服器外掛。

:::warning
在 Kotlin + Wasm 元件工具鏈更加成熟之前，將會有一些奇怪之處與不便之處。
也預期會遇到錯誤 (Bug)。
:::

## 先決條件

在開始之前，請確保您已安裝以下工具：

- **JDK 17 或更新版本**
  - 用於執行 Gradle 9.4
- **[Rust](https://rust-lang.org/)**
  - 這是必需的，因為一個關鍵元件 (wit-bindgen) 是以 Rust 編寫的，並且必須從特定的支援 Kotlin 的 fork 進行建置。
  - 您只需要為您的主機平台安裝預設的 Rust。不需要為任何 WebAssembly 目標安裝
- **[wasm-tools](https://github.com/bytecodealliance/wasm-tools)**
  - 用於將 Kotlin 產生的 Wasm 打包為元件
- **Make**（例如 [GNU Make](https://www.gnu.org/software/make/)）
  - 用於執行便捷的 `Makefile`。您也可以選擇不使用它，並手動執行其中包含的步驟。

## 設定專案

與大多數其他可用的 API 套件不同，[pumpkin-api-kt](https://github.com/Pumpkin-MC/pumpkin-api-kt) 是一個**範本**，而不是例如 Maven 套件。

首先，複製該範本（並可依您的喜好重新命名）：

```shell
git clone --recurse-submodules https://github.com/Pumpkin-MC/pumpkin-api-kt
mv pumpkin-api-kt my_kotlin_plugin
cd my_kotlin_plugin
```

接下來，我們需要更新 `wit` 子模組，以使用最新版本的 Pumpkin 外掛 API。

```shell
cd wit
git pull origin master
cd ..
```

最後，重新命名 Gradle 專案。更改 `settings.gradle.kts` 中的 `rootProject.name`，以及 `Makefile` 中的 `PROJECT_NAME`。兩者必須一致。您為專案命名的名稱，將會是產生的 Wasm 的檔案名稱。

## 建立您的第一個外掛

作為範本的一部分，一個基本外掛已在 `src/wasmWasiMain/kotlin/plugin/Plugin.kt` 中實作。

您可以自由修改底部的中繼資料。然而，在更改任何其他內容之前，建議您先建置外掛（請參閱下一節），這樣綁定就會被產生，並且 IDE 自動完成可以正常運作於 `pumpkin`。

## 建置外掛

若要將您的外掛建置為 WebAssembly 元件：

```shell
make
```

編譯後的 `.wasm` 檔案將位於 `build` 中。您可以將此檔案放入 Pumpkin 伺服器的 `plugins` 資料夾中。

請注意，第一次執行時可能需要花費一些時間，因為它需要從 Rust 原始碼建置 `wit-bindgen`。

執行 `make` 每次都會檢查 `wit-bindgen` 的更新。在初始設定之後，您可能希望改用 `make componentify` 來避免這種情況。

## 疑難排解

### 連結器錯誤

如果您開始遇到類似以下的錯誤：

```
main ThreadId(01) pumpkin::plugin: Failed to load plugin from
"./plugins/my_plugin.wasm": Wasm plugin initialization error: plugin failed
to load with error: component imports instance 'pumpkin:plugin/gui@0.1.0', but
a matching implementation was not found in the linker
```

或在將外掛載入 Pumpkin 時遇到其他「連結器」錯誤，請更新 `wit` 子模組。

```shell
cd wit
git pull origin master
cd ..
```