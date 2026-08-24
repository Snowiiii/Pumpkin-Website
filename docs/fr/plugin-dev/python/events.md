# Événements

Les événments permettent à votre plugin de réagir à des actions qui arrivent sur le serveur, comme des joueurs qui se connectent ou des messages envoyés.

## Enregistrer un événement

Vous pouvez enregistrer un gestionnaire d’événements dans la méthode `on_load` de votre plug-in en utilisant `self.register_event`.

```python
def on_load(self, ctx: context.Context) -> None:
    self.register_event(ctx, event.EventType.PLAYER_JOIN_EVENT, self.on_player_join)
```

## Gestionnaire d'événement

Un gestionnaire d’événements est une méthode qui reçoit l’instance du serveur et les données de l’événement. Il doit renvoyer les données (éventuellement modifiées) de l’événement.

```python
def on_player_join(self, srv: server.Server, evt: event.PlayerJoinEventData) -> event.PlayerJoinEventData:
    print(f"Player {evt.player.get_name()} joined!")
    return evt
```

## Les types d'événements

Le `event.EventType` contient tous les événements disponibles. Certains événements courants incluent:

- `PLAYER_JOIN_EVENT`
- `PLAYER_QUIT_EVENT`
- `PLAYER_CHAT_EVENT`
