# World

Pumpkin allows fine-tuning world storage formats, autosave intervals, and lighting modes under `[world]` in `pumpkin.toml`.

## Configuration

:::code-group

```toml [pumpkin.toml]
[world]
lighting = "default"
autosave_ticks = 6000

[world.chunk]
type = "anvil"
write_in_place = false

[world.chunk.compression]
algorithm = "LZ4"
level = 6
```

:::

### World Settings

- **`lighting`**: Lighting engine propagation calculation mode.
  - `"default"`: Standard Vanilla Minecraft light propagation.
  - `"full"`: Full skylight everywhere without shadows.
  - `"dark"`: Completely dark lighting everywhere (zero light).
- **`autosave_ticks`**: Number of server ticks between automatic world saves (default: `6000`, equivalent to 5 minutes at 20 TPS). Setting this to `0` disables world autosaving.

### Chunk Storage Settings

- **`type`**: The chunk storage format to use:
  - `"anvil"`: Standard Minecraft Anvil region file format (`.mca`).
  - `"linear"`: Linear region storage format using fast compression for a smaller disk footprint.
  - `"pump"`: Pumpkin's native optimized world format.
- **`write_in_place`**: Whether chunks should be rewritten in place within existing region files rather than reallocating free chunks (default: `false`).
- **`compression.algorithm`**: Compression algorithm used for chunk data (`"LZ4"`, `"ZLib"`, `"GZip"`, `"Custom"`).
- **`compression.level`**: Compression level for chunk storage (default: `6`).
