# 建立您的第一個指令

使用 Go 在 Pumpkin 中註冊指令是基於標準 Go 慣用法，並使用 TinyGo WASM 編譯。

## 1. 快速範例

以下是一個完整的 Go 外掛檔案 (`main.go`)，它註冊了一個帶有權限檢查的 `/hello` 指令，並傳送回應給玩家。

```go
package main

import (
	"github.com/Pumpkin-MC/pumpkin-api-go/api"
	"github.com/Pumpkin-MC/pumpkin-api-go/pkg/pumpkin_plugin_command"
	"github.com/Pumpkin-MC/pumpkin-api-go/pkg/pumpkin_plugin_context"
	"github.com/Pumpkin-MC/pumpkin-api-go/pkg/pumpkin_plugin_permission"
	_ "github.com/Pumpkin-MC/pumpkin-api-go/pkg/wit_exports"
)

type MyPlugin struct {
	api.DefaultPlugin
}

func (p *MyPlugin) Metadata() api.Metadata {
	return api.Metadata{
		Name:        "my_go_plugin",
		Version:     "0.1.0",
		Authors:     []string{"Developer"},
		Description: "My first Pumpkin Go plugin",
	}
}

func (p *MyPlugin) OnLoad(ctx *pumpkin_plugin_context.Context) {
	// 1. 註冊權限節點
	ctx.RegisterPermission(pumpkin_plugin_permission.Permission{
		Node:        "my_go_plugin:hello",
		Description: "Allows executing the /hello command",
		Default:     pumpkin_plugin_permission.PermissionDefaultAllow(),
	})

	// 2. 建立並註冊指令樹
	cmd := pumpkin_plugin_command.New([]string{"hello", "hi"}, "Greets the player")
	ctx.RegisterCommand(cmd, "my_go_plugin:hello")
}

func (p *MyPlugin) HandleCommand(cmdID uint32, sender pumpkin_plugin_command.CommandSender) int32 {
	sender.SendMessage("Hello from Go Plugin!")
	return 1
}

func init() {
	api.RegisterPlugin(&MyPlugin{})
}

func main() {}
```

## 2. 遊戲內預覽

註冊完成後，您的指令會自動在 Minecraft 中獲得用戶端自動完成、語法驗證與色彩標亮功能：

<img src="/assets/first_command_preview.png" alt="遊戲內指令自動完成預覽" width="500"/>

## 3. 運作方式

::: details 逐步解析

**步驟 1：註冊權限**

在 `OnLoad` 中呼叫 `ctx.RegisterPermission`：

```go
ctx.RegisterPermission(pumpkin_plugin_permission.Permission{
    Node:        "my_go_plugin:hello",
    Description: "Allows executing the /hello command",
    Default:     pumpkin_plugin_permission.PermissionDefaultAllow(),
})
```

**步驟 2：建立指令樹**

使用 `pumpkin_plugin_command.New` 實例化指令樹：

```go
cmd := pumpkin_plugin_command.New([]string{"hello", "hi"}, "Greets the player")
```

**步驟 3：註冊與執行**

使用 `ctx.RegisterCommand` 註冊指令，並在 `HandleCommand` 中處理執行：

```go
ctx.RegisterCommand(cmd, "my_go_plugin:hello")
```

:::

## 下一步

請參閱 [Go 快速入門指南](./quick-start) 以設定 TinyGo 編譯。
進一步了解[基本邏輯](./basic-logic)。