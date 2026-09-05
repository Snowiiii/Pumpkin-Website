# Resource Pack

Pumpkin supports serving resource packs to Java and Bedrock clients. Resource pack options are configured under `[resource_pack.java]` and `[resource_pack.bedrock]` in `pumpkin.toml`.

## Java Resource Pack

:::code-group

```toml [pumpkin.toml]
[resource_pack.java]
enabled = false
url = ""
sha1 = ""
prompt_message = ""
force = false
```

:::

### Options

- **`enabled`**: Enable serving resource pack to Java clients.
- **`url`**: Direct download URL for the Java resource pack zip.
- **`sha1`**: SHA-1 checksum of the resource pack zip file.
- **`prompt_message`**: Message shown to players when prompted to download.
- **`force`**: Disconnect players who decline the resource pack download.

## Bedrock Resource Pack

:::code-group

```toml [pumpkin.toml]
[resource_pack.bedrock]
enabled = false
force = false
packs = [
  # { uuid = "00000000-0000-0000-0000-000000000000", version = "1.0.0", size = 1048576, download_url = "https://example.com/pack.mcpack" }
]
```

:::

### Options

- **`enabled`**: Enable resource packs for Bedrock clients.
- **`force`**: Force Bedrock clients to download required packs before joining.
- **`packs`**: Array of Bedrock resource pack definitions.

### Bedrock Pack Fields

Each pack in the `packs` array accepts the following properties:

- **`uuid`**: (Required) Unique identifier (UUID) for the Bedrock pack matching its `manifest.json`.
- **`version`**: (Required) Version string of the pack (e.g. `"1.0.0"`).
- **`size`**: (Required) File size of the pack archive in bytes.
- **`download_url`**: (Required) Direct download URL for the `.mcpack` or archive file.
- **`content_key`**: (Optional) Decryption key for encrypted marketplace/custom packs.
- **`sub_pack_name`**: (Optional) Sub-pack name within the pack to activate.
- **`content_id`**: (Optional) Content identifier string.
- **`has_scripts`**: (Optional) Whether the pack contains client scripts (`true`/`false`, default: `false`).
- **`addon_pack`**: (Optional) Whether the pack is marked as an addon pack (default: `false`).
- **`rtx_enabled`**: (Optional) Whether ray tracing / RTX features are enabled for the pack (default: `false`).
