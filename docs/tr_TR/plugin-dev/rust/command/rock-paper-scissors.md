<!-- TODO(i18n): outdated, en uses pumpkin-plugin-api, not #[plugin_method]. -->

# Komut İşleyicisi Yazma

Minecraft'ta komutlar, hem normal oyuncuların hem de sunucu operatörlerinin oyunun daha düşük seviyeli yönleriyle etkileşim kurmasının birincil yoludur. Basit sohbet mesajlarından karmaşık sunucu yönetim komutlarına kadar geniş bir görev yelpazesinde kullanılabilirler. Bu eğitimde, oyuncuların sunucuya karşı oynayabileceği temel bir Taş-Kağıt-Makas komut işleyicisi oluşturacağız.

Pumpkin, komutları ele almak için her komutun bir 'ağaç' yapısına sahip olmasına dayanan kendi sistemine sahiptir; bu ağaç, komutun ve argümanlarının tam yapısını tanımlar. Ağaçtaki her düğüm bir komutu veya argümanı temsil eder ve ağaç, çalıştırılacak komutu ve parametrelerini belirlemek için dolaşılır.

Pumpkin'deki komutlar eşzamansızdır; yani yürütülürken ana iş parçacığını engellemezler. Bu, kaynakların daha verimli kullanılmasına ve daha pürüzsüz bir kullanıcı deneyimine olanak tanır.

