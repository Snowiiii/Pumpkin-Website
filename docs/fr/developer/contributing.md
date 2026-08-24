# Contribuer à Pumpkin

Nous apprécions votre intéret dans le développement de Pumpkin ! Ce document survole les directives pour soumettre des rapports d'erreur, des propositions de fonctionnalités ainsi que des changement dans le code.

## Commencer

Le meilleur moyen de commencer est de demander de l'aide dans [notre serveur Discord](https://discord.gg/wT8XjrjKkf).

## Comment Contribuer

Il y a plusieurs façons de contribuer à Pumpkin:

### Signaler des bugs

Si vous rencontrez un bug, merci de chercher dans les [tickets existants](https://github.com/Pumpkin-MC/Pumpkin/issues) sur le [GitHub officiel](https://github.com/Pumpkin-MC/Pumpkin).

Si vous ne trouvez pas de duplicatats, ouvrez un nouveau ticket.

Suivez l'exemple et donnez une description claire du bug, incluant les étapes pour le reproduire, si possible.
Des captures d'écrans, journaux ou ébauches de code serront utiles.

### Suggérer des fonctionnalités

Avez-vous une idée pour améliorer Pumpkin ? Partagez votre avis en ouvrant un ticket sur [GitHub](https://github.com/Pumpkin-MC/Pumpkin/issues).

Décrivez la fonctionnalité proposé en détail, incluant ses bénéfices et des moyen potentiels d'implémentation.

### Contribuer au code

Pour commencer à contribuer au code de Pumpkin, forkez le dépôt sur GitHub.

1. Premièrement, créez un compte GitHub si vous n'en avez pas déjà un.

2. Rendez vous sur  l'[Organisation GitHub](https://github.com/Pumpkin-MC) et appuyez sur Fork.

> Creer un fork veut dire que vous avez maintenant votre propre copie du code source de Pumpkin (cela ne veux pas dire que vous possédez le copyright).

Maintenant que vous avez une copie du code, vous aurez besoin de quelques outils.
3. Installez [git](https://git-scm.com/downloads) pour votre OS (Windows, Linux, MacOS).

- Pour commencer avec Git, visitez [Commencer avec Git](https://docs.github.com/fr/get-started/git-basics)

- Optionnel: Si vous voulez un outils graphique pour interagir avec GitHub, installez [GitHub-Desktop](https://desktop.github.com/download/)

> GitHub Desktop pourrait être plus simple si vous n'êtes pas habitués à la ligne de commande, mais ce n'est pas pour tout le monde.

- Pour commencer avec Git, visitez [Commencer avec GitHub Desktop](https://docs.github.com/fr/desktop/overview/getting-started-with-github-desktop)

- Si vous voulez contribuer au code, intallez Rust à [rust-lang.org](https://www.rust-lang.org/).

- Si vous voulez contribuer à la documentation, installez [NodeJS](https://nodejs.org/en)

### Décompiller le code de Minecraft

Lorsque nous travaillons chez Pumpkin, nous comptons beaucoup sur le client officiel de Minecraft et utilisons la logique de serveur existante. Nous nous référrons souvent sur le code Minecraft officiel.
Le moyen le plus simple de décompiler Minecraft est en utilisant Fabric Yarn:

```shell
git clone https://github.com/FabricMC/yarn.git
cd yarn
./gradlew decompileVineflower
```

Après avoir décompiler, vous trouverez le code source à `build/namedSrc`.

### Informations additionels

Nous vous encouragons à commenter sur les tickets et pull requests existantes pour partager vos pensées et donner un avis.

Sentez vous libre de poser des questions sur le traqueur de ticket ou contacter les mainteneurs du projet si vous avez besoin d'aide.

Avant de soumettre une contribution importante, pensez à ouvrir un problème ou une discussion, ou parlez avec nous sur notre Discord pour discuter de votre approche.
