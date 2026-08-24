# Écrire la logique de base

## Point d'entré du plugin

En Go, votre plugin doit implémenter l'interface `api.Plugin` et enregistrer lui-même dans la fonction `init()`. Vous aurrez aussi besoin d'importer `wit_exports` pour la compatibilité WebAssembly.

:::code-group

```go [main.go]
package main

import (
	"github.com/Pumpkin-MC/pumpkin-api-go/api"
	"github.com/Pumpkin-MC/pumpkin-api-go/pkg/pumpkin_plugin_context"
	"github.com/Pumpkin-MC/pumpkin-api-go/pkg/pumpkin_plugin_logging"
	_ "github.com/Pumpkin-MC/pumpkin-api-go/pkg/wit_exports" // Required for WASM exports
)

type MyPlugin struct {
	api.DefaultPlugin
}

func (p *MyPlugin) Metadata() api.Metadata {
	return api.Metadata{
		Name:    "my-go-plugin",
		Version: "0.1.0",
		Authors: []string{"you"},
	}
}

func (p *MyPlugin) OnLoad(ctx *pumpkin_plugin_context.Context) {
	pumpkin_plugin_logging.Log(pumpkin_plugin_logging.LevelInfo(), "Go plugin loaded!")
}

func init() {
	api.RegisterPlugin(&MyPlugin{})
}

func main() {}
```

:::

## Compiler le plugin

Pour compiler votre plugin vers WebAssembly, vous devez utiliser **TinyGo**. Le compilateur standard Go ne prend pas encore en charge les cibles WASI spécifiques requises par Pumpkin de la même manière.

Exécutez la commande suivante dans votre dossier de projet :

```bash
tinygo build -o my_plugin.wasm -target=wasi main.go
```

Cela va générer un fichier `my_plugin.wasm` qui peut être chargé par Pumpkin.