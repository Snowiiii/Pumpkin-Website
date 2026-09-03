# 遷移設定與資料儲存

Bukkit 外掛嚴重依賴 `config.yml`、`YamlConfiguration` 以及 Bukkit 設定序列化系統。
在 Pumpkin 中，WebAssembly 外掛運行於安全的沙盒環境中，設定檔可以使用 TOML、JSON 或 YAML 等標準格式進行原生處理。

## 主要差異

| 功能 | Bukkit / Spigot | Pumpkin |
| --- | --- | --- |
| 設定檔格式 | `config.yml`（YAML 格式） | 靈活：TOML、JSON 或自訂檔案 |
| 預設設定產生 | `saveDefaultConfig()` | 從外掛目錄讀取設定或內嵌 WASM 資源 |
| 資料解析 | `getConfig().getString(...)` | 原生 serde / JSON / TOML 反序列化 |
| 檔案 I/O 沙盒化 | 任何地方的直接檔案系統存取 | 授予 WASM 外掛的沙盒化目錄存取權 |

## 程式碼比較：載入設定

### 1. Bukkit 實作 (Java)

```java
public class ConfigExample extends JavaPlugin {
    @Override
    public void onEnable() {
        saveDefaultConfig(); // 從 jar 資源儲存 config.yml
        FileConfiguration config = getConfig();
        String welcomeMsg = config.getString("welcome-message", "Default welcome!");
        int maxItems = config.getInt("max-items", 10);
        getLogger().info("Loaded message: " + welcomeMsg);
    }
}
```

### 2. Pumpkin 實作 (Rust)

在 Pumpkin 中，您可以 derive `serde::Deserialize` 來解析簡潔的 TOML 設定檔：

```rust
use serde::Deserialize;
use std::fs;

#[derive(Deserialize, Debug)]
pub struct PluginConfig {
    pub welcome_message: String,
    pub max_items: i32,
}

impl Default for PluginConfig {
    fn default() -> Self {
        Self {
            welcome_message: "Default welcome!".to_string(),
            max_items: 10,
        }
    }
}

pub fn load_config() -> PluginConfig {
    let config_path = "plugins/my_plugin/config.toml";
    if let Ok(content) = fs::read_to_string(config_path) {
        toml::from_str(&content).unwrap_or_default()
    } else {
        PluginConfig::default()
    }
}
```