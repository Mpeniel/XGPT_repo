# XGPT
**XGPT** est une extension pour Visual Studio Code qui utilise GPT-3 pour simplifier la programmation. Elle peut expliquer du code dans n'importe quel langage de programmation, coder à partir d'un texte et répondre aux questions des développeurs.

>**Pour accéder aux différentes commandes de l'extension, vous pouvez utiliser la palette de commandes en appuyant sur 'ctrl+shift+p' (ou 'cmd+shift+p' pour les utilisateurs Mac) dans Visual Studio Code.**

### EXEMPLE D'UTILISATION
**#### Vous n'avez pas besoin d'une api key. Mais nous vous conseillons de créer votre propre api key sur le site d'openai ####**
<video>
  <source src="https://vimeo.com/802312159" type="video/mp4">
</video>

## Fonctionnalités
* Après l'installation, pour lancer XGPT faites un clic droit sur l'espace de travail de Visual Studio Code, puis sélectionnez l'option **XGPT START**
> Deux fenêtres s'ouvriront:
> - GPT Result : où s'afficheront le resultats des commandes **XGPT QUESTION** et **XGPT EXPLAIN**
> - un éditeur de code : où vous demanderez à XGPT de coder à partir d'un texte
* Explication de code **XGPT EXPLAIN**: expliquez un code dans n'importe quel langage de programmation en un seul clic.
>**Sélectionnez** un code, puis faites un **clic droit** et choisissez l'option **XGPT EXPLAIN**
* Codage à partir d'un texte **XGPT CODE**: créez du code à partir d'un texte, peu importe la longueur.
>utiliser '//' pour indiquer à XGPT où commence le texte. Vous devez tout écrire sur la même ligne et laisser le curseur à la fin de la phrase

Puis, soit vous faites un clic droit pour choisir XGPT CODE, soit vous faites : **ctrl+shift+/**
* Questions et réponses **XGPT QUESTION**: posez des questions obtenez une réponse rapide et précise.
> Faites un clic droit et choisissez **XGPT QUESTION**, dans le  popup qui s'affiche entrez votre question
> Les résultats s'aficheront dans la fenêtre GBT result

### Configuration requise
> **#### Aucune ! vous n'avez pas besoin d'une api key. Mais on vous conseille de créer votre propre api key sur le site d'openai ####**
> Vous pouvez obtenir une clé API gratuitement en vous inscrivant sur le site de OpenAI. https://platform.openai.com/account/api-keys


## Utilisation
1. Installez l'extension depuis le marketplace de Visual Studio Code.
2. Vous pouvez ajouter votre clé API à la configuration de l'extension avec **XGPT API KEY**.
3. Configurer la langue avec **XGPT SET LANGUAGE**
4. Lancer XGPT avec la commande **XGPT START**
4. Utilisez les fonctionnalités de l'extension pour simplifier votre travail de programmation.
> **Pour accéder aux différentes commandes de l'extension, vous pouvez utiliser la palette de commandes en appuyant sur 'ctrl+shift+p' (ou 'cmd+shift+p' pour les utilisateurs Mac) dans Visual Studio Code.**

### Contribution
> Si vous avez des idées d'amélioration ou des bugs à signaler, n'hésitez pas à soumettre une demande de pull sur le repo GitHub de l'extension https://github.com/Mpeniel/XGPT/issues.

## Licence
Cette extension est sous licence MIT. Veuillez consulter le fichier **LICENSE** pour plus d'informations.