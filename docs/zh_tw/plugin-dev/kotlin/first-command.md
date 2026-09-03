# 建立您的第一個指令

使用 Kotlin 在 Pumpkin 中註冊自訂指令簡潔、符合慣用法且為強型別。

## 1. 快速範例

以下是一個完整的 Kotlin 外掛 (`Plugin.kt`)，它註冊了一個帶有權限檢查的 `/hello` 指令，並傳送回應給玩家。

```kotlin
package plugin

import pumpkin.plugin.context.Context
import pumpkin.plugin.command.Command
import pumpkin.plugin.permission.Permission
import pumpkin.plugin.permission.PermissionDefault

class MyPlugin {
    fun onLoad(ctx: Context) {
        // 1. 註冊權限節點
        ctx.registerPermission(
            Permission(
                node = "my_kotlin_plugin:hello",
                description = "Allows executing the /hello command",
                default = PermissionDefault.ALLOW,
                children = emptyList()
            )
        )

        // 2. 建立並註冊指令樹
        val cmd = Command(
            names = listOf("hello", "hi"),
            description = "Greets the player"
        )
        ctx.registerCommand(cmd, "my_kotlin_plugin:hello")
    }

    fun handleCommand(sender: pumpkin.plugin.command.CommandSender): Int {
        sender.sendMessage("Hello from Kotlin Plugin!")
        return 1
    }
}
```

## 2. 遊戲內預覽

註冊完成後，您的指令會自動在 Minecraft 中獲得用戶端自動完成、語法驗證與色彩標亮功能：

<img src="/assets/first_command_preview.png" alt="遊戲內指令自動完成預覽" width="500"/>

## 3. 運作方式

::: details 逐步解析

**步驟 1：定義權限節點**

建構一個 `Permission` 物件並將其傳入 `ctx.registerPermission`：

```kotlin
ctx.registerPermission(
    Permission(
        node = "my_kotlin_plugin:hello",
        description = "Allows executing the /hello command",
        default = PermissionDefault.ALLOW,
        children = emptyList()
    )
)
```

**步驟 2：建立指令樹**

使用主要名稱與別名實例化 `Command`：

```kotlin
val cmd = Command(
    names = listOf("hello", "hi"),
    description = "Greets the player"
)
```

**步驟 3：使用 Context 註冊**

使用 `ctx.registerCommand` 註冊指令，並在 `handleCommand` 中處理呼叫：

```kotlin
ctx.registerCommand(cmd, "my_kotlin_plugin:hello")
```

:::

## 下一步

請參閱 [Kotlin 快速入門指南](./quick-start) 以設定您的 `Makefile` 與 Kotlin/Wasm 建置工具。