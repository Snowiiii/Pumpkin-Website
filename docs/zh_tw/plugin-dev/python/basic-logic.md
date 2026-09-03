# 基本邏輯

本節涵蓋 Python 中 Pumpkin 外掛的基本結構。

## Plugin 類別

每個 Python 外掛都必須繼承 `Plugin` 類別。此類別提供了伺服器與您的外掛互動所需的基礎結構與方法。

```python
from pumpkin_api import Plugin, PluginMetadata, context

class MyPlugin(Plugin):
    def metadata(self) -> PluginMetadata:
        # 在此定義外掛中繼資料
        pass

    def on_load(self, ctx: context.Context) -> None:
        # 外掛載入時要執行的程式碼
        pass

    def on_unload(self, ctx: context.Context) -> None:
        # 外掛卸載時要執行的程式碼
        pass
```

## 外掛中繼資料

`metadata` 方法必須回傳一個 `PluginMetadata` 物件，其中包含關於您外掛的資訊。

- `name`：您的外掛名稱。
- `version`：您的外掛版本。
- `authors`：作者列表。
- `description`：您的外掛功能的簡短描述。

## 載入與卸載

- `on_load`：當伺服器載入您的外掛時會呼叫此方法。您應該使用此方法來註冊事件、指令，並執行任何初始化作業。
- `on_unload`：當伺服器卸載您的外掛時會呼叫此方法。如有必要，請使用此方法進行清理。