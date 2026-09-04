# Licensing & Updates (`pumpkin-plugin-utils`)

`pumpkin-plugin-utils` is an official utility crate for Pumpkin Rust plugins. It provides built-in tools for **licensing checks**, **cryptographic signature verification**, and **update checks** against the [Pumpkin Marketplace](https://market.pumpkinmc.org).

## Features

- **Offline Ed25519 Signature Verification**: Verifies plugin integrity and embedded marketplace metadata in `< 1ms` on startup without blocking the server.
- **Global Metadata Caching**: Call `init(&context)` once in your plugin's `on_load` lifecycle method to cache verified metadata globally.
- **Online License Verification**: Query the marketplace `/api/v1/rest/check-license` endpoint with automatic 7-day lease caching (`license_lease.json`).
- **Offline Grace Period**: Resilient offline lease evaluation ensures your plugin keeps working during marketplace maintenance or network outages.
- **Zero-Argument Update Checking**: Easily check if newer plugin releases are available on the marketplace.
- **Dynamic Public Key Resolution**: Resolves the marketplace public key dynamically via host WIT imports or HTTPS fallback without hardcoding keys.

---

## Adding the Dependency

Add `pumpkin-plugin-utils` alongside `pumpkin-plugin-api` in your plugin's `Cargo.toml`:

:::code-group

```toml [Cargo.toml]
[package]
name = "my-plugin"
version = "0.1.0"
edition = "2024"

[lib]
crate-type = ["cdylib"]

[dependencies]
pumpkin-plugin-api = "0.1.0-dev+26.2-26.45"
pumpkin-plugin-utils = "0.1.0-dev+26.2-26.45"
tracing = "0.1"
```

:::

---

## Initialization

Before performing license or update checks, initialize the utility crate inside your plugin's `on_load` method using the plugin's `Context`:

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
        // Initialize pumpkin-plugin-utils (verifies signature & caches metadata)
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

::: info What happens during `init`?
1. Locates the plugin's `.wasm` binary in the server directory.
2. Extracts the `pumpkin.metadata` and `wasm_signature` custom sections.
3. Cryptographically verifies the Ed25519 signature over the WASM binary and metadata.
4. Caches the verified `PumpkinMetadata` globally for subsequent calls.
:::

---

## Checking for Updates

`pumpkin-plugin-utils` provides both zero-argument automatic checking and custom manual checking.

### 1. Automatic Update Check (Recommended)

Once initialized, call `pumpkin_plugin_utils::check_for_updates()` without arguments. It automatically uses the cached plugin name, current version, and marketplace endpoint:

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

### 2. Manual Update Check (`UpdateChecker`)

If you want to manually specify the plugin name, version, or a custom marketplace URL, use `UpdateChecker`:

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

### Update Response Structure

The update check returns a `CheckUpdateResponse`:

```rust
pub struct CheckUpdateResponse {
    /// Whether a newer stable release exists on the marketplace.
    pub update_available: bool,
    /// The latest stable version string, if available.
    pub latest_version: Option<String>,
}
```

---

## Checking and Verifying Licenses

`pumpkin-plugin-utils` supports online verification against the marketplace API as well as offline lease management with configurable grace periods.

### 1. Online License Check

To verify a license against the marketplace (`GET /api/v1/rest/check-license`):

```rust
// Pass `None` to use the embedded license key from metadata
let response = pumpkin_plugin_utils::check_license_online(None)
    .map_err(|e| format!("License verification failed: {e}"))?;

if response.valid {
    info!("License is valid (status: {})", response.status);
} else {
    warn!("License is invalid: {}", response.status);
    return Err(format!("Invalid license status: {}", response.status).into());
}
```

#### Providing a Custom License Key Override
If your plugin allows server owners to configure a license key in a `config.toml` file, pass `Some(&key)`:

```rust
let config_key = "LIC-CUSTOM-KEY-12345";
let response = pumpkin_plugin_utils::check_license_online(Some(config_key))?;
```

::: tip 7-Day Lease Caching
Successful online checks automatically save a verified lease file (`license_lease.json`) into the plugin's data folder with a 7-day expiration.
:::

### 2. Evaluating License with Grace Period

To keep paid plugins functional when the server is offline or the marketplace is unreachable, use `evaluate_license`:

```rust
use pumpkin_plugin_utils::LicenseStatus;
use tracing::{info, warn};

// Specify grace period duration in days (e.g., 7 days)
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

### `LicenseStatus` Enum

| Variant | Description |
| :--- | :--- |
| `LicenseStatus::Valid(PumpkinMetadata)` | License is valid, verified, or the plugin is free / open-source. |
| `LicenseStatus::GracePeriod { metadata, days_remaining, reason }` | Operating offline with a previously validated lease that is within the allowable grace period. |
| `LicenseStatus::Invalid(String)` | Signature is invalid, expired, revoked, or metadata was tampered with. |
| `LicenseStatus::Unsigned` | Binary does not contain marketplace metadata/signature (useful during local development). |

---

## Accessing Plugin Metadata

You can access the verified plugin metadata anywhere in your codebase using `get_metadata` or `metadata()`:

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

### `PumpkinMetadata` Fields

| Field | Type | Description |
| :--- | :--- | :--- |
| `plugin_name` | `String` | Canonical plugin name on the marketplace. |
| `version` | `String` | SemVer version string of the plugin binary. |
| `plugin_id` | `i64` | Unique plugin identifier on the marketplace. |
| `dev_id` | `i64` | Developer account ID. |
| `dev_name` | `String` | Developer display name. |
| `is_paid` | `bool` | `true` if this is a premium/commercial plugin. |
| `user_id` | `i64` | Buyer / licensee user ID (`0` for free plugins). |
| `license_key` | `Option<String>` | Unique license key issued to the licensee. |
| `marketplace_url` | `String` | Base marketplace URL (`https://market.pumpkinmc.org`). |
| `issued_at` | `String` | ISO-8601 timestamp when the binary/license was issued. |

---

## Complete Example

Here is a full plugin implementation combining initialization, online licensing checks, offline grace periods, and update checking:

:::code-group

```rust:line-numbers [src/lib.rs]
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
        // 1. Initialize plugin-utils (verifies Ed25519 signature & caches metadata)
        let meta = pumpkin_plugin_utils::init(&context).map_err(|err| {
            error!("Signature verification failed: {err}");
            format!("Security verification error: {err}")
        })?;

        info!("Loaded {} v{}", meta.plugin_name, meta.version);

        // 2. Validate license (offline evaluation + online check)
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

        // 3. Online license check if paid
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

        // 4. Check for updates
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
