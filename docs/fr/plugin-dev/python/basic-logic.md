# Logique de base

Cette section couvre la structure de base d'un plugin Pumpkin en Python.

## Classe du Plugin

Chaque plugin Python doit hériter de la classe `Plugin`. Cette classe fournit la structure de base et les méthodes nécessaires pour que le serveur intéragisse avec votre plugin.

```python
from pumpkin_api import Plugin, PluginMetadata, context

class MyPlugin(Plugin):
    def metadata(self) -> PluginMetadata:
        # Définir les métadonnés du plugin ici
        pass

    def on_load(self, ctx: context.Context) -> None:
        # Code à exécuter quand le plugin est chargé
        pass

    def on_unload(self, ctx: context.Context) -> None:
        # Code à exécuter quand le plugin est déchargé
        pass
```

## Metadonnée du Plugin

La méthode `métadonnés` doit retourner une objet `PluginMetadata`, qui contient les informations à propos de votre plugin.

- `name`: Le nom de votre plugin.
- `version`: La version de votre plugin.
- `authors`: Une liste d'auteurs.
- `description`: Une courte description de ce que votre plugin fait.

## Charger et Décharger

- `on_load`: Cette méthode est appelée quand le serveur charge votre plugin. Vous devriez utiliser ça pour enregistrer des événements, commandes et faire votre initialisation.
- `on_unload`: Cette méthode est appelée quand le serveur décharge votre plugin. Utilisez ça pour nettoyer si nécessaire.
