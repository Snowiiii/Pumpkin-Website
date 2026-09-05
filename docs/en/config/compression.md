# Compression

Packet compression reduces bandwidth usage for both Java and Bedrock clients. In `pumpkin.toml`, compression is configured independently for Java and Bedrock networking, as well as world chunk compression.

## Network Compression

### Java Edition

:::code-group

```toml [pumpkin.toml]
[networking.java.compression]
enabled = true
threshold = 256
level = 4
```

:::

### Bedrock Edition

:::code-group

```toml [pumpkin.toml]
[networking.bedrock.compression]
enabled = true
threshold = 256
level = 4
```

:::

### Configuration Options

- **`enabled`**: Enables network packet compression.
- **`threshold`**: Minimum packet payload size (in bytes) required before triggering compression.
- **`level`**: Compression level (0 to 9, where higher values trade CPU time for smaller packet sizes).

## World Chunk Compression

Chunk compression settings control how stored world chunk data is compressed on disk.

:::code-group

```toml [pumpkin.toml]
[world.chunk.compression]
algorithm = "LZ4"
level = 6
```

:::

- **`algorithm`**: Compression algorithm used for chunk data. Supported options are `"LZ4"`, `"ZLib"`, `"GZip"`, and `"Custom"` (default: `"LZ4"`).
- **`level`**: Compression level for chunk data (default: `6`).
