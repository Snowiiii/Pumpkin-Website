# Problèmes communs

1. ## Impossible de vérifier le nom d'utilisateur

    **Problème:** Certains joueurs ont reporté un problème de connexion au serveur, incluant la rencontre d'une erreur "Échec lors de la vérification du nom d'utilisateur".

    **Cause:** Cela est généralement causé par l'authentification, et souvent à cause du paramètre `prevent_proxy_connections`.

    **Solution:** Désactiver `prevent_proxy_connections` sous `[networking.java.authentication]` dans `pumpkin.toml`
