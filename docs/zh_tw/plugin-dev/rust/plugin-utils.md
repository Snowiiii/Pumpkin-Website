# 授權與更新 (`pumpkin-plugin-utils`)

`pumpkin-plugin-utils` 是 Pumpkin Rust 外掛的官方工具 crate。它提供了授權檢查、加密簽章驗證，以及針對 [Pumpkin 市集](https://market.pumpkinmc.org) 的更新檢查等內建工具。

## 功能

- **離線 Ed25519 簽章驗證：** 在啟動時以 `< 1ms` 的時間驗證外掛完整性與內嵌的市集元資料，且不會阻塞伺服器。
- **全域元資料快取：** 在外掛的 `on_load` 生命週期方法中呼叫一次 `init(&context)` 即可全域快取已驗證的元資料。
- **線上授權驗證：** 查詢市集 `/api/v1/rest/check-license` 端點，並自動進行 7 天租約快取 (`license_lease.json`)。
- **離線寬限期：** 具彈性的離線租約評估，確保您的外掛在市集維護或網路中斷期間仍能正常運作。
- **零參數更新檢查：** 輕鬆檢查市集上是否有更新版本的外掛。
- **動態公鑰解析：** 透過主機 WIT 匯入或 HTTPS 回退動態解析市集公鑰，無需硬編碼金鑰。

## 新增相依套件

在您的外掛 `Cargo.toml` 中，將 `pumpkin-plugin-utils` 與 `pumpkin-plugin-api` 一起新增：

:::code-group
```toml
[package]
name = "my-plugin"
version = "0.1.0"
edition = "2024"
[lib]
crate-type = ["cdylib"]
[dependencies]
pumpkin-plugin-api = { version = "0.1.0", git = "https://github.com/Pumpkin-MC/Pumpkin", package = "pumpkin-plugin-api" }
pumpkin-plugin-utils = { version = "0.1.0", git = "https://github.com/Pumpkin-MC/Pumpkin", package = "pumpkin-plugin-utils" }
tracing = "0.1"
```
:::

## 初始化

在執行授權或更新檢查之前，請使用外掛的 `Context` 在外掛的 `on_load` 方法中初始化工具 crate：

```rust
use pumpkin_plugin_api::{Context, Plugin, PluginMetadata};
use tracing::{info, warn};

struct MyPlugin;

impl Plugin for MyPlugin {
    fn new() -> Self {
        Self
    }

    fn metadata(&self) -> PluginMetadata {
        PluginMetadata {
            name: "MyPlugin".into(),
            version: env!("CARGO_PKG_VERSION").into(),
            authors: vec!["Author".into()],
            description: "Plugin with license and update checks".into(),
        }
    }

    fn on_load(&mut self, context: Context) -> pumpkin_plugin_api::Result<()> {
        // 初始化 pumpkin-plugin-utils（驗證簽章並快取元資料）
        let metadata = pumpkin_plugin_utils::init(&context)
            .map_err(|e| format!("Initialization failed: {e}"))?;

        info!(
            "Loaded plugin '{}' v{} (Dev: {})",
            metadata.plugin_name, metadata.version, metadata.dev_name
        );
        Ok(())
    }
}
```

::: info `init` 期間會發生什麼？
1. 在伺服器目錄中找到外掛的 `.wasm` 二進位檔。
2. 擷取 `pumpkin.metadata` 和 `wasm_signature` 自訂區段。
3. 以加密方式驗證 WASM 二進位檔和元資料上的 Ed25519 簽章。
4. 全域快取已驗證的 `PumpkinMetadata` 以供後續呼叫使用。
:::

## 檢查更新

`pumpkin-plugin-utils` 提供零參數自動檢查和自訂手動檢查。

### 1. 自動更新檢查（推薦）

初始化完成後，無需傳入參數即可呼叫 `pumpkin_plugin_utils::check_for_updates()`。它會自動使用快取的外掛名稱、目前版本和市集端點：

```rust
use tracing::{info, warn};

fn check_updates() {
    match pumpkin_plugin_utils::check_for_updates() {
        Ok(update) => {
            if update.update_available {
                info!(
                    "A new update is available: {}!",
                    update.latest_version.as_deref().unwrap_or("unknown")
                );
            } else {
                info!("Plugin is up to date.");
            }
        }
        Err(err) => {
            warn!("Failed to check for updates: {err}");
        }
    }
}
```

### 2. 手動更新檢查 (`UpdateChecker`)

如果您想要手動指定外掛名稱、版本或自訂市集網址，請使用 `UpdateChecker`：

```rust
use pumpkin_plugin_utils::UpdateChecker;

let checker = UpdateChecker::new();
let response = checker.check_for_updates(
    "my-plugin",
    "1.0.0",
    "https://market.pumpkinmc.org",
)?;

if response.update_available {
    println!("Update found: {:?}", response.latest_version);
}
```

### 更新回應結構

更新檢查會回傳一個 `CheckUpdateResponse`：

```rust
pub struct CheckUpdateResponse {
    /// 市集上是否有較新的穩定版本。
    pub update_available: bool,
    /// 最新的穩定版本字串（如果可用）。
    pub latest_version: Option<String>,
}
```

## 檢查與驗證授權

`pumpkin-plugin-utils` 支援針對市集 API 的線上驗證，以及可設定寬限期的離線租約管理。

### 1. 線上授權檢查

若要針對市集驗證授權（`GET /api/v1/rest/check-license`）：

```rust
// 傳入 `None` 以使用元資料中內嵌的授權金鑰
let response = pumpkin_plugin_utils::check_license_online(None)
    .map_err(|e| format!("License verification failed: {e}"))?;

if response.valid {
    info!("License is valid (status: {})", response.status);
} else {
    warn!("License is invalid: {}", response.status);
    return Err(format!("Invalid license status: {}", response.status).into());
}
```

#### 提供自訂授權金鑰覆寫

如果您的外掛允許伺服器擁有者在 `config.toml` 檔案中設定授權金鑰，請傳入 `Some(&key)`：

```rust
let config_key = "LIC-CUSTOM-KEY-12345";
let response = pumpkin_plugin_utils::check_license_online(Some(config_key))?;
```

::: tip 7 天租約快取
成功的線上檢查會自動將已驗證的租約檔案 (`license_lease.json`) 儲存到外掛的資料資料夾中，有效期限為 7 天。
:::

### 2. 使用寬限期評估授權

若要在伺服器離線或無法連線至市集時，仍讓付費外掛正常運作，請使用 `evaluate_license`：

```rust
use pumpkin_plugin_utils::LicenseStatus;
use tracing::{info, warn};

// 指定寬限期天數（例如 7 天）
let grace_period_days = 7;

match pumpkin_plugin_utils::evaluate_license(grace_period_days) {
    LicenseStatus::Valid(meta) => {
        info!("License valid for buyer (User ID: {})", meta.user_id);
    }
    LicenseStatus::GracePeriod { metadata, days_remaining, reason } => {
        warn!(
            "Running in offline grace period ({} days remaining). Reason: {}",
            days_remaining, reason
        );
    }
    LicenseStatus::Invalid(reason) => {
        return Err(format!("Plugin license invalid or tampered: {reason}").into());
    }
    LicenseStatus::Unsigned => {
        info!("Plugin is running in unsigned / development mode.");
    }
}
```

### `LicenseStatus` 列舉

| 變體 | 說明 |
| --- | --- |
| `LicenseStatus::Valid(PumpkinMetadata)` | 授權有效、已驗證，或外掛為免費 / 開源。 |
| `LicenseStatus::GracePeriod { metadata, days_remaining, reason }` | 使用先前已驗證的租約在離線模式下運作，且仍在允許的寬限期內。 |
| `LicenseStatus::Invalid(String)` | 簽章無效、已過期、已撤銷，或元資料已被竄改。 |
| `LicenseStatus::Unsigned` | 二進位檔不包含市集元資料/簽章（在本機開發時很有用）。 |

## 存取外掛元資料

您可以使用 `get_metadata` 或 `metadata()` 在程式碼庫中的任何位置存取已驗證的外掛元資料：

```rust
if let Some(meta) = pumpkin_plugin_utils::get_metadata() {
    println!("Plugin Name: {}", meta.plugin_name);
    println!("Plugin Version: {}", meta.version);
    println!("Is Paid: {}", meta.is_paid);
    println!("License Key: {:?}", meta.license_key);
    println!("Buyer User ID: {}", meta.user_id);
    println!("Developer: {} (ID: {})", meta.dev_name, meta.dev_id);
    println!("Marketplace URL: {}", meta.marketplace_url);
    println!("Issued At: {}", meta.issued_at);
}
```

### `PumpkinMetadata` 欄位

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `plugin_name` | `String` | 市集上的標準外掛名稱。 |
| `version` | `String` | 外掛二進位檔的 SemVer 版本字串。 |
| `plugin_id` | `i64` | 市集上的唯一外掛識別碼。 |
| `dev_id` | `i64` | 開發者帳號 ID。 |
| `dev_name` | `String` | 開發者顯示名稱。 |
| `is_paid` | `bool` | 如果這是付費 / 商業外掛則為 `true`。 |
| `user_id` | `i64` | 買家 / 授權使用者的使用者 ID（免費外掛為 `0`）。 |
| `license_key` | `Option<String>` | 發行給授權使用者的唯一授權金鑰。 |
| `marketplace_url` | `String` | 市集基礎網址（`https://market.pumpkinmc.org`）。 |
| `issued_at` | `String` | 二進位檔 / 授權發行時的 ISO-8601 時間戳記。 |

## 完整範例

以下是一個結合初始化、線上授權檢查、離線寬限期和更新檢查的完整外掛實作：

:::code-group
```rust
use pumpkin_plugin_api::{Context, Plugin, PluginMetadata};
use pumpkin_plugin_utils::LicenseStatus;
use tracing::{error, info, warn};

struct CommercialPlugin;

impl Plugin for CommercialPlugin {
    fn new() -> Self {
        Self
    }

    fn metadata(&self) -> PluginMetadata {
        PluginMetadata {
            name: "CommercialPlugin".into(),
            version: env!("CARGO_PKG_VERSION").into(),
            authors: vec!["Developer".into()],
            description: "A commercial Pumpkin plugin".into(),
        }
    }

    fn on_load(&mut self, context: Context) -> pumpkin_plugin_api::Result<()> {
        // 1. 初始化 plugin-utils（驗證 Ed25519 簽章並快取元資料）
        let meta = pumpkin_plugin_utils::init(&context).map_err(|err| {
            error!("Signature verification failed: {err}");
            format!("Security verification error: {err}")
        })?;

        info!("Loaded {} v{}", meta.plugin_name, meta.version);

        // 2. 驗證授權（離線評估 + 線上檢查）
        match pumpkin_plugin_utils::evaluate_license(7) {
            LicenseStatus::Valid(_) => {
                info!("Local license status: Valid");
            }
            LicenseStatus::GracePeriod { days_remaining, .. } => {
                warn!("Local license in grace period: {days_remaining} days remaining");
            }
            LicenseStatus::Unsigned => {
                info!("Running in development mode (unsigned binary)");
            }
            LicenseStatus::Invalid(reason) => {
                error!("Invalid license: {reason}");
                return Err(format!("License verification failed: {reason}").into());
            }
        }

        // 3. 如果為付費外掛，進行線上授權檢查
        if meta.is_paid {
            if let Ok(check) = pumpkin_plugin_utils::check_license_online(None) {
                if !check.valid {
                    return Err(format!("Online license rejected: {}", check.status).into());
                }
                info!("Online license check confirmed: {}", check.status);
            } else {
                warn!("Online license verification unreachable, falling back to local lease");
            }
        }

        // 4. 檢查更新
        if let Ok(update) = pumpkin_plugin_utils::check_for_updates() {
            if update.update_available {
                info!(
                    "A new version is available on the marketplace: {}",
                    update.latest_version.as_deref().unwrap_or("unknown")
                );
            }
        }

        Ok(())
    }

    fn on_unload(&mut self, _context: Context) -> pumpkin_plugin_api::Result<()> {
        info!("CommercialPlugin unloaded.");
        Ok(())
    }
}

pumpkin_plugin_api::register_plugin!(CommercialPlugin);
```
:::