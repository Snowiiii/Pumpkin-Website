# 系統管理總覽

歡迎來到 Pumpkin 伺服器管理員專區。Pumpkin 是一款以 Rust 編寫的高效能、多執行緒 Minecraft 伺服器，專為支援大量玩家同時在線並保持極低的資源消耗而設計。

## 伺服器管理員的關鍵特色

- **極致多執行緒：** 從底層開始為現代多核心處理器量身打造。
- **WASM 外掛架構：** 支援使用 Rust、Python、Kotlin、C#、Go 或 C 進行安全且沙盒化的外掛執行，免除 JVM 的效能開銷。
- **原生跨 Proxy 支援：** 開箱即支援 Velocity、BungeeCord 以及現代 Proxy 轉送機制。
- **基於 TOML 的設定：** 提供簡潔且易於人類閱讀的設定檔，主設定位於 `pumpkin.toml`，並搭配特定功能的 TOML 設定檔。

## 管理指南與主題

請探索以下系統管理指南：

- [從 Bukkit / Paper / Spigot 伺服器遷移](./migrating-from-bukkit) — 伺服器管理、外掛、世界儲存與效能上的主要差異。
- [伺服器設定](../config/introduction) — `pumpkin.toml` 設定的詳細解析。
- [Proxy 設定](../config/proxy) — 設定 BungeeCord 與 Velocity 的玩家轉送。
- [指令](../config/commands)[與權限](../config/commands) — 管理遊戲內管理員 (OP) 指令與權限。
- [驗證](../config/authentication) — 線上模式與離線模式，以及 Yggdrasil 設定。
- [疑難排解](../troubleshooting/common_issues)[與常見問題](../troubleshooting/common_issues) — 解決連接埠綁定、記憶體與外掛載入等問題。