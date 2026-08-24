# Compression

La compression des paquets réduit l'usage de la bande passante pour les clients Java et Bedrock. Dans `pumpkin.toml`, la conpression est configurée indépendament pour Java et Bedrock, de même que la compression des chunks du monde.

## Compression réseau

### Java Édition

:::code-group

```toml [pumpkin.toml]
[networking.java.compression]
enabled = true
threshold = 256
level = 4
```

:::

### Bedrock Édition

:::code-group

```toml [pumpkin.toml]
[networking.bedrock.compression]
enabled = true
threshold = 256
level = 4
```

:::

### Options de configuration

- **`enabled`**: Active la compression réseau.
- **`threshold`**: Taille minimum de la charge utile d'un packet (en octets) avant d'utiliser la compression.
- **`level`**: Niveau de compression (0 à 9, où les plus grandes valeurs échangent du temps CPU pour des plus petites tailles de paquets).

## Compression des chunks du monde

Les paramètres de compression des chunks contrôlent comment est stocké les donnés du monde sur le disque.

:::code-group

```toml [pumpkin.toml]
[world.chunk.compression]
algorithm = "LZ4"
level = 6
```

:::

- **`algorithm`**: Algorithme utilisé pour la compression des données des chunks (ex: `"LZ4"`).
- **`level`**: Niveau de compression (0 à 9, où les plus grandes valeurs échangent du temps CPU pour des plus petites tailles sur le disque).
