# 驗證

Pumpkin 會透過 Mojang 的工作階段伺服器 (Session Server) 驗證帳號，以確保玩家使用的是正版帳號。驗證設定位於 `pumpkin.toml` 中的 `[networking.java.authentication]` 和 `[networking.bedrock.authentication]` 區段。

## Java 版驗證

:::code-group
[networking.java.authentication]
 enabled = true
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
:::

### 設定選項

- `enabled`：啟用 Java 用戶端的線上驗證。
- `connect_timeout`：連線至驗證伺服器時的連線逾時時間（毫秒）。
- `read_timeout`：連線至驗證伺服器時的讀取逾時時間（毫秒）。
- `prevent_proxy_connections`：在驗證期間封鎖 Proxy/VPN 連線。

### 玩家個人檔案設定

- `allow_banned_players`：允許被 Mojang 標記/停權的玩家連線。
- `allowed_actions`：被停權玩家連線時允許的操作（`"FORCED_NAME_CHANGE"`、`"USING_BANNED_SKIN"`）。

### 材質設定

- `enabled`：啟用玩家材質驗證（皮膚、披風、鞘翅）。
- `allowed_url_schemes`：允許用於材質下載的 URL 通訊協定（`["http", "https"]`）。
- `allowed_url_domains`：允許用於材質下載的網域（`[".minecraft.net", ".mojang.com"]`）。
- `types.skin`：啟用自訂皮膚。
- `types.cape`：啟用披風。
- `types.elytra`：啟用鞘翅材質。

## 基岩版驗證

:::code-group
[networking.bedrock.authentication]
enabled = true
connect_timeout = 5000
read_timeout = 5000
:::