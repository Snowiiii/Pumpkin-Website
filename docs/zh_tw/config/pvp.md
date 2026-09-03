# PVP

PVP 行為與戰鬥機制設定位於 `pumpkin.toml` 中的 `[pvp]` 區段。

## 設定

:::code-group
[pvp]
enabled = true
hurt_animation = true
protect_creative = true
knockback = true
swing = true
:::

## 設定選項

- `enabled`：啟用玩家對玩家 (PvP) 戰鬥。
- `hurt_animation`：受到攻擊時顯示受傷動畫。
- `protect_creative`：防止創造模式的玩家受到 PvP 傷害。
- `knockback`：啟用受到傷害時的擊退效果。
- `swing`：啟用攻擊時的揮臂動畫。