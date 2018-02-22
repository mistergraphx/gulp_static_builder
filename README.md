# Création de sites static

## Structure des contenus

Pour les objets pages et posts,  on parcours l'arbo et les sous dossiers,
les pages index décrivent la categorie/dossier.

La structure de l'applicatif est construite sur l'arborescence du système de fichier du dossier /pages ou /posts


# Structure des répertoires

- build : dossier qui est créé et contient les fichiers compilés.
- src : le dossier source
	- assets
		- scss
		- css
		- fonts
		- js
	- datas
	- images
	- pages
	- post : non inplémenté
	- templates

## Héritage et surcharges

## DATA externes et Frontmatter

Le fichier markdown est composé d'un entête (frontmatter)
de type yaml et de son contenu au format markdown.

```yaml

title:
order:
layout:

```

### Chargement des datas :

- un fichier app.json permet de partager des variable concernant l'aplication/site
- des fichiers de data supplémentaires peuvent être crées par fichier markdown
(ils doivent porter le même nom et être au format json)

**config.js** : fichier de configuration globale de l'appli :
dossiers de travail, config par default de modules/task

**template** : le template doit pouvoir apporter sa configuration,
ses assets(scss, fonts, images) et ses variables par default,
qui seront ensuite surchargées si besoin au cas par cas depuis le projet

## Todo

Config
- mise en place des settings par defaut avec surcharge par app.js

Template Engine:

- précedence des templates situés dans le dossier /templates de l'app,
puis dans les autres path fournis dans la config

- 	inclusion au html généré des ressources svg
	https://www.npmjs.com/package/gulp-inject-svg

Bundle :
@todo - ajouter la copy des images relatives au contents

Default/Generate :
@todo - [X] rendre dans le markdown les data du frontmater, et extra

Fonctionalitées
- 	Ajouter un moteur de recherche sur les contenus statiques
	Tipue : jqueryPlugin permettant la recherche sur un json
	http://www.tipue.com/search/docs/?d=6

- 	Envoi/synchro des fichiers (FTP/SSH)
	https://blueprintinteractive.com/blog/how-sync-local-and-server-development-gulp

- Medias

	- Optimisation des images : https://scaley.io/
		2,000 image transformations per month
		service d'optimisation des visuel
			- gestion des effets noir/blanc, …
			- cdn gestion cache


## Outils similaires

Publii propose une application multiplateforme de création de blog statiques :
https://getpublii.com/docs/
