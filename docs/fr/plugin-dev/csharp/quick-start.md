# Démarrage rapide

Ce guide va vous aider à commencer à écrire un plugin pour le serveur Pumpkin en utilisant [C#](https://fr.wikipedia.org/wiki/C_Sharp).

## Prérequis

Avant de commencer, vous devez vous assurer d'avoir d'installé:
- [.NET 10.0](https://dotnet.microsoft.com/fr-fr/download/dotnet/10.0) ou superieur.
- WebAssembly Workload: Vous devrez peut-être installer la charge de travail WASI:
  ```bash
  dotnet workload install wasi-experimental
  ```

## Creer votre projet

Tout d’abord, créez un projet de bibliothèque de classe:

```bash
dotnet new classlib -n MonPluginPumpkin
cd MonPluginPumpkin
```

Créez un ficher `NuGet.Config` dans la racine de votre projet pour inclure la version experimentale de .NET:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <packageSources>
    <add key="dotnet-experimental" value="https://pkgs.dev.azure.com/dnceng/public/_packaging/dotnet-experimental/nuget/v3/index.json" />
  </packageSources>
</configuration>
```

Ajoutez l'API Pumpkin et le SDK WebAssembly:

```bash
dotnet add package PumpkinMC.PumpkinApi
dotnet add package ByteCodeAlliance.Componentize.DotNet.Wasm.SDK --prerelease
```

Modifiez votre fichier `.csproj` pour pointer `wasi-wasm` et utiliser .NET 10.0:

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

## Créer votre premier plugin

Remplacez le contenu de `Class1.cs` (ou créez un nouveau fichier `MonPlugin.cs`) avec le code suivant:

```csharp
using PluginWorld;
using PluginWorld.wit.Exports.pumpkin.plugin.v0_1_0;
using PluginWorld.wit.Imports.pumpkin.plugin.v0_1_0;

namespace MonPluginPumpkin;

public class MonPlugin : IPluginWorldExports, IMetadataExports
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

## Compiler votre plugin

Pour compiler votre plugin en un composant WebAssembly:

```bash
dotnet build -c Release
```

Le fichier `.wasm` compilé se trouvera dans `bin/Release/net10.0/wasi-wasm/publish/`. Vous pouvez placer ce fichier dans le dossier `plugins` de votre serveur Pumpkin.
