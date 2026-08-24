# Démarrage rapide

**Status actuel:**
Pré-version (pre-release): Actuellement en développement et pas encore prêt pour une publication officielle.

## Télécharger les binaires de pré-version

Vous pouvez télécharger les binaires sur [la page de téléchargement pour la pré-version](https://pumpkinmc.org/download)

## Compiler depuis les sources (Rust)

Pour compiler Pumpkin depuis les sources, vous devez avoir [Rust](https://www.rust-lang.org/tools/install) installé.

1. **Cloner le dépôt** et navigez dans le dossier:

```shell
git clone https://github.com/Pumpkin-MC/Pumpkin.git
cd Pumpkin
```

2. **Facultatif:** Si vous le souhaitez, vous pouvez placer un monde Vanilla dans le dossier `Pumpkin/`. Nommez juste le dossier `world`

3. Executer:

> [!NOTE]
> Le processus de construction (build) peut prendre du temps, à cause d'optimisation lourde des construction de publication.

```shell
cargo run --release
```

4. **Facultatif:** Pour maximiser les performances en utilisant les optimisations spécifiques à votre CPU, vous pouvez définir le drapeau `target-cpu=native` du constructeur (compiler) Rust:.

```shell
RUSTFLAGS='-C target-cpu=native' cargo run --release
```

> [!NOTE]
> Pour utiliser (pour jouer) sur un serveur que vous hébergez vous-même sur le même système local (ex: en utilisant Prism launcher sur Linux pour se connecter  et exécuter / jouer Minecraft tout en utilisant Pumpkin pour héberger le serveur) vous pourrez avoir besoin d'utiliser "localhost:25565" comme l'adresse du serveur à travers 'Multijoueur' -> 'Ajouter un serveur' -> 'Adresse du serveur', même si cette adresse n'est pas listée dans la sortie du terminal du serveur.
```text
localhost:25565
```

## Docker

> [!IMPORTANT]
> Le support de docker est actuellement expérimental.

Si vous ne l'avez pas déjà, [installez Docker](https://docs.docker.com/engine/install/). Après avoir installé Docker, vous pouvez lancer les commandes suivantes pour lancer le serveur:

```shell
docker run --rm \
    -p <port_expose>:25565  \
    -v <emplacement_donnés_serveur>:/pumpkin \
    -it ghcr.io/pumpkin-mc/pumpkin:master
```

- `<port_exposé>`: Le port auquel vous voulez vous connecter à Pumpkin, par exemple `25565`.
- `<emplacement_donnés_serveur>`: L'emplacement auquel vous voulez que votre serveur enregistre sa configuration et ses donnés, par exemple `./data`.

### Exemple

Pour lancer Pumpkin sur le port `25565` et enregister les données dans un dossier appellé `./data`, vous lanceriez la commande suivante:

```shell
docker run --rm \
    -p 25565:25565 \
    -v ./data:/pumpkin \
    -it ghcr.io/pumpkin-mc/pumpkin:master
```

## Tester le serveur

Pumpkin a un serveur de test maintenu par @kralverde. Il tourne sur le dernier commit de la branche principale de Pumpkin

- **IP:** pumpkin.kralverde.dev

**Spécifications:**

- OS: Debian GNU/Linux bookworm 12.7 x86_64
- Kernel: Linux 6.1.0-21-cloud-amd64
- CPU: Intel Core (Haswell, no TSX) (2) @ 2.40 GHz
- RAM: 4Go DIMM
