# Authentification

## Pourquoi l'authentification ?

Les comptes hors ligne, c’est-à-dire les comptes générés à partir du nom d’utilisateur d’un joueur sans contacter de serveur d’autorisation ou d’authentification, peuvent avoir n’importe quel surnom choisi. Ceci, sans plugins supplémentaires, signifie que les joueurs peuvent se faire passer pour d’autres joueurs, y compris ceux avec des autorisations d’opérateur.

## Serveur "hors ligne"

Par défaut, `online_mode` est activé dans la configuration (`[networking.java.online_mode]` / `[networking.bedrock.online_mode]`). Cela active l’authentification, en désactivant les comptes hors ligne. Si vous souhaitez autoriser les comptes hors ligne, vous pouvez désactiver `online_mode` dans `pumpkin.toml`.

## Comment Yggdrasil Auth fonctionne

1. Le client obtiens un tocken d'authentification et un UUID du launcher.
2. Le client, pendant le chargement, récupère des donnés du serveur d’autorisation ou d’authentification en utilisant le tocken, par exemple de nombreuses clefs de signature et la liste de tous les serveur bloqués.
3. Le client, lorsqu'il rejoin le serveur, envoie une requête au serveur d’autorisation ou d’authentification. Les serveur de Mojang peuvent refuser cette requête si ce compte est banni.
4. Le client envoie sont authentification au serveur dans un paquet.
5. Le serveur, basé sur l'identification, envoie une requête `hasJoinded` au serveur d’autorisation ou d’authentification. Si elle réussi, le serveur obtiens les informations du joueurs, comme le skin.

## Serveur d'authentification personnalisé

Pumpkin supporte les serveur d'authentification personnalisés. Vous pouvez remplacer l'URL d'authentification dans `features.toml`.

### Comment l'authentification de Pumpkin fonctionne

1. **Requête GET:** Pumpkin envoie une requête GET au serveur d'authentification spécifié.
2. **Code de status 200:** Si l'authentification est réussi, le serveur répond avec un code 200.
3. **Extraire le profile de jeu JSON:** Pumpkin extrait le profile du joueur de la réponse.

### Profile de jeu

```rust
struct GameProfile {
    id: UUID,
    name: String,
    properties: Vec<Property>,
    profile_actions: Option<Vec<ProfileAction>>, // Optionnel, seulement présent quand les actions sont appliqués
}
```

#### Propriétés

```rust
struct Property {
    name: String,
    value: String, // Encodé en Base64
    signature: Option<String>, // Optionnel, Encodé en Base64
}
```

#### Profile Action

```rust
enum ProfileAction {
    FORCED_NAME_CHANGE,
    USING_BANNED_SKIN,
}
```
