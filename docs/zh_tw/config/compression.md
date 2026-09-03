# 壓縮

封包壓縮可降低 Java 與基岩版用戶端的頻寬使用量。在 `pumpkin.toml` 中，Java 與基岩版的網路壓縮以及世界區塊壓縮是分別獨立設定的。

## 網路壓縮

### Java 版

:::code-group
[networking.java.compression]
enabled = true
threshold = 256
level = 4
:::

### 基岩版

:::code-group
[networking.bedrock.compression]
enabled = true
threshold = 256
level = 4
:::

### 設定選項

- `enabled`：啟用網路封包壓縮。
- `threshold`：觸發壓縮前所需的最小封包承載大小（以位元組為單位）。
- `level`：壓縮等級（0 到 9，數值越高代表以更多的 CPU 運算時間換取更小的封包大小）。

## 世界區塊壓縮

區塊壓縮設定控制儲存的世界區塊資料在磁碟上如何被壓縮。

:::code-group
[world.chunk.compression]
algorithm = "LZ4"
level = 6
:::

- `algorithm`：用於區塊資料的壓縮演算法（例如：`"LZ4"`）。
- `level`：區塊資料的壓縮等級。