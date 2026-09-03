# 快速入門

本指南將協助您開始使用 C# 編寫 Pumpkin 伺服器外掛。

## 先決條件

在開始之前，請確保您已安裝以下工具：

- [.NET 10.0](https://dotnet.microsoft.com/download/dotnet/10.0) 或更新版本。
- [WebAssembly 工作負載](https://learn.microsoft.com/en-us/dotnet/core/deploying/native-aot/webassembly-overview)：您可能需要安裝 WASI 工作負載：

```shell
dotnet workload install wasi-experimental
```

## 設定專案

首先，建立一個新的類別庫專案：

```shell
dotnet new classlib -n MyPumpkinPlugin
cd MyPumpkinPlugin
```

在您的專案根目錄中建立一個 `NuGet.Config` 檔案，以包含實驗性 .NET 套件來源：

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <packageSources>
    <add key="dotnet-experimental" value="https://pkgs.dev.azure.com/dnceng/public/_packaging/dotnet-experimental/nuget/v3/index.json" />
  </packageSources>
</configuration>
```

新增 Pumpkin API 與 WebAssembly SDK：

```shell
dotnet add package PumpkinMC.PumpkinApi
dotnet add package ByteCodeAlliance.Componentize.DotNet.Wasm.SDK --prerelease
```

編輯您的 `.csproj` 檔案，將目標設為 `wasi-wasm` 並使用 .NET 10.0：

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
    <RuntimeIdentifier>wasi-wasm</RuntimeIdentifier>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="ByteCodeAlliance.Componentize.DotNet.Wasm.SDK" Version="*-*" />
    <PackageReference Include="PumpkinMC.PumpkinApi" Version="*" />
  </ItemGroup>
</Project>
```

## 建立您的第一個外掛

將 `Class1.cs` 的內容替換為以下程式碼（或建立一個新檔案 `MyPlugin.cs`）：

```csharp
using PluginWorld;
using PluginWorld.wit.Exports.pumpkin.plugin.v0_1_0;
using PluginWorld.wit.Imports.pumpkin.plugin.v0_1_0;

namespace MyPumpkinPlugin;

public class MyPlugin : IPluginWorldExports, IMetadataExports
{
    public static void InitPlugin() { }

    public static void OnLoad(IContextImports.Context context)
    {
        ILoggingImports.Log(ILoggingImports.Level.Info, "C# plugin loaded!");
    }

    public static void OnUnload(IContextImports.Context context) { }

    public static IEventImports.Event HandleEvent(uint eventId, IServerImports.Server server, IEventImports.Event @event)
    {
        return @event;
    }

    public static int HandleCommand(uint commandId, ICommandImports.CommandSender sender, IServerImports.Server server, ICommandImports.ConsumedArgs args)
    {
        return 0;
    }

    public static void HandleTask(uint handlerId, IServerImports.Server server) { }

    public static IMetadataExports.PluginMetadata Metadata()
    {
        return new IMetadataExports.PluginMetadata(
            "my-csharp-plugin",
            "0.1.0",
            "An example C# plugin.",
            ["YourName"],
            []
        );
    }
}
```

## 建置外掛

若要將您的外掛建置為 WebAssembly 元件：

```shell
dotnet build -c Release
```

編譯後的 `.wasm` 檔案將位於 `bin/Release/net10.0/wasi-wasm/publish/`。您可以將此檔案放入 Pumpkin 伺服器的 `plugins` 資料夾中。