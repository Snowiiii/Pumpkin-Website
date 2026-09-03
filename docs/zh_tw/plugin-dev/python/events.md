# 事件

事件允許您的外掛回應伺服器上發生的動作，例如玩家加入或訊息傳送。

## 註冊事件

您可以使用 `self.register_event` 在外掛的 `on_load` 方法中註冊事件處理器。

```python
def on_load(self, ctx: context.Context) -> None:
    self.register_event(ctx, event.EventType.PLAYER_JOIN_EVENT, self.on_player_join)
```

## 事件處理器

事件處理器是一個接收伺服器實例與事件資料的方法。它應該回傳（可能已修改的）事件資料。

```python
def on_player_join(self, srv: server.Server, evt: event.PlayerJoinEventData) -> event.PlayerJoinEventData:
    print(f"Player {evt.player.get_name()} joined!")
    return evt
```

## 事件類型

`event.EventType` 列舉包含所有可用的事件。一些常見的事件包括：

- `PLAYER_JOIN_EVENT`
- `PLAYER_QUIT_EVENT`
- `PLAYER_CHAT_EVENT`