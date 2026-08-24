# Créer un nouveau projet

Les plugins Pumpkin utilisent le language de programation [Go](https://go.dev/) et sont compilés en WebAssembly.

## Prérequis

Avant de commencer, vous devez vous assurer d'avoir d'installé:
- [Go](https://go.dev/doc/install) (dernière version recommandée)
- [TinyGo](https://tinygo.org/getting-started/install/) (requis pour la compilation WASM)

## Initialiser un nouveau module

Premièrement, créez un nouveau dossier pour votre projet et initialisez un module Go:

```bash
mkdir hello-pumpkin
cd hello-pumpkin
go mod init github.com/yourname/hello-pumpkin
```

Ensuite, ajoutez l'API Go Pumpkin comme dépendance:

```bash
go get github.com/Pumpkin-MC/pumpkin-api-go
```

## Structure du projet

Votre projet doit avoir au moins un fichier `main.go` . La structure doit ressembler à ceci:

```text
├── go.mod
├── go.sum
└── main.go
```
