# 快速入門

**目前狀態：**
預發布版本：目前開發中，尚未準備好進行正式發布。

## 下載預發布版本二進位檔

您可以在[預發布版本下載頁面](https://pumpkinmc.org/download)下載預先編譯的二進位檔。

## 從原始碼建置 (Rust)

若要編譯 Pumpkin，請確保您已安裝 [Rust](https://www.rust-lang.org/tools/install)。

複製儲存庫並進入該目錄：

```shell
git clone --recurse-submodules https://github.com/Pumpkin-MC/Pumpkin.git
cd Pumpkin
```

**選用：** 如果您願意，可以將原版世界放入 `Pumpkin/` 目錄中。只需將世界資料夾命名為 `world` 即可。

執行：

> [!NOTE]
> 由於發布版本建置會進行重度最佳化，建置過程可能會花費一些時間。

```shell
cargo run --release
```

**選用：** 若要利用您 CPU 的特定功能來極大化效能，您可以設定 `target-cpu=native` Rust 編譯器旗標：

```shell
RUSTFLAGS='-C target-cpu=native' cargo run --release
```

> [!NOTE]
> 若要使用（遊玩）您在同一個本機系統上自行架設的伺服器（例如在 Linux 上使用 Prism Launcher 登入並執行/遊玩 Minecraft，同時使用 Pumpkin 架設伺服器），您可能需要透過「多人遊戲」->「新增伺服器」->「伺服器位址」的路徑，使用 `localhost:25565` 作為伺服器位址，儘管該位址並未列在終端機的伺服器執行輸出中。

`localhost:25565`

## Docker

> [!IMPORTANT]
> Docker 支援目前仍屬實驗性質。

如果您尚未安裝，您需要先[安裝 Docker](https://docs.docker.com/engine/install/)。安裝 Docker 後，您可以執行以下指令來啟動伺服器：

```shell
docker run --rm \
    -p <exposed_port>:25565  \
    -v <server_data_location>:/pumpkin \
    -it ghcr.io/pumpkin-mc/pumpkin:master
```

- `<exposed_port>`：您要用來連線至 Pumpkin 的連接埠，例如 `25565`。
- `<server_data_location>`：您希望儲存伺服器設定檔與資料的位置，例如 `./data`。

### 範例

若要在連接埠 `25565` 上執行 Pumpkin 並將資料儲存在名為 `./data` 的目錄中，您可以執行以下指令：

```shell
docker run --rm \
    -p 25565:25565 \
    -v ./data:/pumpkin \
    -it ghcr.io/pumpkin-mc/pumpkin:master
```

## Nix / NixOS

Pumpkin 可於 [nixpkgs](https://github.com/NixOS/nixpkgs) 中取得（由 [@DerGrumpf](https://github.com/DerGrumpf) 維護），套件名稱為 `pumpkin-mc`，並附帶 `services.pumpkin-mc` NixOS 模組，可將其作為 systemd 服務執行。

### 免安裝試用

```shell
nix run nixpkgs#pumpkin-mc
```

### NixOS 模組

將以下內容新增至您的 `configuration.nix`：

```nix
services.pumpkin-mc = {
  enable = true;
  openFirewall = true;
};
```

這會以強化安全性的 systemd 服務（`DynamicUser`、`ProtectSystem = "strict"`、無額外 capabilities）在 `/var/lib/pumpkin-mc` 下執行 Pumpkin。該模組為大部分 `pumpkin.toml` 提供了型別化選項。包含 Java/Bedrock/RCON/query/proxy 網路、白名單、世界儲存、紀錄、PvP 等功能，以及一個 `settings` 自由格式選項，用於涵蓋任何尚未支援的項目。

> [!NOTE]
> RCON 密碼和 Velocity 轉送密鑰是在服務啟動時從檔案讀取（透過 `rcon.passwordFile` / `proxy.velocity.secretFile`），而不是儲存在 Nix store 中，因此它們可與 `sops-nix` 或 `agenix` 等密鑰管理工具搭配使用。

請參閱[模組原始碼](https://github.com/NixOS/nixpkgs/blob/master/nixos/modules/services/games/pumpkin-mc.nix)以取得完整選項清單，或執行：

```shell
nixos-option services.pumpkin-mc
```

## 測試伺服器

Pumpkin 有一個由 @kralverde 維護的測試伺服器。它執行在 Pumpkin master 分支的最新提交 (commit) 上。

- **IP：** `pumpkin.kralverde.dev`

**規格：**
- **作業系統：** Debian GNU/Linux bookworm 12.7 x86_64
- **核心：** Linux 6.1.0-21-cloud-amd64
- **CPU：** Intel Core (Haswell, no TSX) (2) @ 2.40 GHz
- **記憶體：** 4GB DIMM