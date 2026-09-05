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

## HAProxy PROXY protocol v2

Pumpkin can accept Java TCP connections from an `HAProxy` frontend using
`send-proxy-v2`. The header carries connection addresses and ports. It does not
perform Minecraft authentication or enable Velocity or BungeeCord forwarding.

### Pumpkin configuration

For `HAProxy` on the same machine, bind Pumpkin to a private backend port:

```toml [pumpkin.toml]
[networking.java]
address = "127.0.0.1:25566"
online_mode = true
encryption = true

[networking.java.proxy_protocol]
enabled = true
trusted_proxies = ["127.0.0.1/32", "::1/128"]
header_timeout_ms = 5000
```

`networking.proxy.enabled` can stay false when `HAProxy` is the only forwarding
layer. Existing encryption, online or offline authentication, and compression
settings continue to apply. If the `proxy_protocol` table is absent, Pumpkin
uses disabled defaults.

`trusted_proxies` must contain literal IPv4 or IPv6 CIDRs. Empty enabled lists,
malformed CIDRs, and timeouts outside 1-60000 milliseconds fail validation. List
only the immediate proxies' TCP source networks, and restrict backend access
with binding or firewall rules. Pumpkin checks the peer before it reads a
header. IPv4-mapped IPv6 peers match both their IPv6 CIDR and the corresponding
IPv4 CIDR.

### HAProxy configuration

```haproxy
global
    maxconn 1024

defaults
    mode tcp
    timeout connect 5s
    timeout client 1h
    timeout server 1h

frontend minecraft
    bind :25565
    default_backend pumpkin

backend pumpkin
    server pumpkin1 127.0.0.1:25566 send-proxy-v2
```

Check the configuration with `haproxy -c -f haproxy.cfg`, then start it with
`haproxy -db -f haproxy.cfg`. Connect a Java client to `localhost:25565`.

To verify forwarding, connect from another machine and inspect the player
address through a plugin or `/ban-ip`. It should be the Minecraft client, not
`HAProxy`. A direct connection to port 25566 must fail without a v2 header. For
a remote `HAProxy`, replace the loopback backend and trust CIDRs with the
private interface and the proxy's source address.

### Scope and behavior

Before Java login, Pumpkin reads and validates the v2 header. Invalid, untrusted,
truncated, or timed-out headers close the socket. Disabled mode performs no
reads. For TCP/IPv4 and TCP/IPv6, the forwarded source becomes the client
address and `transport_peer` keeps the real TCP peer. `LOCAL`, `UNSPEC`, UDP, and
Unix variants consume their payload but keep the socket address. Optional TLVs
are skipped, not interpreted, and no Minecraft bytes are read ahead.

This feature is for Java TCP only. It does not configure Bedrock, RCON, Query,
PROXY v1, or TLV contents. See the [official `HAProxy` specification](https://github.com/haproxy/haproxy/blob/master/doc/proxy-protocol.txt)
for the wire format.
