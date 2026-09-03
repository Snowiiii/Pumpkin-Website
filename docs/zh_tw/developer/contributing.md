# 貢獻至 Pumpkin

我們感謝您對貢獻 Pumpkin 的興趣！本文件概述了提交錯誤回報、功能建議與程式碼變更的準則。

## 開始使用

開始使用最簡單的方式是在[我們的 Discord 伺服器](https://discord.gg/wT8XjrjKkf)尋求協助。

## 如何貢獻

有多種方式可以貢獻至 Pumpkin：

### 回報錯誤

如果您遇到錯誤，請先搜尋[問題追蹤系統](https://github.com/Pumpkin-MC/Pumpkin/issues)上是否有現有的問題。
如果您找不到重複的問題，請開啟一個新的問題。
請依照範本提供清晰的錯誤描述，並盡可能包含重現步驟。
螢幕截圖、紀錄或程式碼片段也會有所幫助。

### 建議功能

您有改進 Pumpkin 的想法嗎？請在問題追蹤系統上開啟一個新的問題來分享您的想法。
請詳細描述提議的功能，包括其優點與潛在的實作考量。

### 貢獻程式碼

要開始貢獻程式碼至 Pumpkin，請先在 GitHub 上 fork 儲存庫

1. 首先，如果您還沒有帳號，請先建立一個 GitHub 帳號
2. 前往 Pumpkin 的官方 [GitHub 組織](https://github.com/Pumpkin-MC) 並按下 fork
3. 建立 fork 代表您現在擁有自己的 Pumpkin 原始碼副本（這並不代表您擁有版權）。

現在您擁有一份可以編輯的副本，您需要一些工具。

3. 為您的作業系統安裝 [git](https://git-scm.com/downloads)
   - 要開始使用 git，請造訪[開始使用 Git](https://docs.github.com/en/get-started/getting-started-with-git)
   - 選用：如果您想要一個圖形化工具來與 GitHub 互動，請安裝 [GitHub-Desktop](https://desktop.github.com/download/)
     - GitHub Desktop 如果您不習慣使用命令列，可能會比較容易上手，但它不一定適合每個人
     - 要開始使用 GitHub Desktop，請造訪[開始使用 GitHub Desktop](https://docs.github.com/en/desktop/overview/getting-started-with-github-desktop)

如果您想要貢獻程式碼，請前往 [rust-lang.org](https://www.rust-lang.org/) 安裝 Rust。
如果您想要貢獻文件，請安裝 [NodeJS](https://nodejs.org/en)

## 反編譯 Minecraft 的程式碼

在開發 Pumpkin 時，我們非常依賴官方 Minecraft 用戶端並利用現有的伺服器邏輯。我們經常參考 Minecraft 的官方程式碼。

反編譯 Minecraft 最簡單的方式是使用 Fabric Yarn：

```shell
git clone https://github.com/FabricMC/yarn.git
cd yarn
./gradlew decompileVineflower
```

反編譯後，您可以在 `build/namedSrc` 中找到原始碼。

## 補充說明

我們鼓勵您在現有的問題與 Pull Request 上留言，分享您的想法並提供回饋。
歡迎在問題追蹤系統上提問，或在需要協助時聯繫專案維護者。
在提交大型貢獻之前，請考慮先開啟一個問題或討論，或在我們的 Discord 上與我們討論您的方向。