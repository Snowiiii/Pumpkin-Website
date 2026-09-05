# Configuração Básica

Representando `pumpkin.toml`

## Endereço do Servidor

O endereço para vincular o servidor.

:::code-group

```toml
seed = "1790155153199293024"
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
level = "info"
threads = false
thread_ids = false
target = false
color = true
timestamp = true
timestamp_format = "[hour]:[minute]:[second]"
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
autosave_ticks = 6000

[world.chunk]
type = "anvil"
write_in_place = false

[world.chunk.compression]
algorithm = "LZ4"
level = 6

[networking.query]
enabled = false
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
secret = ""

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
keep_alive_time = 15
motd = "A blazingly fast Pumpkin server!"

[networking.java.compression]
enabled = true
threshold = 256
level = 4

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

[networking.java.packet_limiter]
enabled = true
max_packet_rate = 500.0
burst_capacity = 500.0
kick_message = "Kicked for spamming packets"

[networking.bedrock]
enabled = true
online_mode = true
max_players = 1000
view_distance = 16
simulation_distance = 10
motd = "A blazingly fast Pumpkin server!"
username_prefix = ""
replace_username_spaces = true
chunk_caching = true

[networking.bedrock.compression]
enabled = true
threshold = 256
level = 4

[networking.bedrock.authentication]
enabled = true
connect_timeout = 5000
read_timeout = 5000

[networking.bedrock.nethernet]
enabled = true
address = "0.0.0.0:19132"
identity_key = "nethernet-key.der"
stun_servers = []

[networking.bedrock.packet_limiter]
enabled = true
max_packet_rate = 500.0
burst_capacity = 500.0
kick_message = "Kicked for spamming packets"

[commands]
use_console = true
use_tty = true
log_console = true
broadcast_console_to_ops = true
default_op_level = 0

[commands.overrides]

[chat]
format = "<{DISPLAYNAME}> {MESSAGE}"

[chat.anti_spam]
enabled = true
spam_threshold = 200
message_cost = 20
decay_per_tick = 1
ops_bypass = true

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
enabled = true
hot_reload = false
ask_permission_confirmation = true
allow_unsigned = true
allowed_permissions = []
blocked_permissions = []
inherit_env = false
loopback_only = false
verify_signatures = true

[plugins.overrides]

[advancement]
save_advancements = true
```

:::

## Seed

A seed para a geração do mundo.

:::code-group

```toml [pumpkin.toml] {2}
seed = ""
```

:::

## Limite de Jogadores

O número máximo de jogadores permitidos no servidor.

:::code-group

```toml [pumpkin.toml] {2}
max_players = 100000
```

:::

## Distância de Visão

A distância máxima de visão para os jogadores.

:::code-group

```toml [pumpkin.toml] {2}
view_distance = 10
```

:::

## Distância de Simulação

A distância máxima de simulação para os jogadores.

:::code-group

```toml [pumpkin.toml] {2}
simulation_distance = 10
```

:::

## Dificuldade Padrão

A dificuldade padrão do jogo.

:::code-group

```toml [pumpkin.toml] {2}
default_difficulty = "Normal"
```

:::

```toml
Peaceful
Easy
Normal
Hard
```

## Nível de Permissão de Operação

O nível de permissão atribuído pelo comando `/op`.

:::code-group

```toml [pumpkin.toml] {2}
op_permission_level = 4
```

:::

## Permitir Nether

Se a dimensão Nether está habilitada.

:::code-group

```toml [pumpkin.toml] {2}
allow_nether = true
```

:::

## Permitir End

Se a dimensão End está habilitada.

:::code-group

```toml [pumpkin.toml] {2}
allow_end = true
```

:::

## Hardcore

Se o servidor está no modo hardcore.

:::code-group

```toml [pumpkin.toml] {2}
hardcore = false
```

:::

## Modo Online

Se o modo online está habilitado. Requer contas válidas do Minecraft.

:::code-group

```toml [pumpkin.toml] {2}
online_mode = true
```

:::

## Criptografia

Se a criptografia de pacotes está habilitada.

> [!IMPORTANTE]
> Requerido quando o modo online está habilitado.

:::code-group

```toml [pumpkin.toml] {2}
encryption = true
```

:::

## MOTD

Mensagem do Dia; a descrição do servidor exibida na tela de status.

:::code-group

```toml [pumpkin.toml] {2}
motd = "A Blazingly fast Pumpkin Server!"
```

:::

## TPS

A taxa de tique (tick rate) alvo do servidor.

:::code-group

```toml [pumpkin.toml] {2}
tps = 20.0
```

:::

## Modo de Jogo Padrão

O modo de jogo padrão para os jogadores.

:::code-group

```toml [pumpkin.toml] {2}
default_gamemode = "Survival"
```

:::

```toml
Undefined
Survival
Creative
Adventure
Spectator
```

## Limpeza de IPs

Se os endereços IP dos jogadores devem ser removidos dos logs.

:::code-group

```toml [pumpkin.toml] {2}
scrub_ips = true
```

:::

## Usar Favicon

Se o servidor deve usar um favicon ou não.

:::code-group

```toml [pumpkin.toml] {2}
use_favicon = true
```

:::

## Caminho do Favicon

O caminho para o favicon do servidor.

:::code-group

```toml [pumpkin.toml] {2}
favicon_path = "icon.png"
```

:::
