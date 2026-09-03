# RCON

RCON 允許您透過網路連線對 Pumpkin 伺服器進行遠端管理。在 `pumpkin.toml` 中，設定值位於 `[networking.rcon]` 區段。

## 設定

:::code-group
[networking.rcon]
enabled = false
address = "0.0.0.0:25575"
password = ""
max_connections = 10
[networking.rcon.logging]
logged_successfully = true
wrong_password = true
commands = true
quit = true
:::

## RCON 設定

- `enabled`：啟用 RCON 服務的主開關。
- `address`：綁定 RCON 伺服器的 IP 位址與連接埠。
- `password`：驗證 RCON 用戶端所需的密碼。
- `max_connections`：允許的最大同時連線的 RCON 用戶端數量。

## RCON 紀錄設定

- `logged_successfully`：紀錄用戶端驗證成功的事件。
- `wrong_password`：紀錄驗證失敗的嘗試（密碼錯誤）。
- `commands`：紀錄透過 RCON 執行的指令。
- `quit`：紀錄用戶端斷線的事件。