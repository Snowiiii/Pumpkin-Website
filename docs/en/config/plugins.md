# Plugins

Pumpkin provides a WebAssembly (WASM) plugin runtime with capability-based security. Plugin behavior, signature verification, and permissions are configured under `[plugins]` in `pumpkin.toml`.

## Configuration

:::code-group

```toml [pumpkin.toml]
[plugins]
enabled = true
hot_reload = false
ask_permission_confirmation = true
allow_unsigned = true
allowed_permissions = []
blocked_permissions = []
inherit_env = false
loopback_only = false
verify_signatures = true

# Optional per-plugin overrides
[plugins.overrides.my_plugin]
enabled = true
allow_unsigned = true
max_memory_mb = 128
allowed_permissions = ["fs:read:data"]
blocked_permissions = ["network:outbound"]
loopback_only = true

[plugins.overrides.my_plugin.environment]
API_KEY = "example_secret"
```

:::

### Global Plugin Settings

- **`enabled`**: Master switch to enable or disable the plugin runtime (default: `true`).
- **`hot_reload`**: Watch the `plugins/` directory and automatically reload modified plugins at runtime (default: `false`).
- **`ask_permission_confirmation`**: Prompt in the server console when a plugin requests unapproved capabilities/permissions (default: `true`).
- **`allow_unsigned`**: Allow loading unsigned WASM plugins (default: `true`).
- **`allowed_permissions`**: List of permissions globally pre-approved for all plugins, bypassing interactive console prompts (default: `[]`).
- **`blocked_permissions`**: List of permissions globally denied to all plugins (default: `[]`).
- **`inherit_env`**: Whether host environment variables are inherited into plugin WASI sandboxes by default (default: `false`).
- **`loopback_only`**: Whether outbound network connections from plugins are restricted to `127.0.0.1` / localhost (default: `false`).
- **`max_memory_mb`**: (Optional) Global maximum memory limit in megabytes (MB) per plugin instance.
- **`verify_signatures`**: Whether Pumpkin verifies cryptographic signatures on WASM plugins before loading (default: `true`).

### Per-Plugin Overrides

Fine-tune permissions and environment variables for specific plugins under `[plugins.overrides.<plugin_name>]`:

- **`enabled`**: Enable or disable this specific plugin (default: `true`).
- **`allow_unsigned`**: Override whether this specific plugin can run unsigned (`true`/`false`).
- **`max_memory_mb`**: Maximum memory limit in MB allocated specifically for this plugin.
- **`allowed_permissions`**: Pre-approved permissions for this plugin.
- **`blocked_permissions`**: Explicitly blocked permissions for this plugin.
- **`loopback_only`**: Override loopback network restriction for this plugin.
- **`environment`**: Table of custom environment variables passed directly into the plugin's WASI environment.
