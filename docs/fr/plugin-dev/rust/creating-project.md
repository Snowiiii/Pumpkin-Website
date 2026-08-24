# Créer un nouveau projet

Les plugins Pumpkin utilisent le système de compilation [Cargo](https://doc.rust-lang.org/book/ch01-03-hello-cargo.html).

Le code complet pour ce plugin peut être trouvé sur [l'exemple GitHub](https://github.com/BjornTheProgrammer/Hello-Pumpkin-Wasm).

## Installer la chaîne d'outil

Avant de pouvoir compiler un plugin, on a besoin de la cible `wasm32-wasip2` installée. Vous pouvez l'installer en exécutant:

```bash
rustup target add wasm32-wasip2
```

## Initialisation d’une nouvelle crate

Premièrement, nous avons besoin de créer un nouveau dossier pour le projet. Vous pouvez créer la crate ça en exécutant dans le dossier que vous venez de créer:

```bash
cargo new <project-name> --lib
```

Après ça, nous avons besoin de créer un nouveau dossier apellé `.cargo` et y ajouter un fichier `config.toml`

```toml [config.toml]
[build]
target = "wasm32-wasip2"
```

Au total, votre nouvelle structure de dossiers devrait ressembler à ceci:

```bash
├── .cargo/
│   └── config.toml
├── src/
│   └── lib.rs
├── Cargo.toml
└── Cargo.lock
```

## Configurer la crate

Puisque les plugins Pumpkin sont chargés à l’exécution en tant que bibliothèques dynamiques, nous devons dire à Cargo de construire cette crate comme une seule.
:::code-group

```toml [Cargo.toml]
[package]
name = "hello-pumpkin-wasm"
version = "0.1.0"
edition = "2024"

[lib] // [!code ++:2]
crate-type = ["cdylib"]

[dependencies]
```

:::

Ensuite, nous devons ajouter quelques dépendances de base. Comme Pumpkin est encore au début de son développement, les crates internes ne sont pas publiées sur crates.io, nous devons donc dire à Cargo de télécharger les dépendances directement depuis GitHub.
:::code-group

```toml [Cargo.toml]
[package]
name = "hello-pumpkin"
version = "0.1.0"
edition = "2024"

[lib]
crate-type = ["cdylib"]

[dependencies]
// [!code ++:3]
# Ceci est la crate d’API qui facilite la création de plugins, et a des définitions
pumpkin-plugin-api = { version = "0.1.0", git = "https://github.com/Pumpkin-MC/Pumpkin", package = "pumpkin-plugin-api" }
tracing = "0.1"
```

:::

Pour améliorer les performances et réduire la taille des fichiers, nous recommandons d’activer l’optimisation du temps de liaison (LTO).  
Sachez que cela augmentera le temps de compilation.
:::code-group

```toml [Cargo.toml]
[profile.release] // [!code ++:2]
lto = true
```

:::
<small>Activer LTO uniquement pour les compilations de publication.</small>
