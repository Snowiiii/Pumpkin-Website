# Proxy

Pumpkin 支援網路伺服器架構的 Proxy 協定。Velocity 與 BungeeCord 的支援設定位於 `pumpkin.toml` 中的 `[networking.proxy]` 區段。

## 設定

:::code-group
[networking.proxy]
enabled = false
[networking.proxy.velocity]
enabled = false
secret = ""
[networking.proxy.bungeecord]
enabled = false
:::

## 設定選項

- `[networking.proxy].enabled`：啟用 Proxy 支援的主開關。
- `[networking.proxy.velocity].enabled`：啟用 Velocity 轉送協定。
- `[networking.proxy.velocity].secret`：對應 Velocity Proxy 設定的轉送密鑰。
- `[networking.proxy.bungeecord].enabled`：啟用 BungeeCord 轉送協定。