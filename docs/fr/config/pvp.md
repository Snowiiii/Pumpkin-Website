# PVP

Le comportement JvJ (PvP) et les mécaniques de combats sont configurés sous `[pvp]` dans `pumpkin.toml`.

## Configuration

:::code-group

```toml [pumpkin.toml]
[pvp]
enabled = true
hurt_animation = true
protect_creative = true
knockback = true
swing = true
```

:::

### Options de Configuration

- **`enabled`**: Active le combat Player-versus-Player.
- **`hurt_animation`**: Affiche les animations de dégats lors des attaques.
- **`protect_creative`**: Empèche les joueurs en créatif de recevoir des dégats de PVP.
- **`knockback`**: Active les effets de recul quand le joueurs reçois des dégats.
- **`swing`**: Active les animations de balancement du bras pendant les attaques.
