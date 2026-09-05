# LAN Broadcast

Pumpkin can broadcast server announcements on the local network so LAN clients can easily discover and join the server.

## Configuration

:::code-group

```toml [pumpkin.toml]
[networking.lan_broadcast]
enabled = false
# motd = "My Custom LAN Server"
# port = 25565
```

:::

### Configuration Options

- **`enabled`**: Enables or disables broadcasting server presence on the local network (default: `false`).
- **`motd`**: (Optional) Custom one-line Message of the Day shown in LAN client discovery. If omitted, defaults to the server's Java MOTD with newlines removed.
- **`port`**: (Optional) Port advertised in the LAN broadcast. Useful for port forwarding or predictable ports in containerized environments like Docker.
