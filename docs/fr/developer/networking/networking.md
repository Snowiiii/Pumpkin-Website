### Gestion réseau

La majorité du code pour la gestion réseau Pumpkin se trouve dans le dossier [pumpkin-protocol](https://github.com/Pumpkin-MC/Pumpkin/tree/master/pumpkin-protocol).

Lié au serveur: Client→Serveur

Lié au client: Serveur→Client

### Structure

Les paquets du protocole Pumpkin sont organisés par fonctionalité et état.

`server`: Contient les définitions pour les paquets liés au serveur.

`client`: Contient les définitions pour les paquets liés au client.

### États

**Poigné de main**: Toujours le premier paquet qui est envoyé par le client. Il détermine aussi le prochain état, habituellement pour indequer si le joueur veux exécuter une requête de status, rejoindre le serveur ou veux être transféré.

**Status**: Indique si le client veux voir une réponse de status (MOTD).

**Login**: La séquence de connection. Indique si le client veux rejoindre le serveur.

**Configuration**: Un séquence de paquets de configuration qui est princialement envoyé du serveur vers le client (fonctionalités, pack de ressource, liens serveur, etc...)

**Jouer**: L'état final, qui indique si le joueur est prêt à rejoindre, aussi utilisé pour gérer tous les autres paquets de jeu.

### Protocole Minecraft

Vous pouvez trouver tous les paquets de Minercaft Java surle [Minecraft Wiki](https://minecraft.wiki/w/Java_Edition_protocol/Packets). Vous pouvez aussi voir quels [États](#états) existent.
Vous pouvez également voir toutes les informations que les paquets contiennent, que nous pouvons lire ou écrire selon qu’ils sont liés à un serveur ou à un client.

### Ajouter un paquet

1. Ajouter un paquet est simple. D'abord, dérivez:

```rust
// Pour les paquets liés au client:
#[derive(Serialize)]

// Pour les paquets liés au serveur:
#[derive(Deserialize)]
```

2. Prochainements, vous devez faire savoir que votre strucure représente un paquet. Cela obtiens automatiquement d'ID du paquet depuis le fichier JSON des paquets.

```rust
use pumpkin_data::packet::clientbound::PLAY_DISCONNECT;

#[packet(PLAY_DISCONNECT)]
```

3. Maintenant, vous pouvez créer la `struct` (structure).

> [!IMPORTANT]
> Merci de commencer le nom du paquet par un "C" ou un "S" pour lié au **C**lient ou lié au **S**erveur.
> Aussi, si le paquet peut être envoyé dans plusieurs [états](#états), merci de les ajouter au nom. Par exemple, il y a 3 différents paquets de déconnexion
>
> - `CLoginDisconnect`
> - `CConfigDisconnect`
> - `CPlayDisconnect`

Créez des champs dans votre structure de paquets pour représenter les données qui seront envoyées.

> [!IMPORTANT]
> Utilisez des noms de champs explicites et les types de donné appropriés.

Exemples:

```rust
pub struct CPlayDisconnect {
    reason: TextComponent,
    // plus de champs...
}

pub struct SPlayerPosition {
    pub x: f64,
    pub feet_y: f64,
    pub z: f64,
    pub ground: bool,
}
```

4. (Paquets liés au client uniquement) `impl` une `new` fonction qui nous permet de les créer en insérant les valeurs.

```rust
impl CPlayDisconnect {
    pub fn new(reason: TextComponent) -> Self {
        Self { reason }
    }
}
```

5. À la fin, tout devrait aller ensemble.

```rust
#[derive(Serialize)]
#[packet(PLAY_DISCONNECT)]
pub struct CPlayDisconnect {
    reason: TextComponent,
}

impl CPlayDisconnect {
    pub fn new(reason: TextComponent) -> Self {
        Self { reason }
    }
}

#[derive(Deserialize)]
#[packet(PLAY_MOVE_PLAYER_POS)]
pub struct SPlayerPosition {
    pub x: f64,
    pub feet_y: f64,
    pub z: f64,
    pub ground: bool,
}
```

6. Vous pouvez également sérialiser/désérialiser le paquet manuellement, ce qui peut être utile si le paquet est plus complexe.

```diff
-#[derive(Serialize)]

+ impl ClientPacket for CPlayDisconnect {
+    fn write(&self, bytebuf: &mut BytesMut) {
+       bytebuf.put_slice(&self.reason.encode());
+    }

-#[derive(Deserialize)]

+ impl ServerPacket for SPlayerPosition {
+    fn read(bytebuf: &mut Bytes) -> Result<Self, ReadingError> {
+       Ok(Self {
+           x: bytebuf.try_get_f64()?,
+           feet_y: bytebuf.try_get_f64()?,
+           z: bytebuf.try_get_f64()?,
+           ground: bytebuf.try_get_bool()?,
+       })
+    }
```

7. Vous pouvez maintenant envoyer le paquet lié au client (voir [Envoyer des paquets](#envoyer-des-paquets)) ou écouter le paquet lié au serveur (voir [Recevoir des paquets](#recevoir-des-paquets)).

### Client

Pumpkin tri les `Client`s et les `Joueur`s séparéments. Tout ce qui n'est pas dans l'état de jeu est un simple `Client`. Voici les différences:

#### Client

- Ne peux uniquement avoir les états: Status, Connection, Transfer, Configuration
- N'est pas une entité vivante
- As une faible consomation de ressources

#### Joueur

- Ne peux uniquement être dans l'état de Jeu
- Est une entité vivante dans le monde
- Consome plus de donnés et de ressources

#### Envoyer des paquets

Exemple:

```rust
// Ne fonctionne uniquement dans l'état Status
client.send_packet(&CStatusResponse::new("{ description: "A Description"}"));
```

#### Recevoir des paquets

Pour les `Client`s:
`src/client/mod.rs`

```diff
// Met le paquet dans le bon état
 fn handle_mystate_packet(
  &self,
    server: &Arc<Server>,
    packet: &mut RawPacket,
) -> Result<(), ReadingError> {
    let bytebuf = &mut packet.bytebuf;
    match packet.id.0 {
        SStatusRequest::PACKET_ID => {
                self.handle_status_request(server, SStatusRequest::read(bytebuf)?)
                    .await;
            }
+            MyPacket::PACKET_ID => {
+                self.handle_my_packet(MyPacket::read(bytebuf)?)
+                    .await;
            }
            _ => {
            log::error!(
                "Failed to handle packet id {} while in ... state",
                packet.id.0
            );
            }
    };
    Ok(())
}
```

Pour le `Player`s:
`src/entity/player.rs`

```diff
// Les joueurs n'ont que l'état de Jeu
 fn handle_play_packet(
  &self,
    server: &Arc<Server>,
    packet: &mut RawPacket,
) -> Result<(), ReadingError> {
    let bytebuf = &mut packet.bytebuf;
    match packet.id.0 {
        SChatMessage::PACKET_ID => {
            self.handle_chat_message(SChatMessage::read(bytebuf)?).await;
        }
       MyPacket::PACKET_ID => {
+           self.handle_mypacket(server, MyPacket::read(bytebuf)?).await;
        }
        _ => {
            log::error!(
                "Failed to handle packet id {} while in ... state",
                packet.id.0
            );
        }
    };
    Ok(())
}
```

### Compression

Les paquets Minecraft **peuvent** utiliser la compression ZLib pour le décodage/encodage. Il y a généralement un seuil défini lors de l’application de la compression ; cela affecte le plus souvent les paquets chunk.

### Porter

Pour porter une nouvelle version de Minecraft, vous pouvez comparer les différences dans le protocole sur le [minecraft.wiki Protocol reference](https://minecraft.wiki/w/Java_Edition_protocol).

Changez aussi `CURRENT_MC_PROTOCOL` dans `src/lib.rs`.