Bu eğitimin dayandığı orijinal [Taş-Kağıt-Makas eklentisini](https://github.com/ploxxxy/rock-paper-scissors-mc) yazdığı için [ploxxxy](https://github.com/ploxxxy)'ye de teşekkür ederiz.

## Temelleri ekleme

Pumpkin'deki her komut, `CommandExecutor` trait'ini uygulayan bir yapı olarak tanımlanır. Bu trait, gönderici, sunucu ve tüketilen argümanları parameter olarak alan ve `-> Result<(), CommandError>` döndüren bir `execute` metodunun uygulanmasını gerektirir. Şimdi bu yapıyı tanımlayalım:

```rust
use pumpkin::{
    command::{ // [!code ++:4]
        args::ConsumedArgs, dispatcher::CommandError, tree::builder::literal, tree::CommandTree,
        CommandExecutor, CommandSender,
    },
    plugin::{player::player_join::PlayerJoinEvent, Context, EventHandler, EventPriority},
    server::Server,
};

struct RockPaperScissorsExecutor; // [!code ++]

impl CommandExecutor for RockPaperScissorsExecutor {
    fn execute<'a>(
        &self,
        sender: &mut CommandSender,
        _: &Server,
        _: &ConsumedArgs<'a>,
    ) -> Result<(), CommandError> {
        Box::pin(async {
            Ok(())
        })
    }
}
```

Bu kod, `CommandExecutor` trait'ini uygulayan boş bir `RockPaperScissorsExecutor` yapısını tanımlar. `execute` metodu çağrıldığında `Ok(())` döndürecek şekilde tanımlanmıştır.

## Yardımcı enum'ları ekleme

İşimizi kolaylaştırmak için, oyunun olası seçimlerini ve sonuçlarını temsil eden birkaç enum ve rastgele seçim üretip sonucu kontrol eden birkaç fonksiyon tanımlayacağız. Bunları eklenti kodunuza ekleyin.

```rust
use rand::{rng, Rng};

#[derive(PartialEq, Debug, Clone, Copy)]
enum Choice {
    Rock,
    Paper,
    Scissors,
}

enum Outcome {
    Win,
    Lose,
    Draw,
}

impl Choice {
    pub fn beats(&self, other: &Choice) -> Outcome {
        if self == other {
            return Outcome::Draw;
        }

        match (self, other) {
            (Choice::Rock, Choice::Scissors) => Outcome::Win,
            (Choice::Paper, Choice::Rock) => Outcome::Win,
            (Choice::Scissors, Choice::Paper) => Outcome::Win,
            _ => Outcome::Lose,
        }
    }
}

fn get_random_choice() -> Choice {
    let choices = [Choice::Rock, Choice::Paper, Choice::Scissors];
    let index = rng().random_range(0..3);
    choices[index]
}
```

Şimdi `RockPaperScissorsExecutor` yapısını bir `Choice` parametresi kabul edecek şekilde değiştirmeli ve oyun mantığını uygulamalıyız.

```rust
struct RockPaperScissorsExecutor(Choice); // [!code ++]
struct RockPaperScissorsExecutor; // [!code --]

impl CommandExecutor for RockPaperScissorsExecutor {
    fn execute<'a>(
        &self,
        sender: &mut CommandSender,
        _: &Server,
        _: &ConsumedArgs<'a>,
    ) -> Result<(), CommandError> {
        Box::pin(async move { // [!code ++:3]
            let player_choice = self.0; 
            let computer_choice = get_random_choice();
            Ok(())
        })
    }
}
```

Bu kod, daha sonra oyuncunun seçimini geçmemize ve oyun mantığında kullanmamıza, ayrıca bilgisayarın seçimiyle karşılaştırıp oyunun sonucunu belirlememize olanak tanır.

## Oyun Mantığını Uygulama

Artık oyun mantığını uygulamaya ve sonucu oyunculara göstermeye geçebiliriz.

Önce oyuncuya kendi seçimini ve bilgisayarın seçimini göstereceğiz. Bu kodu eklentinize ekleyin:

```rust
impl CommandExecutor for RockPaperScissorsExecutor {
    fn execute<'a>(
        &self,
        sender: &mut CommandSender,
        _: &Server,
        _: &ConsumedArgs<'a>,
    ) -> Result<(), CommandError> {
        Box::pin(async move {
            let player_choice = self.0;
            let computer_choice = get_random_choice();
            
            sender // [!code ++:15]
                .send_message(
                    TextComponent::text("Du wÃ¤hlst: ")
                        .add_text(format!("{:?}", player_choice))
                        .color_named(NamedColor::Aqua),
                )
                .await;

            sender
                .send_message(
                    TextComponent::text("Ich wÃ¤hle: ")
                        .add_text(format!("{:?}", computer_choice))
                        .color_named(NamedColor::Gold),
                )
                .await;
            
            Ok(())
        })
    }
}
```

Ardından oyun sonucunu hesaplayıp oyuncuya gösterebiliriz. Bu kodu eklentinize ekleyin:

```rust
impl CommandExecutor for RockPaperScissorsExecutor {
    fn execute<'a>(
        &self,
        sender: &mut CommandSender,
        _: &Server,
        _: &ConsumedArgs<'a>,
    ) -> Result<(), CommandError> {
        Box::pin(async move {
            // Existierender Code
            

            match player_choice.beats(&computer_choice) { // [!code ++:19]
                Outcome::Win => {
                    sender
                        .send_message(TextComponent::text("Du gewinnst!").color_named(NamedColor::Green))
                        .await;
                }
                Outcome::Lose => {
                    sender
                        .send_message(TextComponent::text("Du verlierst!").color_named(NamedColor::Red))
                        .await;
                }
                Outcome::Draw => {
                    sender
                        .send_message(
                            TextComponent::text("Unentschieden!").color_named(NamedColor::Yellow),
                        )
                        .await;
                }
            }
            
            Ok(())
        })
    }
}
```

İşte bu kadar! Temel mantık tamamlandı. Şimdi yapmamız gereken son bir şey kaldı.

## Komut ağacını oluşturma ve kaydetme

Daha önce belirtildiği gibi bir komut ağacı oluşturmamız ve bunu sunucuya kaydetmemiz gerekiyor. Bu, oyuncuların eklentimizin komutlarını çalıştırmasını sağlar.

Bir komut ağacı oluşturmak çok zor değildir, ancak komutun ve argümanlarının tam yapısını bilmeniz gerekir. Bu durumda `rock-paper-scissors` adlı bir komutumuz var; bu komut bir adet zorunlu argüman alır (oyuncunun seçimi).

Komut ağacı `CommandTree::new()` fonksiyonu ile başlatılır. Bu fonksiyon iki argüman alır: ilk elemanı ana komut adı olan isim listesi ve diğerleri komutun takma adlarıdır; ayrıca yardım menüsünde kullanılan bir komut açıklaması. Ardından `.then()` yöntemiyle ağaca 'dal' ekleyebiliriz. Bu yöntem, `literal()`, `argument()` veya `require()` fonksiyonlarıyla oluşturulabilen bir 'leaf' kabul eder.

Taş-kağıt-makas komutu için, oyuncunun seçimi için her biri bir `literal()` yaprak düğümü olan 3 ayrı dal oluşturacağız. Komut ağacını sunucuya kaydedeceğiz ve `PermissionLvl` değerini `Zero` olarak ayarlayacağız; bu, herkesin komutu çalıştırmasına izin verir. Aşağıdaki kodu `on_load()` yöntemine ekleyin:

```rust
use pumpkin_util::PermissionLvl; // [!code ++]

const NAMES: [&str; 2] = ["rps", "rockpaperscissors"]; // [!code ++:2]
const DESCRIPTION: &str = "Play Rock Paper Scissors with the server.";

#[plugin_method]
async fn on_load(&self, server: Arc<Context>) -> Result<(), String> {
    server.init_log();

    log::info!("Hello, Pumpkin!");

    server.register_event(Arc::new(MyJoinHandler), EventPriority::Lowest, true).await;
    
    let command = CommandTree::new(NAMES, DESCRIPTION) // [!code ++:6]
        .then(literal("rock").execute(RockPaperScissorsExecutor(Choice::Rock)))
        .then(literal("paper").execute(RockPaperScissorsExecutor(Choice::Paper)))
        .then(literal("scissors").execute(RockPaperScissorsExecutor(Choice::Scissors)));

    server.register_command(command, PermissionLvl::Zero).await;

    Ok(())
}
```

Hepsi bu kadar! Eklentiyi derlediğinizde aşağıdaki komutu çalıştırarak test edebilirsiniz:

```bash
/rps rock
```
