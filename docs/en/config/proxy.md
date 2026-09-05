# Proxy

Pumpkin supports proxy protocols for network server setups. Support for Velocity and BungeeCord is configured under `[networking.proxy]` in `pumpkin.toml`.

## Configuration

:::code-group

```toml [pumpkin.toml]
[networking.proxy]
enabled = false

[networking.proxy.velocity]
enabled = false
secret = ""

[networking.proxy.bungeecord]
enabled = false
secret = ""
```

:::

### Configuration Options

- **`[networking.proxy].enabled`**: Master switch to enable proxy support.
- **`[networking.proxy.velocity].enabled`**: Enables Velocity modern forwarding protocol.
- **`[networking.proxy.velocity].secret`**: Forwarding secret matching the Velocity proxy configuration.
- **`[networking.proxy.bungeecord].enabled`**: Enables BungeeCord player info forwarding protocol.
- **`[networking.proxy.bungeecord].secret`**: Optional shared secret for authenticating connections from the BungeeCord proxy via BungeeGuard (`bungeeguard-token`). When set, incoming connections must provide this token, preventing players from bypassing the proxy to connect directly.
