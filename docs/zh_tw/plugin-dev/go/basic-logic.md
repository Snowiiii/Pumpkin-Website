# 撰寫基本邏輯

## 外掛進入點

在 Go 中，您的外掛必須實作 `api.Plugin` 介面，並在 `init()` 函式中註冊自己。您也需要匯入 `wit_exports` 以確保 WebAssembly 相容性。

:::code-group
```go
package main

import (
	"github.com/Pumpkin-MC/pumpkin-api-go/api"
	"github.com/Pumpkin-MC/pumpkin-api-go/pkg/pumpkin_plugin_context"
	"github.com/Pumpkin-MC/pumpkin-api-go/pkg/pumpkin_plugin_logging"
	_ "github.com/Pumpkin-MC/pumpkin-api-go/pkg/wit_exports" // WASM 匯出所需
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

## 編譯外掛

若要將您的外掛編譯為 WebAssembly，您必須使用 TinyGo。標準 Go 編譯器目前尚未以相同方式支援 Pumpkin 所需的特定 WASI 目標。

在您的專案資料夾中執行以下指令：

```shell
tinygo build -o my_plugin.wasm -target=wasi main.go
```

這將會產生一個可被 Pumpkin 載入的 `my_plugin.wasm` 檔案。

## 測試外掛

安裝外掛非常簡單，只需將外掛二進位檔 (`.wasm`) 放入 Pumpkin 伺服器的 `plugins/` 資料夾即可！

當您啟動伺服器並執行 `/plugins` 指令時，您應該能看到您的外掛列在清單中。