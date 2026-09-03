# 設定

Pumpkin 使用單一的 `pumpkin.toml` 檔案來設定伺服器的所有面向。以下是設定檔的完整結構，包含所有可用區段與預設值。

## 完整預設 `pumpkin.toml`

```toml
seed = "1785537519969227430"
 default_difficulty = "Normal"
 op_permission_level = 4
 allow_nether = true
 allow_end = true
 hardcore = false
 tps = 20.0
 default_gamemode = "Survival"
 force_gamemode = false
 scrub_ips = true
 use_favicon = true
 default_level_name = "world"
 allow_chat_reports = false
 white_list = false
 enforce_whitelist = false
 [logging]
 enabled = true
 threads = true
 color = true
 timestamp = true
 file = "latest.log"
 [resource_pack.java]
 enabled = false
 url = ""
 sha1 = ""
 prompt_message = ""
 force = false
 [resource_pack.bedrock]
 enabled = false
 force = false
 packs = []
 [world]
 lighting = "default"
 autosave_ticks = 0
 [world.chunk]
 type = "anvil"
 write_in_place = false
 [world.chunk.compression]
 algorithm = "LZ4"
 level = 6
 [networking.query]
 enabled = true
 address = "0.0.0.0:25565"
 [networking.rcon]
 enabled = false
 address = "0.0.0.0:25575"
 password = ""
 max_connections = 10
 [networking.rcon.logging]
 logged_successfully = true
 wrong_password = true
 commands = true
 quit = true
 [networking.proxy]
 enabled = false
 [networking.proxy.velocity]
 enabled = false
 secret = ""
 [networking.proxy.bungeecord]
 enabled = false
 [networking.lan_broadcast]
 enabled = false
 [networking.java]
 enabled = true
 address = "0.0.0.0:25565"
 encryption = true
 online_mode = true
 max_players = 1000
 view_distance = 16
 simulation_distance = 10
 motd = "A blazingly fast Pumpkin server!"
 [networking.java.compression]
 enabled = true
 threshold = 256
 level = 4
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
 [networking.bedrock]
 enabled = true
 address = "0.0.0.0:19132"
 encryption = true
 online_mode = true
 max_players = 1000
 view_distance = 16
 simulation_distance = 10
 motd = "A blazingly fast Pumpkin server!"
 [networking.bedrock.compression]
 enabled = true
 threshold = 256
 level = 4
 [networking.bedrock.authentication]
 enabled = true
 connect_timeout = 5000
 read_timeout = 5000
 [commands]
 use_console = true
 use_tty = true
 log_console = true
 broadcast_console_to_ops = true
 default_op_level = 0
 [chat]
 format = "<{DISPLAYNAME}> {MESSAGE}"
 [pvp]
 enabled = true
 hurt_animation = true
 protect_creative = true
 knockback = true
 swing = true
 [server_links]
 enabled = true
 bug_report = "https://github.com/Pumpkin-MC/Pumpkin/issues"
 support = ""
 status = ""
 feedback = ""
 community = ""
 website = ""
 forums = ""
 news = ""
 announcements = ""
 [server_links.custom]
 [player_data]
 save_player_data = true
 save_player_cron_interval = 300
 [fun]
 april_fools = true
 [recipe]
 send_recipes = true
 [plugins]
 blocked_permissions = []
 [advancement]
 save_advancements = true
```

## 設定解析

### 頂層設定

- `seed`：世界生成的種子字串。
- `default_difficulty`：預設難度（`"Peaceful"`、`"Easy"`、`"Normal"`、`"Hard"`）。
- `op_permission_level`：指派給管理員 (OP) 的預設權限等級 (1-4)。
- `allow_nether`：是否啟用地獄維度。
- `allow_end`：是否啟用終界維度。
- `hardcore`：啟用極限模式（玩家在生存模式中無法重生）。
- `tps`：目標每秒 tick 數 (TPS)（預設：`20.0`）。
- `default_gamemode`：預設遊戲模式（`"Survival"`、`"Creative"`、`"Adventure"`、`"Spectator"`）。
- `force_gamemode`：強制玩家以預設遊戲模式加入。
- `scrub_ips`：在紀錄中匿名化玩家的 IP 位址。
- `use_favicon`：啟用伺服器圖示 (`icon.png`)。
- `default_level_name`：主世界目錄名稱（預設：`"world"`）。
- `allow_chat_reports`：啟用已簽署的聊天檢舉。
- `white_list`：啟用伺服器白名單。
- `enforce_whitelist`：當白名單開啟時，踢出非白名單玩家。