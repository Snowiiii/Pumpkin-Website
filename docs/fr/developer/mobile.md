# Développement sur Mobile

Si vous êtes un utilisateur mobile et voulez modifier le code source, vous pouvez le faire !
(Cette page a été écrite sur Android en utilisant [Helix](https://helix-editor.com/))

Premièrement, nous avons besoin d'une application de console.
Nous recommandons [Termux](https://github.com/termux/termux-app/releases) parce qu'il est stable et open source.
Téléchargez le fichier apk nécessaire pour l’architecture de votre appareil et installez Termux.

Après ça, vous devrez executer certaines commandes. Nous utilisons Helix pour sa simplicité.

```bash
  pkg update && pkg upgrade
  pkg install build-essential git rust rust-analyzer taplo helix helix-grammar nodejs
```

Si vous voulez contribuer, vous aurez besoin d'installer le [logiciel GitHub CLI](https://cli.github.com/).

```bash
  pkg install gh
```

Nous recommandons d'installer [Fish Shell](https://fishshell.com/) parce qu'il est plus simple d'utilisation que [Bash](https://www.gnu.org/software/bash/).

```bash
  pkg install fish
  chsh -s fish
```

Maintenant que l'on a installé les outils de base, nous avons besoin de faire un peut de configuration.
Si vous voulez contribuer, vous aurez besoin de vous connecter avec GitHub.

```bash
  gh auth login
```

Après ça, vous aurez besoin de télécharger le dépot Pumpkin. (Avant, vous pouvez créer un dossier projet avec `mkdir proj`; c'est utile)

```bash
  git clone https://github.com/Pumpkin-MC/Pumpkin.git
```
> [!NOTE]
> Vous pouvez ajouter `--depth=1` à la fin de la commande pour économiser de la place, cependant vous perdrez l'historique.

Si vous voulez contribuer, vous aurez de dupliquer notre depot et changer `Pumpkin-MC` par votre nom d'utilisateur GitHub.

## FAQ

### Comment utiliser l'éditeur de texte ?

Écrivez `hx <path>`.

### Comment naviguer dans le projet ?

Vous pouvez utiliser `ls`, `cd` et d'autres programmes.
Vous pouvez utiliser `hx <dir>` pour changer de dossier au démarrage.

### Comment je peux écrire dans l'éditeur ?

Pressez `i` si vous êtes en mode normal

### COMMENT QUITTER L'ÉDITEUR ????

Pressez echap, puis écrivez `:q!` si vous ne voulez pas sauvegarder ou `:wq` si vous voulez sauvegarder.

### Où est-ce que je peux apprendre à utiliser cet éditeur?

Utilisez `hx --tutor` ou rendez vous sur leur site officiel.

### Pourquoi ne pas utiliser VS Code?

1) VS Code est difficile à mettre en place et ses fonctionalités sont limités sur le web.
2) rust-analyzer ne fonctionne pas dessus. Peut-être qu'un émulateur pourrait aider, mais ça ralentirait la compilation du code.
3) Avec VS Code, c'est hautement recommandé d'utiliser une souris, alors qu'avec Helix, vous avez uniquement besoin d'un clavier.
4) VS Code n'est pas performant sur certain appreils.

### Pourquoi c'est si dure d'écrire?

Achetez un clavié Bluetooth bas de gamme et voyez comme ça devient plus simple.
