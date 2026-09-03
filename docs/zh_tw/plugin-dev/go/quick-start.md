# 建立新專案

Pumpkin 外掛使用 [Go](https://go.dev/) 程式語言，並編譯為 WebAssembly。

## 先決條件

在開始之前，請確保您已安裝以下工具：

- [Go](https://go.dev/doc/install)（建議使用最新版本）
- [TinyGo](https://tinygo.org/getting-started/install/)（WASM 編譯所需）

## 初始化新模組

首先，為您的專案建立一個新目錄並初始化 Go 模組：

```shell
mkdir hello-pumpkin
cd hello-pumpkin
go mod init github.com/yourname/hello-pumpkin
```

接下來，將 Pumpkin Go API 新增為相依套件：

```shell
go get github.com/Pumpkin-MC/pumpkin-api-go
```

## 專案結構

您的專案應該至少有一個 `main.go` 檔案。結構應該如下所示：

```
├── go.mod
├── go.sum
└── main.go
```