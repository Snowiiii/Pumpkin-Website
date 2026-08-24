# Démarrage rapide

Ce guide va vous aider à commencer à écrire un plugin pour le serveur Pumpkin en utilisant Python.

## Installation

Premièrement, vous devez installer la librairie `pumpkin-api-py`:

```bash
pip install pumpkin-api-py
```

## Créer votre première classe plugin

Créer un fichier nommé `main.py` et ajoutez le contenu suivant:

```python
from pumpkin_api import (
    Plugin, PluginMetadata, register_plugin, 
    server, event, command, text, context
)

class MyPlugin(Plugin):
    def metadata(self) -> PluginMetadata:
        return PluginMetadata(
            name="my-plugin",
            version="0.1.0",
            authors=["you"],
            description="Un plugin d'exemple."
        )

    def on_load(self, ctx: context.Context) -> None:
        print("Plugin Python chargé!")
        
        # Enregistrer un gestionnaire d'evénement
        self.register_event(ctx, event.EventType.PLAYER_JOIN_EVENT, self.on_player_join)

    def on_player_join(self, srv: server.Server, evt: event.PlayerJoinEventData) -> event.PlayerJoinEventData:
        print(f"Player {evt.player.get_name()} joined!")
        return evt

register_plugin(MyPlugin)
```

## Compiler votre plugin

Contruisez votre plugin en un composant WebAssembly en utilisant l'outil fournit:

```bash
pumpkin-api-build main -o my_plugin.wasm
```

Cela va générer un fichier `my_plugin.wasm` que vous pouvez placer dans le dossier `plugins` de votre serveur Pumpkin.
