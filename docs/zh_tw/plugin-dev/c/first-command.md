# 建立您的第一個指令

使用 C 語言為 Pumpkin 撰寫指令具有低開銷、快速的特性，並使用 C WIT 綁定。

## 1. 快速範例

以下是一個完整的 C 外掛檔案 (`main.c`)，它註冊了一個帶有權限檢查的 `/hello` 指令，並傳送回應給玩家。

```c
#include <stdio.h>
#include "pumpkin.h"

void plugin_on_load(pumpkin_context_t ctx) {
    // 1. 註冊權限節點
    pumpkin_permission_t perm = {
        .node = "my_c_plugin:hello",
        .description = "Allows executing the /hello command",
        .default_access = PERMISSION_DEFAULT_ALLOW
    };
    pumpkin_register_permission(ctx, &perm);

    // 2. 建立並註冊指令樹
    const char* names[] = {"hello", "hi"};
    pumpkin_command_t cmd = pumpkin_command_new(names, 2, "Greets the player");
    pumpkin_register_command(ctx, cmd, "my_c_plugin:hello");
}

int32_t plugin_handle_command(uint32_t command_id, pumpkin_sender_t sender, pumpkin_server_t server) {
    pumpkin_sender_send_message(sender, "Hello from C Plugin!");
    return 1;
}

pumpkin_metadata_t plugin_get_metadata() {
    pumpkin_metadata_t meta = {
        .name = "my_c_plugin",
        .version = "0.1.0",
        .description = "My first Pumpkin C plugin"
    };
    return meta;
}
```

## 2. 遊戲內預覽

註冊完成後，您的指令會自動在 Minecraft 中獲得用戶端自動完成、語法驗證與色彩標亮功能：

<img src="/assets/first_command_preview.png" alt="遊戲內指令自動完成預覽" width="500"/>

## 3. 運作方式

::: details 逐步解析

**步驟 1：定義權限結構**

填入 `pumpkin_permission_t` 結構並呼叫 `pumpkin_register_permission`：

```c
pumpkin_permission_t perm = {
    .node = "my_c_plugin:hello",
    .description = "Allows executing the /hello command",
    .default_access = PERMISSION_DEFAULT_ALLOW
};
pumpkin_register_permission(ctx, &perm);
```

**步驟 2：建立指令樹**

透過傳入名稱陣列與描述來建立指令樹：

```c
const char* names[] = {"hello", "hi"};
pumpkin_command_t cmd = pumpkin_command_new(names, 2, "Greets the player");
```

**步驟 3：註冊指令並處理執行**

將指令控制代碼傳入 `pumpkin_register_command`，並在 `plugin_handle_command` 中處理回應：

```c
pumpkin_register_command(ctx, cmd, "my_c_plugin:hello");
```

:::

## 下一步

查看 [C 快速入門指南](./quick-start) 以設定您的編譯器工具鏈。