# LAN Broadcast

Pumpkin peut diffuser des annonces de serveur sur le réseau local afin que les clients LAN puissent facilement découvrir et rejoindre le serveur.

## Configuration

:::code-group

```toml [pumpkin.toml]
[networking.lan_broadcast]
enabled = false
```

:::

### Paramètres

- **`enabled`**: Active ou désactive les annonces pour les clients du réseau local.
