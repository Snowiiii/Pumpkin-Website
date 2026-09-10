<!-- TODO(i18n): outdated, plugin crates come from crates.io now, not git. -->

# Criando um Novo Projeto

Plugins Pumpkin utilizam o sistema de build [Cargo](https://doc.rust-lang.org/book/ch01-03-hello-cargo.html).

O código completo para este plugin pode ser encontrado como um [modelo no GitHub](https://github.com/vyPal/Hello-Pumpkin).

## Inicializando um novo crate

Primeiro, precisamos criar uma nova pasta para o projeto. Você pode fazer isso executando o seguinte comando na pasta que você criou:

```bash
cargo new <nome-do-projeto> --lib
```

Isso criará uma pasta com alguns arquivos dentro. A estrutura da pasta deverá ser parecida com esta:

```
├── Cargo.toml
└── src
    └── lib.rs
```

## Configurando o crate

Como os plugins Pumpkin são carregados em tempo de execução como bibliotecas dinâmicas, precisamos dizer ao Cargo para construir esse crate dessa forma.
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

Em seguida, precisamos adicionar algumas dependências básicas. Como o Pumpkin ainda está em desenvolvimento inicial, os crates internos não estão publicados no crates.io, então precisamos dizer ao Cargo para baixar as dependências diretamente do GitHub.
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
# Este é um crate base com a maioria das definições de tipos de alto nível
pumpkin = { git = "https://github.com/Pumpkin-MC/Pumpkin.git", branch = "master", package = "pumpkin" }
# Outras utilidades usadas pelo Pumpkin (por exemplo, TextComponent, Vectors...)
pumpkin-util = { git = "https://github.com/Pumpkin-MC/Pumpkin.git", branch = "master", package = "pumpkin-util" }
# Macros para facilitar o desenvolvimento de plugins
pumpkin-api-macros = { git = "https://github.com/Pumpkin-MC/Pumpkin.git", branch = "master", package = "pumpkin-api-macros" }

# Um runtime assíncrono em Rust
tokio = "1.48"
# Logging
log = "0.4"
```

:::

Para melhorar o desempenho e reduzir o tamanho dos arquivos, recomendamos habilitar a Otimização em Tempo de Link (LTO).  
Esteja ciente de que isso aumentará o tempo de compilação.
:::code-group

```toml [Cargo.toml]
[profile.release] // [!code ++:2]
lto = true
```

:::
<small>Habilita LTO apenas para builds release.</small>
