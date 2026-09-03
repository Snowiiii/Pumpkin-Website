# 在行動裝置上開發 Pumpkin

如果您是行動裝置使用者並且想要編輯原始碼，這是辦得到的！
（本頁面是在 Android 上使用 Helix 編寫的。）

首先，我們需要一個終端機應用程式。
我們推薦 [Termux](https://github.com/termux/termux-app/releases)，因為它穩定且為開源軟體。
下載適用於您裝置架構的 apk 檔案並安裝 Termux。

之後，您需要執行一些指令。我們使用 Helix 是因為它的簡潔性。

```shell
  pkg update && pkg upgrade
  pkg install build-essential git rust rust-analyzer taplo helix helix-grammar nodejs
```

如果您想要貢獻程式碼，您需要安裝 GitHub CLI 工具。

```shell
  pkg install gh
```

我們也推薦安裝 fish shell，因為它比 bash 更友善。

```shell
  pkg install fish
  chsh -s fish
```

現在您已經安裝了基本工具，我們需要進行一些設定。

如果您想要貢獻程式碼，您需要登入 GitHub。

```shell
  gh auth login
```

同時設定 git：將編輯器更改為 vim、編輯您的認證資訊等。

之後，您需要複製 (clone) Pumpkin 儲存庫。（在此之前，您可以使用 `mkdir proj` 建立專案目錄；這會很有用）

```shell
  git clone https://github.com/Pumpkin-MC/Pumpkin.git
```

如果您想要貢獻程式碼，您需要 fork 我們的儲存庫，並將 `Pumpkin-MC` 更改為您在 GitHub 上的使用者名稱。

設定全部完成了！祝您愉快 :)

## 常見問題 (FAQ)

### 如何使用文字編輯器？
輸入 `hx <路徑>`。

### 如何在專案中導覽？
您可以使用 `ls`、`cd` 和其他程式。
您也可以在啟動時使用 `hx <目錄>` 來瀏覽您的目錄。

### 我要如何在編輯器中打字？
如果您處於一般模式 (normal mode)，請按 `i`。

### 到底要如何離開編輯器？？？？
按 esc，然後如果您不想儲存，請輸入 `:q!`；如果想儲存，請輸入 `:wq`。

### 我在哪裡可以學習如何使用這個編輯器？
執行 `hx --tutor` 或前往其官方網站。

### 為什麼不使用 VS Code？
VS Code 很難設定，而且在網頁版上的功能有限。
`rust-analyzer` 無法在上面運作。也許模擬器可以解決這個問題，但這會減慢程式碼編譯速度。
使用 VS Code 時，非常依賴滑鼠，而在 Helix 中您只需要鍵盤。
VS Code 在某些裝置上會卡頓。

### 為什麼打字這麼困難？
買一把便宜的藍牙鍵盤，看看會變得有多輕鬆。