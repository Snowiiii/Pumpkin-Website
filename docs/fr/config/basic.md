# Configuration

Pumpkin utilise un seul fichier `pumpkin.toml` pour configurer tous les aspects du serveur. Ci-dessous se trouve la structure complète du fichier de configuration avec toutes ses sections disponibles et les valeurs par défaut.

## `pumpkin.toml` Complet par défaut

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

## Détail des paramètres

### Paramètres de haut niveau

- **`seed`**: Graine pour la génération du monde.
- **`default_difficulty`**: Difficulté par défaut (`"Peaceful"`, `"Easy"`, `"Normal"`, `"Hard"`).
- **`op_permission_level`**: Niveau de permission par défaut assigné aux administrateurs (1-4).
- **`allow_nether`**: Contrôle si le Nether est activé ou non.
- **`allow_end`**: Contrôle si l'End est activé ou non.
- **`hardcore`**: Active le mod Hardcore (les joueurs ne peuvent pas réapparaitre en survie).
- **`tps`**: Objectif de tick par seconde (par défaut: `20.0`).
- **`default_gamemode`**: Mode de jeu par défaut (`"Survival"`, `"Creative"`, `"Adventure"`, `"Spectator"`).
- **`force_gamemode`**: Forcer les joueurs à rejoindre dans le mode de jeu par défaut.
- **`scrub_ips`**: Anonymise les adresses IP dans les logs.
- **`use_favicon`**: Active l'icone du serveur (`icon.png`).
- **`default_level_name`**: Nom du dossier de monde principal (par défaut: `"world"`).
- **`allow_chat_reports`**: Active le signalement du chat signé.
- **`white_list`**: Active la liste blanche.
- **`enforce_whitelist`**: Expulse les joueurs ne faisant pas partie de la liste blanche quand activé.
