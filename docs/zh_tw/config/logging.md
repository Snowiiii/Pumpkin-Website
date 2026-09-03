# 紀錄

Pumpkin 在 `pumpkin.toml` 中提供了可自訂的紀錄選項。

## 設定

:::code-group
[logging]
enabled = true
threads = true
color = true
timestamp = true
file = "latest.log"
:::

## 設定選項

- `enabled`：啟用或停用紀錄功能的總開關。
- `threads`：在紀錄輸出中包含執行緒名稱 / ID。
- `color`：在控制台紀錄中啟用 ANSI 彩色輸出。
- `timestamp`：在紀錄項目中包含時間戳記。
- `file`：紀錄檔案的路徑（例如：`"latest.log"`）。