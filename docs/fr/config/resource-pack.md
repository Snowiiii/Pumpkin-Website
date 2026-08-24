# Pack de Texture

Pumpkin supporte le service de pack de texture pour les clients Java et Bedrock. Les options de pack de textures sont situés sous `[resource_pack.java]` et `[resource_pack.bedrock]` dans `pumpkin.toml`.

## Pack de Texture Java

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

- **`enabled`**: Active les pack de texture pour les clients Java.
- **`url`**: URL directe de téléchargement du .zip du pack de texture Java.
- **`sha1`**: Contrôle de somme SHA-1 pour le .zip du pack de texture.
- **`prompt_message`**: Message affiché aux joueurs quand il leur est demandé de télécharger.
- **`force`**: Rend le pack de texture obligatoire.

## Pack de Texture Bedrock

:::code-group

```toml [pumpkin.toml]
[resource_pack.bedrock]
enabled = false
force = false
packs = []
```

:::

### Options

- **`enabled`**: Active le pack de texture pour les joueurs Bedrock.
- **`force`**: Rend le pack de texture obligatoire.
- **`packs`**: Liste des packs de textures Bedrock.
