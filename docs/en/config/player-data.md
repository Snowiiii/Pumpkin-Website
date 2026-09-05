# Player Data & Gameplay

Settings for saving persistent player data, advancements, recipe synchronization, and fun seasonal features are configured in `pumpkin.toml`.

## Configuration

:::code-group

```toml [pumpkin.toml]
[player_data]
save_player_data = true
save_player_cron_interval = 300

[advancement]
save_advancements = true

[recipe]
send_recipes = true

[fun]
april_fools = true
```

:::

### Player Data

- **`save_player_data`**: Whether persistent player data (inventory, location, health) is saved to disk (default: `true`).
- **`save_player_cron_interval`**: Time interval in seconds between automatic periodic saves of online player data (default: `300` seconds / 5 minutes).

### Advancements

- **`save_advancements`**: Whether player advancement progress is tracked and saved to disk (default: `true`).

### Recipes

- **`send_recipes`**: Whether crafting and smelting recipes are synchronized with connected clients, enabling the client-side recipe book (default: `true`).

### Fun Features

- **`april_fools`**: Whether fun and seasonal April Fools easter eggs and features are enabled (default: `true`).
