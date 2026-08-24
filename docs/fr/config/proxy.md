# Proxy

Pumpkin supporte les protocoles Proxy pour la gestion du réseau du serveur. Le support de [Velocity](https://papermc.io/software/velocity/) et [BungeeCord](https://github.com/SpigotMC/BungeeCord) est sous `[networking.proxy]` dans `pumpkin.toml`.

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
```

:::

### Options de configuration

- **`[networking.proxy].enabled`**: Interrupteur principal pour activer le support Proxy.
- **`[networking.proxy.velocity].enabled`**: Active le protocole de transfert Velocity.
- **`[networking.proxy.velocity].secret`**: Configuration du proxy Velocity pour la correspondance des secrets de transfert.
- **`[networking.proxy.bungeecord].enabled`**: Active le protocole de transfert BungeeCord.
