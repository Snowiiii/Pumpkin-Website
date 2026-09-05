# Bedrock & NetherNet

Pumpkin includes native support for Minecraft Bedrock Edition clients, including NetherNet WebRTC/ICE transport and username customization.

## Configuration

:::code-group

```toml [pumpkin.toml]
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

[networking.bedrock.nethernet]
enabled = true
address = "0.0.0.0:19132"
identity_key = "nethernet-key.der"
stun_servers = []
```

:::

### Bedrock Options

- **`enabled`**: Whether connections from Bedrock Edition clients are accepted (default: `true`).
- **`online_mode`**: Whether Xbox Live authentication is enforced for Bedrock players (default: `true`).
- **`max_players`**: Maximum number of concurrent Bedrock players (`0` disables the limit, default: `1000`).
- **`view_distance`**: Maximum chunk view distance sent to Bedrock clients (default: `16`).
- **`simulation_distance`**: Maximum tick simulation distance for Bedrock players (default: `10`).
- **`motd`**: Message of the Day displayed in the Bedrock server list.
- **`username_prefix`**: Optional prefix prepended to Bedrock player gamertags (e.g. `"."` or `"*"`), preventing name collisions with Java Edition accounts on cross-play servers (default: `""`).
- **`replace_username_spaces`**: Whether spaces in Bedrock gamertags are automatically replaced with underscores `_`, ensuring player names can be referenced in Minecraft slash commands (default: `true`).
- **`chunk_caching`**: Whether client-side chunk blob caching is enabled to conserve network bandwidth (default: `true`).

### NetherNet Transport Settings

NetherNet is Minecraft Bedrock's modern WebRTC/ICE networking transport:

- **`enabled`**: Whether clients may connect using NetherNet (default: `true`).
- **`address`**: Network socket address for TCP signaling and UDP ICE multiplexing (default: `"0.0.0.0:19132"`).
- **`external_ip`**: Optional public IP address advertised when the server is hosted behind NAT.
- **`identity_key`**: File path to the PKCS#8 P-384 private identity key file retained across restarts for client Trust On First Use (TOFU) (default: `"nethernet-key.der"`).
- **`stun_servers`**: Optional list of STUN server URLs for ICE NAT traversal.
