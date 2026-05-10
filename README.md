# Ro.js

Le but est de proposer un outil visuel qui a pour but d'être open source et éducatif, proposant des cours sur des notions précises des mathématiques et de l'informatique.

## Collaboration
Toute collaboration est la bienvenue. Il est important pour ce projet d'avoir un maximum de regards sur les vérités dites. Les contributions peuvent être de plusieurs types.

### Contributions informatives \[tag="Information" ou "Critical Information Error"\]
Si vous détectez une erreur dans un des cours, quelle qu'elle soit : bug conditionnel, erreur mathématique, imprécision, suggestion en tout genre, il est possible de la signaler en créant une issue. Ou d'adresser un mail à l'un des contributeurs confirmés du projet.

### Contributions techniques
Si vous pensez pouvoir résoudre un problème, contribuer ponctuellement ou sur le long terme, créez une issue puis ensuite créez une PR qui sera la réponse à l'issue. Vous pouvez préciser la nature de la PR ou de l'issue : tag="Fix" pour une proposition de résolution de problème, ou tag="Feature" pour ajouter une feature. Veillez à bien décrire le problème ou la feature.

### Les Grandes Lignes Techniques
L'outil est codé en HTML, JS, CSS natif. Les animations sont directement faites sur canvas en utilisant les librairies `libs/` et `tools/`. Si une feature manque dans tools (comme un plan 3d pour les nombres complexes), n'hésitez pas à ouvrir une issue. Il est possible de créer des cours avec pour template obligatoire `ex_curse/`. Il est obligatoire d'implémenter un `MegaState` dans chaque cours.

#### libs/
Contient des dépendances javascript. Il est possible d'en abuser. Voici un tableau qui décrit l'utilité de chacune d'entre elles :

| Nom | Description |
|-----------|-----------|
| lenis.js (Lenis) | Gérer l'effet du scroll. |
| math.js | Utile pour le calcul numérique. Possible de calculer ou dériver des expressions. |
| mathjax.js | Permet d'afficher du latex sur la page. |
| nerdamer.js | Excelle plutôt dans le calcul symbolique d'expressions. Ro.js l'utilise principalement pour primitiver symboliquement. |

#### tools/
Contient les dépendances propres au projet. N'importe qui peut y inclure quelque chose.

| Nom | Description |
|-----------|-----------|
| CanvasManager | Gérer les composantes simples du canvas. Tracer une ligne, placer un point, ... |
| Colors | Gestion des couleurs présentes sur le site. |
| Functions | Contient des fonctions à axe mathématique. |
| MegaState | Le méga état qui permet de stocker l'état global du cours. Comme les paramètres du plot pour la page `fn_visualizer`. Il stocke aussi les balises importantes. |
| RootGraph | Permet de dessiner un fond pour une notion quelconque comme un repère, un cercle trigo, etc... |
| Vector2D | Simple abstraction d'un objet \{x,y\}. |

### Documentation
La documentation doit être écrite sur chaque fonction. On se base sur la notation jsdoc.

## Commentaire de démarrage
J'ai fait l'erreur de ne pas appliquer les concepts ci-dessus, donc tout deviendra progressivement conforme à compter du 10 Mai 2026.

## Licence
Vu notre échange précédent, je te propose plusieurs versions selon la licence que tu choisis finalement :
Si tu restes sur MIT (= commercialisation autorisée) :