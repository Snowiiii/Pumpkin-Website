# 資源包

Pumpkin 支援向 Java 與基岩版用戶端提供資源包。資源包選項設定位於 `pumpkin.toml` 中的 `[resource_pack.java]` 與 `[resource_pack.bedrock]` 區段。

## Java 資源包

:::code-group
[resource_pack.java]
enabled = false
url = ""
sha1 = ""
prompt_message = ""
force = false
:::

### 選項

- `enabled`：啟用向 Java 用戶端提供資源包。
- `url`：Java 資源包 zip 檔案的直接下載網址。
- `sha1`：資源包 zip 檔案的 SHA-1 總和檢查碼。
- `prompt_message`：提示玩家下載時顯示的訊息。
- `force`：中斷拒絕下載資源包的玩家的連線。

## 基岩版資源包

:::code-group
[resource_pack.bedrock]
enabled = false
force = false
packs = []
:::

### 選項

- `enabled`：啟用基岩版用戶端的資源包。
- `force`：強制基岩版用戶端下載所需的資源包。
- `packs`：基岩版資源包定義的陣列。