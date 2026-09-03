# 快速入門

本指南將協助您開始使用 C 語言編寫 Pumpkin 伺服器外掛。

## 先決條件

在開始之前，請確保您已安裝以下工具：

- [wasi-sdk](https://github.com/WebAssembly/wasi-sdk/releases)（用於將 C 編譯為 WASI）
- `git`（用於複製 API）

## 設定專案

首先，複製包含子模組的 Pumpkin C API 儲存庫：

```shell
git clone --recursive https://github.com/Pumpkin-MC/pumpkin-api-c.git
cd pumpkin-api-c
```

## 建立您的第一個外掛

在儲存庫的根目錄中建立一個名為 `main.c` 的檔案，並新增以下內容：

```c
#include "pumpkin_api.h"
#include <stdio.h>

pumpkin_metadata_t get_meta(void) {
    static const char* authors[] = {"you"};
    return (pumpkin_metadata_t) {
        .name = "my-c-plugin",
        .version = "0.1.0",
        .authors = authors,
        .authors_count = 1,
        .description = "A simple C plugin for Pumpkin",
        .dependencies_count = 0
    };
}

void on_load(plugin_own_context_t ctx) {
    printf("C plugin loaded!\n");
}

REGISTER_PUMPKIN_PLUGIN(((pumpkin_plugin_t){
    .get_metadata = get_meta,
    .on_load = on_load
}))
```

## 建置外掛

若要將您的外掛建置為 WebAssembly 元件，請使用您 `wasi-sdk` 安裝目錄中的 `clang` 編譯器。

請將 `/path/to/wasi-sdk` 替換為您 WASI SDK 的實際路徑。

```shell
/path/to/wasi-sdk/bin/clang -O3 \
    -Iinclude -Isrc/gen \
    src/gen/plugin.c src/pumpkin_api.c main.c \
    -o my_plugin.wasm \
    -mexec-model=reactor
```

這將會產生一個 `my_plugin.wasm` 檔案，您可以將其放入 Pumpkin 伺服器的 `plugins` 資料夾中。