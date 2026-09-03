# 驗證

## 為什麼需要驗證

離線帳號（即僅根據玩家使用者名稱生成，而無需連線至授權或驗證伺服器的帳號）可以任意選擇暱稱。若沒有額外的外掛，這意味著玩家可以冒充其他玩家，包括擁有管理員 (OP) 權限的玩家。

## 離線模式伺服器

預設情況下，設定中已啟用 `online_mode`（`[networking.java.online_mode]` / `[networking.bedrock.online_mode]`）。這會啟用驗證並停用離線帳號。若您希望允許離線帳號，可以在 `pumpkin.toml` 中停用 `online_mode`。

## Yggdrasil 驗證運作方式

1. 用戶端從啟動器取得驗證令牌與 UUID。
2. 用戶端在載入期間，使用驗證令牌從授權/驗證伺服器取得資料，例如各種簽署金鑰與被封鎖的伺服器列表。
3. 用戶端在加入伺服器時，會向授權/驗證伺服器傳送加入請求。若帳號已被停權，Mojang 伺服器可以拒絕此請求。
4. 用戶端透過封包將其身分資訊傳送給伺服器。
5. 伺服器根據此身分資訊，向授權/驗證伺服器傳送 `hasJoined` 請求。若成功，即可取得玩家資訊，例如皮膚。

## 自訂驗證伺服器

Pumpkin 支援自訂驗證伺服器。您可以在 `features.toml` 中替換驗證網址。

## Pumpkin 驗證運作方式

- **GET 請求：** Pumpkin 向指定的驗證網址傳送 GET 請求。
- **狀態碼 200：** 若驗證成功，伺服器會回應狀態碼 200。
- **解析 JSON 遊戲個人檔案：** Pumpkin 會解析回應中回傳的 JSON 遊戲個人檔案。

### 遊戲個人檔案

```rust
struct GameProfile {
    id: UUID,
    name: String,
    properties: Vec<Property>,
    profile_actions: Option<Vec<ProfileAction>>, // 選填，僅在套用動作時存在
}
```

### 屬性

```rust
struct Property {
    name: String,
    value: String, // Base64 編碼
    signature: Option<String>, // 選填，Base64 編碼
}
```

### 個人檔案動作

```rust
enum ProfileAction {
    FORCED_NAME_CHANGE,
    USING_BANNED_SKIN,
}
```