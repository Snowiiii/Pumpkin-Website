# [RCON](https://fr.minecraft.wiki/w/RCON) (Remote CONsole: Console à distance)

## Qu'est ce que RCON

RCON est un protocole conçu par Valve pour permettre aux administrateurs de controller et gérer les serveur de jeu à distance. Il propose une manière d'exécuter des commandes sur un serveur depuis une différente localisation, comme un téléphone ou un autre ordinateur.

## Pourquoi RCON ?

- **Confort:** Gérez votre serveur depuis n'importe quel endroit avec une connection internet.
- **Flexibilité:** Exécuter des commandes sans être physiquement présent à l'endroit du serveur.
- **Éfficacité:** Automatiser les tâches et rationaliser la gestion des serveurs.

## SSH vs RCON

### SSH

- Offre un chiffrement pour protéger les donnés transmises entre le client et le serveur.
- Principalement conçu pour la connexion à distance sécurisée et l’exécution de commandes sur une machine distante.
- Couramment utilisé pour la gestion des systèmes Linux/Unix, la configuration des réseaux et l’exécution de scripts.
- Fournit un environnement de type shell, vous permettant d’exécuter diverses commandes et d’interagir avec le système distant.

### RCON

- Spécialement conçu pour l’administration à distance des serveurs de jeu, vous permettant de contrôler et de gérer les paramètres et les opérations du serveur.
- Généralement moins sécurisé que SSH, car il repose souvent sur des mots de passe en texte brut.
- Principalement utilisé par les administrateurs de serveurs de jeux pour gérer les serveurs de jeux.
- Possède un ensemble limité de commandes spécifiques au jeu.

### Paquets

RCON est un protocole très simple avec très peu de paquets. Voici comment un paquet RCON ressemble:

| Champs | Description                                     |
| -----  | ----------------------------------------------- |
| ID     | Utilisé pour indiquer si une authentifcation a réussi |
| Type   | Identifie le type de paquet                     |
| Body   | Un message, une commande ou un mot de passe     |

#### Paquets liés au serveur <sub><sub>(Client→Server)</sub></sub>

| Type  | Packet      |
| ----  | ----------- |
| 2     | Auth        |
| 3     | ExecCommand |

#### Paquets liés au client <sub><sub>(Server→Client)</sub></sub>

| Type  | Packet       |
| ----  | ------------ |
| 2     | AuthResponse |
| 0     | Output       |

### Fonctionnement de RCON

1. **Authentification :**

- Le client RCON envoie un paquet d’authentification avec le mot de passe souhaité.
- Le serveur vérifie le mot de passe et répond par un paquet de réponse d’authentification.
- En cas de succès, le paquet de réponse inclut le même ID que celui envoyé par le client. En cas d’échec, l’ID est -1.

2. **Exécution de la commande :**

- Le client authentifié peut maintenant envoyer des paquets d’exécution de commandes, chaque paquet contenant la commande à exécuter.
- Le serveur traite la commande et renvoie un paquet de sortie contenant le résultat ou tout message d’erreur.
