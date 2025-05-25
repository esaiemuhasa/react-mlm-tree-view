
# @modernik/react-mlm-tree-view

> **Bibliothèque React légère et extensible permettant de générer des arbres hiérarchiques de type marketing de réseau (MLM) avec un rendu HTML stylisé prêt à l'emploi.**

---

Ce projet est une **bibliothèque frontend** conçue pour compléter le projet backend [`modernik/mlm-tree-view`](https://github.com/Modernik-Ing/mlm-tree-view) écrit en PHP.  
Il permet d’intégrer facilement une **visualisation interactive** et **moderne** d’un arbre MLM dans toute application React.

---

## Objectif

- Offrir un **moteur d'affichage interactif** de structures MLM côté frontend.
- Rendre la visualisation **réutilisable**, **personnalisable** et **compatible** avec la structure JSON produite par des APIs tiers.
- Faciliter l'intégration dans des **applications web riches (SPA)** basées sur React.

---

## Installation

```bash
yarn add @modernik/react-mlm-tree-view
# ou
npm install @modernik/react-mlm-tree-view
````

---

## Utilisation de base

```tsx
import { TreeView } from '@modernik/react-mlm-tree-view';

const treeData = {
  id: 1,
  name: "Root",
  children: [
      { id: 2, name: "Left" },
      { id: 3, name: "Right" }
  ]
};

export function App() {
  return <TreeView data={treeData} />;
}
```

---

## Fonctionnalités prévues

* Personnalisation des couleurs, formes et styles des nœuds
* Zoom et déplacement (pan)
* Animations de transition
* Support responsive pour mobiles
* Composants internes réutilisables pour une intégration avancée

---

## Développement local

```bash
yarn install
yarn dev
```

Ouvre ensuite : [http://localhost:5173](http://localhost:5173)

---

## Structure du projet

```
.
├── src/                 # Code source de la bibliothèque
│   ├── component/       # Composants React internes
│   └── index.ts         # Point d’entrée de la lib
├── web/                 # Exemple / tests manuels dans le navigateur
│   └── index.html
│   └── main.tsx
├── tsconfig.json
├── vite.config.ts       # Pour le dev & test
├── tsup.config.ts       # Pour le build de la lib
```

---

## Licence

Ce projet est sous licence MIT — vous pouvez l’utiliser librement dans vos projets personnels ou commerciaux.

MIT © [Modernik-Ing](https://github.com/Modernik-Ing)

