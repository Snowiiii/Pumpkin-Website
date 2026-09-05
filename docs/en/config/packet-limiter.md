# Packet Limiter

Pumpkin features a built-in packet rate limiter to protect the server from packet flooding, spam attacks, and client-side exploits. Packet rate limits can be configured independently for Java Edition and Bedrock Edition clients.

## Configuration

:::code-group

```toml [pumpkin.toml]
[networking.java.packet_limiter]
enabled = true
max_packet_rate = 500.0
burst_capacity = 500.0
kick_message = "Kicked for spamming packets"

[networking.bedrock.packet_limiter]
enabled = true
max_packet_rate = 500.0
burst_capacity = 500.0
kick_message = "Kicked for spamming packets"
```

:::

### Configuration Options

- **`enabled`**: Whether the packet rate limiter is enabled for this client edition (default: `true`).
- **`max_packet_rate`**: Maximum allowed incoming packets per second per client connection (default: `500.0`). Set to `<= 0.0` to disable the rate limit without disabling the limiter module.
- **`burst_capacity`**: Token bucket burst allowance capacity for brief spikes in client packets (default: `500.0`).
- **`kick_message`**: The disconnection message displayed to the player when their connection exceeds the packet limit (default: `"Kicked for spamming packets"`).
