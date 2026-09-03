# 效能評測

此處將常見的 Minecraft 伺服器軟體與 Pumpkin 進行比較。

[!CAUTION]
此比較並不公平。Pumpkin 目前的功能遠少於其他伺服器，這可能意味著它使用的資源較少。
此外，也必須考量其他伺服器已有多年的最佳化時間。
原版分支無需重寫整個原版邏輯，可以完全專注於最佳化。

![顯示 9 個 Minecraft 遊戲視窗的螢幕截圖](https://github.com/user-attachments/assets/e08fbb00-42fe-4479-a03b-11bb6886c91a)

## 規格

### 技術

#### 軟體
- 發行版：Manjaro Linux
- 架構：x86_64（64 位元）
- 核心版本：6.11.3-arch1-1

#### 硬體
- 主機板：MAG B650 TOMAHAWK WIFI
- CPU：AMD Ryzen 7600X 6 核心
- 記憶體：Corsair 2x16GB DDR5 6000MHz
- 儲存空間：Samsung 990 PRO 1TB PCIe 4.0 M.2 SSD
- 散熱器：be quiet Dark Rock Elite

### Rust
- 工具鏈：stable-x86_64-unknown-linux-gnu (1.81.0)
- Rust 編譯器：rustc 1.81.0 (eeb90cda1 2024-09-04)

### Java
- JDK 版本：OpenJDK 23 64-Bit 2024-09-17
- JRE 版本：OpenJDK Runtime Environment (build 23+37)
- 供應商：Oracle

### 遊戲
- Minecraft 版本：1.21.1
- 視野距離：10
- 模擬距離：10
- 線上模式：false
- RCON：false

<sub><sup>為了方便使用非正版帳號進行測試，已停用線上模式。</sup></sub>

[!NOTE]
所有測試均已執行多次，以獲得更準確的結果。
所有玩家在生成時均未移動。僅載入最初的 8 個區塊。
所有伺服器均使用各自的地形生成。未預先載入任何世界。

[!IMPORTANT]
當只有一名玩家時，`CPU 最大值` 通常較高，因為正在載入初始區塊。

## Pumpkin

- 建置版本：[8febc50](https://github.com/Snowiiii/Pumpkin/commit/8febc5035d5611558c13505b7724e6ca284e0ada)
- 編譯參數：`--release`
- 執行參數：
- 檔案大小：<FmtNum :n=12.3 />MB
- 啟動時間：<FmtNum :n=8 />ms
- 關閉時間：<FmtNum :n=0 />ms

| 玩家數|記憶體|CPU 閒置|CPU 最大值|
| ---|---|---|---|
| 0|<FmtNum :n=392.2 / >KB|<FmtNum :n=0 / >%|<FmtNum :n=0 / >%|
| 1|<FmtNum :n=24.9 / >MB|<FmtNum :n=0 / >%|<FmtNum :n=4 / >%|
| 2|<FmtNum :n=25.1 / >MB|<FmtNum :n=0 / >%|<FmtNum :n=0.6 / >%|
| 5|<FmtNum :n=26 / >MB|<FmtNum :n=0 / >%|<FmtNum :n=1 / >%|
| 10|<FmtNum :n=27.1 / >MB|<FmtNum :n=0 / >%|<FmtNum :n=1.5 / >%|

<sub><sup>Pumpkin 會快取已載入的區塊，因此除了玩家資料外不會有額外的記憶體使用，CPU 使用量也極低。</sup></sub>

### 編譯時間

從零開始編譯：
- 除錯版：<FmtNum :n=10.35 />秒
- 正式版：<FmtNum :n=38.40 />秒

重新編譯（pumpkin crate）：
- 除錯版：<FmtNum :n=1.82 />秒
- 正式版：<FmtNum :n=28.68 />秒

## Vanilla

- 版本：[1.21.1](https://piston-data.mojang.com/v1/objects/59353fb40c36d304f2035d51e7d6e6baa98dc05c/server.jar)
- 編譯參數：
- 執行參數：`nogui`
- 檔案大小：<FmtNum :n=51.6 />MB
- 啟動時間：<FmtNum :n=7 />秒
- 關閉時間：<FmtNum :n=4 />秒

| 玩家數|記憶體|CPU 閒置|CPU 最大值|
| ---|---|---|---|
| 0|<FmtNum n= "860 " / >MB|<FmtNum n= "0.1 " / > -  <FmtNum n= "0.3 " / >%|<FmtNum n= "51 " / >%|
| 1|<FmtNum n= "1.5 " / >GB|<FmtNum n= "0.9 " / > -  <FmtNum n= "1 " / >%|<FmtNum n= "41 " / >%|
| 2|<FmtNum n= "1.6 " / >GB|<FmtNum n= "1 " / > -  <FmtNum n= "1.1 " / >%|<FmtNum n= "10 " / >%|
| 5|<FmtNum n= "1.8 " / >GB|<FmtNum n= "2 " / >%|<FmtNum n= "20 " / >%|
| 10|<FmtNum n= "2.2 " / >GB|<FmtNum n= "4 " / >%|<FmtNum n= "24 " / >%|

## Paper

- 建置版本：[122](https://api.papermc.io/v2/projects/paper/versions/1.21.1/builds/122/downloads/paper-1.21.1-122.jar)
- 編譯參數：
- 執行參數：`nogui`
- 檔案大小：<FmtNum :n=49.4 />MB
- 啟動時間：<FmtNum :n=7 />秒
- 關閉時間：<FmtNum :n=3 />秒

| 玩家數|記憶體|CPU 閒置|CPU 最大值|
| ---|---|---|---|
| 0|<FmtNum :n=1.1 / >GB|<FmtNum :n=0.2 / > -  <FmtNum :n=0.3 / >%|<FmtNum :n=36 / >%|
| 1|<FmtNum :n=1.7 / >GB|<FmtNum :n=0.9 / > -  <FmtNum :n=1.0 / >%|<FmtNum :n=47 / >%|
| 2|<FmtNum :n=1.8 / >GB|<FmtNum :n=1 / > -  <FmtNum :n=1.1 / >%|<FmtNum :n=10 / >%|
| 5|<FmtNum :n=1.9 / >GB|<FmtNum :n=1.5 / >%|<FmtNum :n=15 / >%|
| 10|<FmtNum :n=2 / >GB|<FmtNum :n=3 / >%|<FmtNum :n=20 / >%|

## Purpur

- 建置版本：[2324](https://api.purpurmc.org/v2/purpur/1.21.1/2324/download)
- 編譯參數：
- 執行參數：`nogui`
- 檔案大小：<FmtNum :n=53.1 />MB
- 啟動時間：<FmtNum :n=8 />秒
- 關閉時間：<FmtNum :n=4 />秒

| 玩家數|記憶體|CPU 閒置|CPU 最大值|
| ---|---|---|---|
| 0|<FmtNum :n=1.4 / >GB|<FmtNum :n=0.2 / > -  <FmtNum :n=0.3 / >%|<FmtNum :n=25 / >%|
| 1|<FmtNum :n=1.6 / >GB|<FmtNum :n=0.7 / > -  <FmtNum :n=1.0 / >%|<FmtNum :n=35 / >%|
| 2|<FmtNum :n=1.7 / >GB|<FmtNum :n=1.1 / > -  <FmtNum :n=1.3 / >%|<FmtNum :n=9 / >%|
| 5|<FmtNum :n=1.9 / >GB|<FmtNum :n=1.6 / >%|<FmtNum :n=20 / >%|
| 10|<FmtNum :n=2.2 / >GB|<FmtNum :n=2 / > -  <FmtNum :n=2.5 / >%|<FmtNum :n=26 / >%|

## Minestom

- 提交：[0ca1dda2fe](https://github.com/Minestom/Minestom/commit/0ca1dda2fe11390a1b89a228bbe7bf78fefc73e1)
- 編譯參數：
- 執行參數：
- 語言：使用 Kotlin 2.0.0 執行效能評測（Minestom 本身以 Java 開發）
- 檔案大小：<FmtNum :n=2.8 />MB（函式庫）
- 啟動時間：<FmtNum :n=310 />ms
- 關閉時間：<FmtNum :n=0 />ms

<sub>[使用的範例程式碼來自](https://minestom.net/docs/setup/your-first-server)</sub>

| 玩家數|記憶體|CPU 閒置|CPU 最大值|
| ---|---|---|---|
| 0|<FmtNum :n=228 / >MB|<FmtNum :n=0.1 / > -  <FmtNum :n=0.3 / >%|<FmtNum :n=1 / >%|
| 1|<FmtNum :n=365 / >MB|<FmtNum :n=0.9 / > -  <FmtNum :n=1.0 / >%|<FmtNum :n=5 / >%|
| 2|<FmtNum :n=371 / >MB|<FmtNum :n=1 / > -  <FmtNum :n=1.1 / >%|<FmtNum :n=4 / >%|
| 5|<FmtNum :n=390 / >MB|<FmtNum :n=1.0 / >%|<FmtNum :n=6 / >%|
| 10|<FmtNum :n=421 / >MB|<FmtNum :n=3 / >%|<FmtNum :n=9 / >%|

效能評測時間：<FmtDateTime :d="new Date('2024-10-15T16:34Z')" />