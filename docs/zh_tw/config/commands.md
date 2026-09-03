# 指令

Pumpkin 支援 Minecraft 指令，並允許在 `pumpkin.toml` 中設定控制台、TTY 與權限行為。

## 設定

:::code-group
[commands]
use_console = true
use_tty = true
log_console = true
broadcast_console_to_ops = true
default_op_level = 0
:::

## 設定選項

- `use_console`：是否接受透過控制台輸入的指令。
- `use_tty`：是否啟用互動式控制台的 TTY 支援。
- `log_console`：是否將玩家執行的指令記錄到控制台。
- `broadcast_console_to_ops`：將控制台指令輸出廣播給伺服器管理員 (OP)。
- `default_op_level`：指派給管理員 (OP) 的預設權限等級 (0 到 4)。