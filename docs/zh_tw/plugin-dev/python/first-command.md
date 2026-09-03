# 建立您的第一個指令

在 Pumpkin 中使用 Python 註冊並處理自訂指令的設計既直觀又具表達力。

## 1. 快速範例

以下是一個完整且精簡的 Python 外掛 (`main.py`)，它註冊了一個帶有權限檢查的 `/hello` 指令，並傳送回應給玩家。

```python
from pumpkin_api import (
    Plugin, PluginMetadata, register_plugin,
    permission, command, context, server
)

class HelloCommand:
    def handle(self, sender: command.CommandSender, srv: server.Server, args: command.ConsumedArgs) -> int:
        sender.send_message("Hello from Python Plugin!")
        return 1

class MyPlugin(Plugin):
    def metadata(self) -> PluginMetadata:
        return PluginMetadata(
            name="my_python_plugin",
            version="0.1.0",
            authors=["Developer"],
            description="My first Pumpkin Python plugin"
        )

    def on_load(self, ctx: context.Context) -> None:
        # 1. 註冊權限節點
        ctx.register_permission(permission.Permission(
            node="my_python_plugin:hello",
            description="Allows executing the /hello command",
            default=permission.PermissionDefault.ALLOW,
            children=[]
        ))

        # 2. 建立帶有別名與執行器的指令樹
        cmd = command.Command(["hello", "hi"], "Greets the player")
        cmd.execute(HelloCommand())

        # 3. 註冊指令
        ctx.register_command(cmd, "my_python_plugin:hello")

register_plugin(MyPlugin)
```

## 2. 遊戲內預覽

註冊完成後，您的指令會自動在 Minecraft 中獲得用戶端自動完成、語法驗證與色彩標亮功能：

<img src="/assets/first_command_preview.png" alt="遊戲內指令自動完成預覽" width="500"/>

## 3. 運作方式

::: details 逐步解析

**步驟 1：定義權限**

Pumpkin 中的指令需要一個權限節點。使用 `permission.PermissionDefault.ALLOW` 註冊以預設允許執行：

```python
ctx.register_permission(permission.Permission(
    node="my_python_plugin:hello",
    description="Allows executing the /hello command",
    default=permission.PermissionDefault.ALLOW,
    children=[]
))
```

**步驟 2：建立指令樹**

使用主要名稱與別名建立一個 `command.Command` 實例，然後使用 `.execute(...)` 附加您的處理器：

```python
cmd = command.Command(["hello", "hi"], "Greets the player")
cmd.execute(HelloCommand())
```

**步驟 3：使用 Context 註冊**

將指令樹與權限節點字串傳入 `ctx.register_command`：

```python
ctx.register_command(cmd, "my_python_plugin:hello")
```

:::

## 下一步

查看[事件](./events)以了解如何使用 Python 處理玩家動作與伺服器事件。
進一步了解[基本邏輯](./basic-logic)。