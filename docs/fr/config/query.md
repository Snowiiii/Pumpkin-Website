# Query

Le protocole Query permet aux applications externes (telles que les listes de serveurs ou les systèmes de surveillance) de demander des détails sur l’état à Pumpkin.

## Configuration

:::code-group

```toml [pumpkin.toml]
[networking.query]
enabled = true
address = "0.0.0.0:25565"
```

:::

### Options de configuration

- **`enabled`**: Active ou désactive l'écoute du protocle Query 
- **`address`**: Adresse réseau ou port pour l'écoute réseau
