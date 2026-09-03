# 世界格式

## 區域檔案格式

Minecraft Beta 1.3 至 Release 1.2 使用了一種被稱為「區域檔案格式」(Region file format) 的 Minecraft 格式。
以此格式儲存的檔案為 `.mcr` 檔案，每個檔案儲存一組 32x32 個區塊，稱為一個區域。
更多詳情可在 [Minecraft Wiki](https://minecraft.wiki/w/Region_file_format) 上找到。

## Anvil 檔案格式

在 Minecraft Release 1.2 之後取代了區域檔案格式，這是用於儲存現代原版 Minecraft：Java 版世界的檔案格式。
以此格式儲存的檔案為 `.mca` 檔案。雖然使用了相同的區域邏輯，但仍有許多變更。顯著的變更包括高度限制從 256 提升至 320，以及更多的方塊 ID。
更多詳情可在 [Minecraft Wiki](https://minecraft.wiki/w/Anvil_file_format) 上找到。

## Linear 檔案格式

有一種更現代的檔案格式被稱為 Linear 區域檔案格式。它節省磁碟空間，並使用 zstd 函式庫取代 zlib。這是有益的，因為 zlib 已經非常老舊且過時。
以此格式儲存的檔案為 `.linear` 檔案，它在主世界和地獄中可節省約 50% 的磁碟空間，在終界中可節省 95%。
更多詳情可在 [LinearRegionFileFormatTools](https://github.com/xymb-endcrystalme/LinearRegionFileFormatTools) 的 GitHub 頁面上找到。

## Slime 檔案格式

Slime 由 Hypixel 開發，旨在修復 Anvil 檔案格式的許多缺陷，它也取代了 zlib，並且相比 Anvil 節省空間。它將整個世界儲存在單一的存檔中，並允許該檔案被載入至多個執行個體。
以此格式儲存的檔案為 `.slime` 檔案。
更多詳情可在 [Slime World Manager](https://github.com/cijaaimee/Slime-World-Manager#:~:text=Slime%20World%20Manager%20is%20a,worlds%20faster%20and%20save%20space.) 的 GitHub 頁面上找到，也可以在 Hypixel 的 [Dev Blog #5](https://hypixel.net/threads/dev-blog-5-storing-your-skyblock-island.2190753/) 上找到。

## Schematic 檔案格式

與其他列出的檔案格式不同，Schematic 檔案格式並非用於儲存 Minecraft 世界，而是用於第三方程式中，例如 MCEdit、WorldEdit 和 Schematica。
以此格式儲存的檔案為 `.schematic` 檔案，並以 NBT 格式儲存。
更多詳情可在 [Minecraft Wiki](https://minecraft.wiki/w/Schematic_file_format) 上找到。

## 世界生成

當伺服器啟動時，它會檢查是否有存檔存在，也稱為「世界」。
Pumpkin 接著會呼叫世界生成：

### 存檔存在

- `AnvilChunkReader` 會被呼叫以處理指定存檔的區域檔案
  - 如上所述，區域檔案儲存 32x32 個區塊
  - 每個區域檔案的命名對應於其在世界中的座標
    - `r.{}.{}.mca`
- 位置表從存檔檔案中讀取，代表區塊座標
- 時間戳記表從存檔檔案中讀取，代表區塊最後一次被修改的時間

### 存檔不存在

- 世界種子被設為 "0"。未來它將被設為 "basic" 設定中的值。
- `PlainsGenerator` 會被呼叫，因為目前 `Plains`（平原）是唯一已實作的生態域。
- `PerlinTerrainGenerator` 會被呼叫以設定區塊高度
  - 石頭高度被設為區塊高度下方 5 格
  - 泥土高度被設為區塊高度下方 2 格
  - 草方塊出現在泥土頂部
  - 基岩被設於 y = -64
  - 花和矮草隨機散落
- `SuperflatGenerator` 也可用，但目前無法呼叫。
  - 基岩被設於 y = -64
  - 泥土被設於上方 2 格
  - 草方塊被設於再上方 1 格

方塊可以被放置和破壞，但變更無法以任何世界格式儲存。Anvil 世界目前為唯讀。