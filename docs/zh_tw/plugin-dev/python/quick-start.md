# 快速入門

本指南將協助您開始使用 Python 編寫 Pumpkin 伺服器外掛。

## 安裝

首先，您需要安裝 `pumpkin-api-py` 函式庫：

```shell
pip install pumpkin-api-py
```

## 建立您的第一個外掛

建立一個名為 `main.py` 的檔案並新增以下內容：

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
            description="An example plugin."
        )

    def on_load(self, ctx: context.Context) -> None:
        print("Python plugin loaded!")
        # 註冊事件處理器
        self.register_event(ctx, event.EventType.PLAYER_JOIN_EVENT, self.on_player_join)

    def on_player_join(self, srv: server.Server, evt: event.PlayerJoinEventData) -> event.PlayerJoinEventData:
        print(f"Player {evt.player.get_name()} joined!")
        return evt

register_plugin(MyPlugin)
```

## 建置外掛

使用提供的建置工具將您的外掛建置為 WebAssembly 元件：

```shell
pumpkin-api-build main -o my_plugin.wasm
```

這將會產生一個 `my_plugin.wasm` 檔案，您可以將其放入 Pumpkin 伺服器的 `plugins` 資料夾中。