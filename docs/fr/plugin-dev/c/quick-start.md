# Démarrge Rapide

Ce guide va vous aider à commencer à écrire un plugin pour le serveur Pumpkin en utilisant [C](https://fr.wikipedia.org/wiki/C_(langage)).

## Prérequis

Avant de commencer, vous devez vous assurer d'avoir d'installé:
- [wasi-sdk](https://github.com/WebAssembly/wasi-sdk/releases) (pour compiler le C vers WASI)
- `git` (pour cloner l'API)

## Mettre en place le projet

Premièrement, clonez l'API C de Pumpkin avec ses sous-modules:

```bash
git clone --recursive https://github.com/Pumpkin-MC/pumpkin-api-c.git
cd pumpkin-api-c
```

## Créer votre premier plugin

Créez un fichier nommé `main.c` dans le dossier racine et ajoutez le contenu suivant

```c
#include "pumpkin_api.h"
#include <stdio.h>

pumpkin_metadata_t get_meta(void) {
    static const char* authors[] = {"you"};
    return (pumpkin_metadata_t) {
        .name = "my-c-plugin",
        .version = "0.1.0",
        .authors = authors,
        .authors_count = 1,
        .description = "A simple C plugin for Pumpkin",
        .dependencies_count = 0
    };
}

void on_load(plugin_own_context_t ctx) {
    printf("C plugin loaded!\n");
}

REGISTER_PUMPKIN_PLUGIN(((pumpkin_plugin_t){
    .get_metadata = get_meta,
    .on_load = on_load
}))
```

## Compiler le plugin

Pour compiler votre plugin vers un composant WebAssembly, utilisez le compileur `clang` de l'installation `wasi-sdk`

Remplacez `/chemin/vers/wasi-sdk` avec le vrai chemin de votre WASI SDK.

```bash
/chemin/vers/wasi-sdk/bin/clang -O3 \
    -Iinclude -Isrc/gen \
    src/gen/plugin.c src/pumpkin_api.c main.c \
    -o my_plugin.wasm \
    -mexec-model=reactor
```

Cela va générer un fichier `my_plugin.wasm` que vous pouvez placer dans le dossier `plugins` de votre serveur Pumpkin.
