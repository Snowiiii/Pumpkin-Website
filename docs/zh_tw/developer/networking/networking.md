# 網路

Pumpkin 中大部分的網路程式碼都可以在 [pumpkin-protocol](https://github.com/Pumpkin-MC/Pumpkin/tree/master/pumpkin-protocol) crate 中找到。

- **Serverbound：** 用戶端 → 伺服器
- **Clientbound：** 伺服器 → 用戶端

## 結構

Pumpkin 協定中的封包是依照功能與狀態來組織的。

- `server`：包含伺服器接收封包的定義。
- `client`：包含用戶端接收封包的定義。

## 狀態

- **Handshake（握手）：** 永遠是用戶端傳送的第一個封包。這也會決定下一個狀態，通常用於指示玩家是否想要執行狀態請求、加入伺服器，或想要被轉送。
- **Status（狀態）：** 表示用戶端想要查看狀態回應 (MOTD)。
- **Login（登入）：** 登入序列。表示用戶端想要加入伺服器。
- **Config（設定）：** 設定封包的序列大部分是由伺服器傳送給用戶端（功能、資源包、伺服器連結等）。
- **Play（遊戲）：** 最終狀態，表示玩家已準備好加入，也用於處理所有其他遊戲玩法封包。

## Minecraft 協定

您可以在 [https://minecraft.wiki/w/Minecraft_Wiki:Projects/wiki.vg_merge/Protocol](https://minecraft.wiki/w/Minecraft_Wiki:Projects/wiki.vg_merge/Protocol) 找到所有 Minecraft Java 封包。在那裡您也可以看到它們所屬的[狀態](#狀態)。
您也可以看到封包所擁有的所有資訊，根據它們是伺服器接收還是用戶端接收，我們可以讀取或寫入。

## 新增封包

新增封包很簡單。首先，進行 derive：

```rust
// 用於用戶端接收封包：
#[derive(Serialize)]
// 用於伺服器接收封包：
#[derive(Deserialize)]
```

接下來，您必須讓它知道您的 `struct` 代表一個封包。這會自動從 JSON 封包檔案取得封包 ID。

```rust
use pumpkin_data::packet::clientbound::PLAY_DISCONNECT;
#[packet(PLAY_DISCONNECT)]
```

現在您可以建立 `struct`。

> [!IMPORTANT]
> 請將封包名稱以 "C" 或 "S" 開頭，分別代表 "Clientbound（用戶端接收）" 或 "Serverbound（伺服器接收）"。
> 此外，如果是一個可以在多個[狀態](#狀態)中傳送的封包，請在名稱中加入狀態。例如，有 3 個不同的斷線封包。
> - `CLoginDisconnect`
> - `CConfigDisconnect`
> - `CPlayDisconnect`

在封包結構中建立欄位以代表將被傳送的資料。

> [!IMPORTANT]
> 使用描述性的欄位名稱與適當的資料型別。

範例：

```rust
pub struct CPlayDisconnect {
    reason: TextComponent,
    // 更多欄位...
}
pub struct SPlayerPosition {
    pub x: f64,
    pub feet_y: f64,
    pub z: f64,
    pub ground: bool,
}
```

（僅限用戶端接收封包）`impl` 一個 `new` 函式，這樣我們就可以透過傳入值來實際建立它們。

```rust
impl CPlayDisconnect {
    pub fn new(reason: TextComponent) -> Self {
        Self { reason }
    }
}
```

最後，所有內容應該結合在一起。

```rust
#[derive(Serialize)]
 #[packet(PLAY_DISCONNECT)]
 pub struct CPlayDisconnect {
     reason: TextComponent,
 }
 impl CPlayDisconnect {
     pub fn new(reason: TextComponent) -> Self {
         Self { reason }
     }
 }
 #[derive(Deserialize)]
 #[packet(PLAY_MOVE_PLAYER_POS)]
 pub struct SPlayerPosition {
     pub x: f64,
     pub feet_y: f64,
     pub z: f64,
     pub ground: bool,
 }
```

您也可以手動序列化/反序列化封包，如果封包更為複雜，這會很有用。

```rust
-#[derive(Serialize)]
+ impl ClientPacket for CPlayDisconnect {
+    fn write(&self, bytebuf: &mut BytesMut) {
+       bytebuf.put_slice(&self.reason.encode());
+    }
-#[derive(Deserialize)]
+ impl ServerPacket for SPlayerPosition {
+    fn read(bytebuf: &mut Bytes) -> Result<Self, ReadingError> {
+       Ok(Self {
+           x: bytebuf.try_get_f64()?,
+           feet_y: bytebuf.try_get_f64()?,
+           z: bytebuf.try_get_f64()?,
+           ground: bytebuf.try_get_bool()?,
+       })
+    }
```

您現在可以傳送用戶端接收封包（參閱[傳送封包](#傳送封包)）或監聽伺服器接收封包（參閱[接收封包](#接收封包)）。

## Client

Pumpkin 將 `Client` 和 `Player` 分開分類。不在 Play 狀態中的所有東西都是簡單的 `Client`。以下是差異：

### Client
- 只能處於以下狀態：Status、Login、Transfer、Config
- 不是生物實體
- 資源消耗較小

### Player
- 只能處於 Play 狀態
- 是世界中的生物實體
- 擁有更多資料並消耗更多資源

## 傳送封包

範例：

```rust
// 僅在 Status 狀態中有效
client.send_packet(&CStatusResponse::new("{ description: "A Description"}"));
```

## 接收封包

對於 `Client`：

`src/client/mod.rs`

```rust
// 將封包放入正確的狀態
  fn handle_mystate_packet(
   &self,
     server: &Arc<Server>,
     packet: &mut RawPacket,
 ) -> Result<(), ReadingError> {
     let bytebuf = &mut packet.bytebuf;
     match packet.id.0 {
         SStatusRequest::PACKET_ID => {
                 self.handle_status_request(server, SStatusRequest::read(bytebuf)?)
                     .await;
             }
 +            MyPacket::PACKET_ID => {
 +                self.handle_my_packet(MyPacket::read(bytebuf)?)
 +                    .await;
             }
             _ => {
             log::error!(
                 "Failed to handle packet id {} while in ... state",
                 packet.id.0
             );
             }
     };
     Ok(())
 }
```

對於 `Player`：

`src/entity/player.rs`

```rust
// Player 僅有 Play 狀態
  fn handle_play_packet(
   &self,
     server: &Arc<Server>,
     packet: &mut RawPacket,
 ) -> Result<(), ReadingError> {
     let bytebuf = &mut packet.bytebuf;
     match packet.id.0 {
         SChatMessage::PACKET_ID => {
             self.handle_chat_message(SChatMessage::read(bytebuf)?).await;
         }
        MyPacket::PACKET_ID => {
 +           self.handle_mypacket(server, MyPacket::read(bytebuf)?).await;
         }
         _ => {
             log::error!(
                 "Failed to handle packet id {} while in ... state",
                 packet.id.0
             );
         }
     };
     Ok(())
 }
```

## 壓縮

Minecraft 封包可以使用 ZLib 壓縮進行解碼/編碼。通常會設定一個閾值來決定何時套用壓縮；這通常會影響區塊封包。

## 移植

若要移植到新的 Minecraft 版本，您可以在 [minecraft.wiki 協定參考](https://minecraft.wiki/w/Java_Edition_protocol) 比較協定的差異。
此外，請更改 `src/lib.rs` 中的 `CURRENT_MC_PROTOCOL`。