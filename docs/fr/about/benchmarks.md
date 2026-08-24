# Benchmarks

Ici il y a une comparaison entre le logiciel de serveur Minecraft classique contre Pumpkin.

> [!CAUTION] ATTENTION
> **Cette comparaison n'est pas juste.** Pumpkin a actuellement moins de fonctionnalités que les autres serveurs, qui pourrait entrainer l'utilisation de moins de ressources.
> C'est aussi important de préciser que les autres serveur ont eu des années pour s'optimiser.
> Les dérivation du serveur Vanilla, qui n'ont pas besoin de besoin de réécrire toute la logique peuvent se concentrer exclusivement sur l'optimisation.

![Une capture d'écran qui montre 9 fenêtres de jeu Minecraft](https://github.com/user-attachments/assets/e08fbb00-42fe-4479-a03b-11bb6886c91a)

## Spécifications

### Technique

#### Logiciel

- Distribution: Manjaro Linux
- Architecture: x86_64 (64-bit)
- Version du Kernel: 6.11.3-arch1-1

#### Matériel

- Carte Mère: MAG B650 TOMAHAWK WIFI
- CPU: AMD Ryzen 7600X 6-Cœurs
- RAM: Corsair 2x16Go DDR5 6000Mhz
- Stockage: Samsung 990 PRO 1To PCIe 4.0 M.2 SSD
- Refroidissement: be quiet Dark Rock Elite

#### Rust

- Chaîne d'outils (toolchain): stable-x86_64-unknown-linux-gnu (1.81.0)
- Compileur Rust: rustc 1.81.0 (eeb90cda1 2024-09-04)

#### Java

- JDK Version: OpenJDK 23 64-Bit 2024-09-17
- JRE Version: OpenJDK Runtime Environment (build 23+37)
- Vendeur: Oracle

#### Game

- Version Minecraft: 1.21.1
- Distance de rendu: 10
- Distance de simulation: 10
- Mode en ligne: false
- RCON: false

<sub><sup>Le mode en ligne a été désactivé pour faciliter le test avec des comptes non-premium.</sup></sub>

> [!NOTE]
> Tous les tests ont été exécutés plusieurs fois pour des résultats plus précis.
> Aucun joueur n'a bougé après avoir bougé. Seulement les 8 chunks initiaux ont été chargés.
> Chaque serveur utilisait sa propre génération. Aucun chunks n'étaient préchargés.

> [!IMPORTANT]
> `CPU Max` est habituellement plus haut avec un joueur car les chunk initiaux sont chargés.

## Pumpkin

Construction: [8febc50](https://github.com/Snowiiii/Pumpkin/commit/8febc5035d5611558c13505b7724e6ca284e0ada)

Arguements de compilation: `--release`

Argumements d'execution:

**Taille de fichier:** <FmtNum :n=12.3 />Mo

**Temps de démarrage:** <FmtNum :n=8 />ms

**Temps d'arrêt:** <FmtNum :n=0 />ms

| Joueurs | RAM                   | CPU Au repos     | CPU Max            |
| ------- | --------------------- | ---------------- | ------------------ |
| 0       | <FmtNum :n=392.2 />Ko | <FmtNum :n=0 />% | <FmtNum :n=0 />%   |
| 1       | <FmtNum :n=24.9 />Mo  | <FmtNum :n=0 />% | <FmtNum :n=4 />%   |
| 2       | <FmtNum :n=25.1 />Mo  | <FmtNum :n=0 />% | <FmtNum :n=0.6 />% |
| 5       | <FmtNum :n=26 />Mo    | <FmtNum :n=0 />% | <FmtNum :n=1 />%   |
| 10      | <FmtNum :n=27.1 />Mo  | <FmtNum :n=0 />% | <FmtNum :n=1.5 />% |

<sub><sup>Pumpkin met en cache les chunks déjà chargés, ce qui n'entraîne pas d'usage de RAM supplémentaire à part les données du joueur et l'usage CPU minimal</sup></sub>

### Temps de compilation

Compiler depuis rien:

**Debug:** <FmtNum :n=10.35 />sec
**Publication:** <FmtNum :n=38.40 />sec

Recompilation:

**Debug:** <FmtNum :n=1.82 />sec
**Publication:** <FmtNum :n=28.68 />sec

## Vanilla

Release: [1.21.1](https://piston-data.mojang.com/v1/objects/59353fb40c36d304f2035d51e7d6e6baa98dc05c/server.jar)

Arguments de compilation:

Arguments d'exécution: `nogui`

**Taille du fichier:** <FmtNum :n=51.6 />Mo

**Temps de démarrage:** <FmtNum :n=7 />sec

**Temps de mise hors-ligne:** <FmtNum :n=4 />sec

| Joueurs | RAM                   | CPU au repos                             | CPU Max            |
| ------- | --------------------- | ---------------------------------------- | ------------------ |
| 0       | <FmtNum n="860" />Mo  | <FmtNum n="0.1" /> - <FmtNum n="0.3" />% | <FmtNum n="51" />% |
| 1       | <FmtNum n="1.5" />GB  | <FmtNum n="0.9" /> - <FmtNum n="1" />%   | <FmtNum n="41" />% |
| 2       | <FmtNum n="1.6" />GB  | <FmtNum n="1" /> - <FmtNum n="1.1" />%   | <FmtNum n="10" />% |
| 5       | <FmtNum n="1.8" />GB  | <FmtNum n="2" />%                        | <FmtNum n="20" />% |
| 10      | <FmtNum n="2.2" />GB  | <FmtNum n="4" />%                        | <FmtNum n="24" />% |

## Paper

Build: [122](https://api.papermc.io/v2/projects/paper/versions/1.21.1/builds/122/downloads/paper-1.21.1-122.jar)

Arguments de compilation:

Arguments d'exécution: `nogui`

**Taille du fichier:** <FmtNum :n=49.4 />Mo

**Temps de démarrage:** <FmtNum :n=7 />sec

**Temps de mise hors-ligne:** <FmtNum :n=3 />sec

| Joueurs | RAM                   | CPU au repos                             | CPU Max            |
| ------- | --------------------- | ---------------------------------------- | ------------------ |
| 0       | <FmtNum :n=1.1 />GB | <FmtNum :n=0.2 /> - <FmtNum :n=0.3 />% | <FmtNum :n=36 />% |
| 1       | <FmtNum :n=1.7 />GB | <FmtNum :n=0.9 /> - <FmtNum :n=1.0 />% | <FmtNum :n=47 />% |
| 2       | <FmtNum :n=1.8 />GB | <FmtNum :n=1 /> - <FmtNum :n=1.1 />%   | <FmtNum :n=10 />% |
| 5       | <FmtNum :n=1.9 />GB | <FmtNum :n=1.5 />%                     | <FmtNum :n=15 />% |
| 10      | <FmtNum :n=2 />GB   | <FmtNum :n=3 />%                       | <FmtNum :n=20 />% |

## Purpur

Build: [2324](https://api.purpurmc.org/v2/purpur/1.21.1/2324/download)

Arguments de compilation:

Arguments d'éxécution: `nogui`

**Taille du fichier:** <FmtNum :n=53.1 />Mo

**Temps de démarrage:** <FmtNum :n=8 />sec

**Temps de mise hors-ligne:** <FmtNum :n=4 />sec

| Joueurs | RAM                   | CPU au repos                             | CPU Max            |
| ------- | --------------------- | ---------------------------------------- | ------------------ |
| 0       | <FmtNum :n=1.4 />GB | <FmtNum :n=0.2 /> - <FmtNum :n=0.3 />% | <FmtNum :n=25 />% |
| 1       | <FmtNum :n=1.6 />GB | <FmtNum :n=0.7 /> - <FmtNum :n=1.0 />% | <FmtNum :n=35 />% |
| 2       | <FmtNum :n=1.7 />GB | <FmtNum :n=1.1 /> - <FmtNum :n=1.3 />% | <FmtNum :n=9 />%  |
| 5       | <FmtNum :n=1.9 />GB | <FmtNum :n=1.6 />%                     | <FmtNum :n=20 />% |
| 10      | <FmtNum :n=2.2 />GB | <FmtNum :n=2 /> - <FmtNum :n=2.5 />%   | <FmtNum :n=26 />% |

## Minestom

Commit: [0ca1dda2fe](https://github.com/Minestom/Minestom/commit/0ca1dda2fe11390a1b89a228bbe7bf78fefc73e1)

Arguments de compilation:

Arguments d'éxécution:

**Language:** Benchmarks éxecuté avec Kotlin 2.0.0 (Minestom est fait avec Java)

**Taille du fichier:** <FmtNum :n=2.8 />Mo (Library)

**Temps de démarrage:** <FmtNum :n=310 />ms

**Temps de mise hors-ligne:** <FmtNum :n=0 />ms

<sub>[Utilisatation du code d'exemple de](https://minestom.net/docs/setup/your-first-server)</sub>

| Joueurs | RAM                   | CPU au repos                             | CPU Max            |
| ------- | --------------------- | ---------------------------------------- | ------------------ |
| 0       | <FmtNum :n=228 />Mo | <FmtNum :n=0.1 /> - <FmtNum :n=0.3 />% | <FmtNum :n=1 />% |
| 1       | <FmtNum :n=365 />Mo | <FmtNum :n=0.9 /> - <FmtNum :n=1.0 />% | <FmtNum :n=5 />% |
| 2       | <FmtNum :n=371 />Mo | <FmtNum :n=1 /> - <FmtNum :n=1.1 />%   | <FmtNum :n=4 />% |
| 5       | <FmtNum :n=390 />Mo | <FmtNum :n=1.0 />%                     | <FmtNum :n=6 />% |
| 10      | <FmtNum :n=421 />Mo | <FmtNum :n=3 />%                       | <FmtNum :n=9 />% |

Benchmark fait le <FmtDateTime :d="new Date('2024-10-15T16:34Z')" />
