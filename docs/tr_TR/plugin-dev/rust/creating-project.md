<!-- TODO(i18n): outdated, plugin crates come from crates.io now, not git. -->

﻿# Yeni bir proje oluşturma

Pumpkin eklentileri, [Cargo](https://doc.rust-lang.org/book/ch01-03-hello-cargo.html) derleme sistemini kullanır.

Bu eklenti için tam kod, [GitHub'da bir şablon](https://github.com/vyPal/Hello-Pumpkin) olarak bulunabilir.

## Yeni bir crate başlatma

Önce yeni bir proje klasörü oluşturmamız gerekiyor. Bunu, oluşturduğunuz klasörde şu komutu çalıştırarak yapabilirsiniz:

```bash
cargo new <project-name> --lib
```

Bu, içinde birkaç dosya bulunan bir klasör oluşturur. Klasör yapısı şöyle görünmelidir:

```bash
â”œâ”€â”€ Cargo.toml
â””â”€â”€ src
    â””â”€â”€ lib.rs
```

## Crate'i yapılandırma

Pumpkin eklentileri çalışma zamanında dinamik kütüphaneler olarak yüklendiği için, Cargo'ya bu crate'i bu şekilde derlemesini söylememiz gerekir.
:::code-group

```toml [Cargo.toml]
[package]
name = "hello-pumpkin"
version = "0.1.0"
edition = "2024"

[lib] // [!code ++:3]
crate-type = ["cdylib"]

[dependencies]
```

:::

Sonra bazı temel bağımlılıklar eklememiz gerekiyor. Pumpkin hâlâ erken geliştirme aşamasında olduğu için iç crate'ler crates.io'da yayımlanmıyor; bu yüzden Cargo'ya bağımlılıkları doğrudan GitHub'dan indirmesini söylemeliyiz.
:::code-group

```toml [Cargo.toml]
[package]
name = "hello-pumpkin"
version = "0.1.0"
edition = "2024"

[lib]
crate-type = ["cdylib"]

[dependencies]
// [!code ++:13]
# This is the base crate with most high-level type definitions
pumpkin = { git = "https://github.com/Pumpkin-MC/Pumpkin.git", branch = "master", package = "pumpkin" } 
# Other utilities used by Pumpkin (e.g. TextComponent, Vectors...)
pumpkin-util = { git = "https://github.com/Pumpkin-MC/Pumpkin.git", branch = "master", package = "pumpkin-util" }
# Macros for easier plugin development
pumpkin-api-macros = { git = "https://github.com/Pumpkin-MC/Pumpkin.git", branch = "master", package = "pumpkin-api-macros" }

# A rust asynchronous runtime
tokio = "1.48"
# Logging
log = "0.4"
```

:::

Daha iyi performance ve daha küçük dosya boyutları için Link-Time Optimization (LTO) etkinleştirmenizi öneririz.  
Bunun derleme süresini artıracağını unutmayın.
:::code-group

```toml [Cargo.toml]
[profile.release] // [!code ++:2]
lto = true
```

:::
<small>LTO'yu yalnızca release derlemeleri için etkinleştirir.</small>
