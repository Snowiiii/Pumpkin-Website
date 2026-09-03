# 從 Bukkit / Spigot / Paper 遷移伺服器至 Pumpkin

將您的伺服器環境從 Paper/Spigot 切換到 Pumpkin 可帶來顯著的效能提升、多執行緒 tick 執行，並降低記憶體 (RAM) 使用量。然而，由於 Pumpkin 是以 Rust 打造，而非執行於 Java 虛擬機器 (JVM) 之上，伺服器管理員需要了解以下幾個根本的架構差異。

## 1. 伺服器主要差異一覽

| 功能 / 面向 | Bukkit / Spigot / Paper | Pumpkin |
| --- | --- | --- |
| 執行環境 | Java 虛擬機器 (JVM) | 原生執行檔 (Rust) |
| 主執行緒架構 | 單執行緒 tick 迴圈，並搭配非同步卸載 | 跨 CPU 核心的多執行緒 tick 執行 |
| 外掛引擎 | 針對 Java / Bukkit API 編譯的 `.jar` 檔案 | 執行於沙盒化 WASM 執行階段中的 `.wasm` WebAssembly 元件 |
| 外掛語言 | Java / Kotlin / Scala | Rust、Python、Kotlin、C#、Go、C |
| 設定格式 | `server.properties` 與 `paper.yml` / `spigot.yml` | `pumpkin.toml` 與結構化 TOML 設定檔 |
| 記憶體佔用量 | 基礎佔用量較高 (JVM 垃圾回收開銷) | 基礎佔用量極低 (原生記憶體管理) |

## 2. 外掛與擴充功能

- **Java `.jar` 外掛無法直接執行：** 標準的 Bukkit/Spigot `.jar` 外掛是針對 Java JVM 與 Bukkit API 編譯的位元碼，無法直接放入 Pumpkin 的 `plugins/` 目錄中執行。
- **WebAssembly 外掛：** Pumpkin 使用 WebAssembly (`.wasm`) 作為外掛格式。這不僅將外掛沙盒化以確保記憶體安全性與安全性，同時也讓開發者能夠使用幾乎任何語言來撰寫外掛。
- **移植外掛：** 如果您有維護自訂的內部外掛，請參閱我們的[開發者遷移指南](../plugin-dev/migrating-from-bukkit/index)，以了解如何將 Java 邏輯轉換為 Pumpkin 外掛綁定。

## 3. 設定與屬性

取代 `server.properties` 與 YAML 檔案，Pumpkin 將伺服器設定整合到簡潔的 TOML 檔案中：

| Paper / Spigot 設定 | Pumpkin `pumpkin.toml` 等效設定 |
| --- | --- |
| `server-port=25565` | `server_address = "0.0.0.0:25565"` |
| `motd=...` | `motd = "A Pumpkin Server"` |
| `max-players=20` | `max_players = 20` |
| `online-mode=true` | `online_mode = true` |
| `view-distance=10` | `view_distance = 10` |
| `simulation-distance=8` | `simulation_distance = 8` |

## 4. 世界與資料儲存

- **Anvil 格式相容性：** Pumpkin 可讀取標準的 Minecraft 區塊資料格式。
- **維度目錄：** 從 Paper/Spigot 伺服器安裝複製現有世界時，請確保 `world`、`world_nether` 和 `world_the_end` 目錄結構已正確對應。

## 5. 效能調校與啟動

與需要複雜 JVM 旗標（`-XX:+UseG1GC`、`-Xms`、`-Xmx`）的 Paper 伺服器不同，Pumpkin 以原生執行檔直接執行：

```shell
# 在 Linux/macOS 上啟動 Pumpkin 伺服器
./pumpkin

# 或透過 Docker 執行
docker run -p 25565:25565 -v ./data:/data pumpkinmc/pumpkin:latest
```

無需進行垃圾回收調校或 JVM 堆積記憶體配置調整。

## 管理員遷移檢查清單

- [ ] 備份您現有的 Paper/Spigot 伺服器資料與世界檔案。
- [ ] 將 `server.properties` 的設定值對應至 Pumpkin 的 `pumpkin.toml`。
- [ ] 檢查您必要的伺服器工具是否有可替代的 WebAssembly 外掛 (`.wasm`) 可供使用。
- [ ] 若您的伺服器運行於伺服器網路後方，請設定 Proxy 支援（`Velocity` / `BungeeCord`）。
- [ ] 執行 `./pumpkin` 並驗證玩家連線能力與效能紀錄。