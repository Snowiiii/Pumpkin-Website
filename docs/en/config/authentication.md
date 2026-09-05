# Authentication

Pumpkin verifies accounts with Mojang's session servers to ensure players use legitimate accounts. Authentication settings are configured under `[networking.java.authentication]` and `[networking.bedrock.authentication]` in `pumpkin.toml`.

## Java Edition Authentication

:::code-group

```toml [pumpkin.toml]
[networking.java.authentication]
enabled = true
fallbacks = []
profile_by_name_fallbacks = []
profile_by_uuid_fallbacks = []
connect_timeout = 5000
read_timeout = 5000
prevent_proxy_connections = false

[networking.java.authentication.player_profile]
allow_banned_players = false
allowed_actions = ["FORCED_NAME_CHANGE", "USING_BANNED_SKIN"]

[networking.java.authentication.textures]
enabled = true
allowed_url_schemes = ["http", "https"]
allowed_url_domains = [".minecraft.net", ".mojang.com"]

[networking.java.authentication.textures.types]
skin = true
cape = true
elytra = true
```

:::

### Configuration Options

- **`enabled`**: Enables online authentication for Java clients (default: `true`).
- **`url`**: (Optional) Custom authentication URL to verify join requests (e.g., custom auth servers like Drasl). Supports `{username}` and `{server_hash}` parameters.
- **`fallbacks`**: List of fallback authentication URLs contacted if the primary/official session server is unreachable.
- **`profile_by_name_url`**: (Optional) Custom URL template to fetch player profiles by username (`{username}`).
- **`profile_by_name_fallbacks`**: Fallback URLs for looking up player profiles by username.
- **`profile_by_uuid_url`**: (Optional) Custom URL template to fetch player profiles by UUID (`{uuid}`).
- **`profile_by_uuid_fallbacks`**: Fallback URLs for looking up player profiles by UUID.
- **`connect_timeout`**: Connection timeout in milliseconds when contacting authentication servers (default: `5000`).
- **`read_timeout`**: Read timeout in milliseconds when contacting authentication servers (default: `5000`).
- **`prevent_proxy_connections`**: Whether to block connections coming from proxies or VPNs during Mojang authentication (default: `false`).
- **`prevent_proxy_connection_auth_url`**: (Optional) Custom authentication endpoint used specifically when proxy prevention is enabled.
- **`services_url`**: (Optional) Public Minecraft services URL (used for player certificates and keys).

### Player Profile Settings

- **`allow_banned_players`**: Whether to allow players flagged or banned by Mojang to connect (default: `false`).
- **`allowed_actions`**: Profile actions permitted when flagged players connect (e.g. `["FORCED_NAME_CHANGE", "USING_BANNED_SKIN"]`).

### Textures Settings

- **`enabled`**: Enables fetching and validating player skins, capes, and elytra textures (default: `true`).
- **`allowed_url_schemes`**: URL schemes permitted for texture downloads (default: `["http", "https"]`).
- **`allowed_url_domains`**: Domains permitted for texture downloads (default: `[".minecraft.net", ".mojang.com"]`).
- **`types.skin`**: Enable custom player skins (default: `true`).
- **`types.cape`**: Enable player capes (default: `true`).
- **`types.elytra`**: Enable player elytra textures (default: `true`).

## Bedrock Edition Authentication

:::code-group

```toml [pumpkin.toml]
[networking.bedrock.authentication]
enabled = true
connect_timeout = 5000
read_timeout = 5000
```

:::

### Configuration Options

- **`enabled`**: Whether Xbox Live authentication is required for Bedrock clients (default: `true`).
- **`url`**: (Optional) Custom authentication or discovery endpoint URL.
- **`connect_timeout`**: Connection timeout in milliseconds (default: `5000`).
- **`read_timeout`**: Read timeout in milliseconds (default: `5000`).
