# 常見問題

## 驗證使用者名稱失敗
**問題：** 部分玩家回報登入伺服器時發生問題，包含遇到「驗證使用者名稱失敗」的錯誤。
**原因：** 這與身分驗證有關，通常與 `prevent_proxy_connections` 設定有關。
**解決方法：** 在 `pumpkin.toml` 的 `[networking.java.authentication]` 下停用 `prevent_proxy_connections`。