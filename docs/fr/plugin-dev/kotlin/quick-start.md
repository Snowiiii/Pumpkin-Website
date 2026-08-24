# Démarrage rapide

Ce guide va vous aider à commencer à écrire un plugin pour le serveur Pumpkin en utilisant [Koltin](https://kotlinlang.org/).

:::warning Attention
Jusqu’à ce que la chaîne d’outils du composant Kotlin + Wasm mûrisse davantage, il y aura une certaine étrangeté et des désagréments. 

Des bugs sont également attendus.
:::

## Prérequis

Avant de commencer, vous devez vous assurer d'avoir d'installé:
- JDK 17 ou plus
    - Pour exécuter Gradle 9.4
- [Rust](https://rust-lang.org/)
    - Ceci est requis car un composant clé (wit-bindgen) est écrit et Rust doit être construit à partir d’une fork particulière activée par Kotlin.
    - Vous n’avez besoin que d’une installation Rust par défaut pour votre plateforme hôte. PAS pour les cibles WebAssembly
- [wasm-tools](https://github.com/bytecodealliance/wasm-tools)
    - Regrouper les produits Wasm Kotlin dans un composant
- Make (par exemple [GNU Make](https://www.gnu.org/software/make/))
    - Pour exécuter le Makefile, vous pouvez choisir de vous en passer et d’effectuer les étapes contenues manuellement.

## Créer votre projet

Contrairement à la majorité des paquets d'API, [pumpkin-api-kt](https://github.com/Pumpkin-MC/pumpkin-api-kt) est un MODÈLE.

Pour commencer, clonez le modèle (et rennomez le comme vous le souhaitez):
```sh
git clone --recurse-submodules https://github.com/Pumpkin-MC/pumpkin-api-kt
mv pumpkin-api-kt my_kotlin_plugin
cd my_kotlin_plugin
```

Ensuite, nous voulons mettre à jour le sous-module `wit` parceque nous utilisons la dernière version de l'API Plugin de Pumpkin.

```sh
cd wit
git pull origin master
cd ..
```

Enfin, renommez le projet Gradle. Changez le `rootProject.name` dans `settings.gradle.kts`, ET le `PROJECT_NAME` dans `Makefile`. Ils doivent tous les deux correspondre. Quel que soit le nom du projet, ce sera le nom de fichier du Wasm produit.

## Créer votre premier plugin

Dans le cadre du modèle, un plug-in de base est implémenté dans `src/wasmWasiMain/kotlin/plugin/Plugin.kt`. 

N’hésitez pas à modifier les métadonnées en bas. Cependant, avant de changer quoi que ce soit d’autre, il est recommandé de compiler le plugin (voir la section suivante) d’abord afin que les liaisons soient générées et que l’achèvement de l’IDE fonctionne pour `pumpkin`.

## Compiler le plugin

Pour compiler le plugin en un composant WebAssembly:

```sh
make
```

Le fichier `.wasm` compilé se trouvera dans `build`. Vous pouvez placer ce fichier dans le dossier `plugins` de votre serveur Pumpkin.

Notez que faire ça une permière fois peut prendre du temps, pendant qu'il constuit `wit-bindgen` depuis les sources Rust.

Exécuter `make` va vérifier pour des mises à jour de `wit-bindgen` à chaque fois. Tu pourrais vouloir exécuter `make componentify` à la place après l'initialisation pour éviter ça.

## Dépannage

### Erreurs de l’éditeur de lien
Si vous commencez à recevoir des erreurs comme
```
main ThreadId(01) pumpkin::plugin: Failed to load plugin from
"./plugins/my_plugin.wasm": Wasm plugin initialization error: plugin failed
to load with error: component imports instance 'pumpkin:plugin/gui@0.1.0', but
a matching implementation was not found in the linker
```
ou d’autres erreurs de « lien » lors du chargement de votre plug-in dans Pumpkin, mettez à jour le sous-module `wit`.

```sh
cd wit
git pull origin master
cd ..
```
