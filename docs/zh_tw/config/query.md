# Query

Query 協定允許外部應用程式（例如伺服器列表或監控系統）向 Pumpkin 請求狀態詳細資訊。

## 設定

:::code-group
[networking.query]
enabled = true
address = "0.0.0.0:25565"
:::

## 設定選項

- `enabled`：啟用或停用 Query 監聽器。
- `address`：綁定 Query 監聽器的網路位址與連接埠。