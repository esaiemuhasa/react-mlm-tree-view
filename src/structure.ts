/**
 * Un identifiant générique pour un nœud, pouvant être une chaîne ou un entier.
 */
type Identifier = string | number;

/**
 * Définit l'orientation du rendu de l'arbre.
 * Peut être horizontale, verticale ou radiale.
 */
type Orientation = string | 'horizontal' | 'vertical' | 'radial';

/**
 * Représente un nœud dans un arbre hiérarchique (ex. MLM).
 *
 * Cette interface généralise toute structure arborescente à partir d'une source de données.
 * Elle peut être utilisée pour générer des rendus HTML, SVG, ou pour tout autre traitement de structure en arbre.
 */
interface TreeNode {
    /** Identifiant unique du nœud (UUID, entier, etc.) */
    id: Identifier;

    /** Nom ou libellé affichable (ex. nom d’un membre) */
    name: string;

    /** Liste des enfants directs de ce nœud (optionnel) */
    children?: TreeNode[];

    /** Référence au parent du nœud, ou `null` s’il s’agit de la racine (optionnel) */
    parent?: TreeNode | null;
}

/**
 * Définit un rectangle positionné dans un espace bidimensionnel.
 *
 * Utilisé pour représenter la boîte englobante d’un élément graphique dans un système de coordonnées,
 * par exemple dans le rendu HTML ou SVG.
 */
interface Bound {
    /** Coordonnée X de l’origine du rectangle */
    x: number;

    /** Coordonnée Y de l’origine du rectangle */
    y: number;

    /** Largeur du rectangle */
    width: number;

    /** Hauteur du rectangle */
    height: number;
}

/**
 * Représente une ligne entre deux points dans un espace 2D.
 *
 * Utilisée notamment pour dessiner les liens entre les nœuds d’un arbre (ex. dans un diagramme SVG).
 */
interface Line {
    /** Coordonnée X du point de départ */
    x1: number;

    /** Coordonnée Y du point de départ */
    y1: number;

    /** Coordonnée X du point d’arrivée */
    x2: number;

    /** Coordonnée Y du point d’arrivée */
    y2: number;
}

/**
 * Représente un nœud enrichi des dimensions calculées de son sous-arbre.
 *
 * Utilisé pendant le processus de mise en page d’un arbre hiérarchique.
 * Il permet de connaître la largeur et la hauteur nécessaires à l’affichage de ce nœud et de ses descendants.
 */
interface MeasuredNode {
    /** Référence vers le nœud source */
    node: TreeNode;

    /** Largeur totale nécessaire à ce sous-arbre */
    width: number;

    /** Hauteur totale nécessaire à ce sous-arbre */
    height: number;

    /** Liste des enfants mesurés récursivement */
    children: MeasuredNode[];
}

/**
 * Représente un nœud positionné avec ses coordonnées et dimensions dans l’espace.
 *
 * Contient aussi ses connexions graphiques avec ses enfants, sa profondeur dans l’arbre,
 * et sa boîte englobante.
 */
interface PositionedTreeNode {
    /** Nœud source */
    node: TreeNode;

    /** Enfants positionnés récursivement */
    children: PositionedTreeNode[];

    /** Boîte englobante calculée pour ce nœud */
    bound: Bound;

    /** Connexions graphiques (lignes) vers les enfants */
    connections: Line[];

    /** Profondeur du nœud dans l’arbre (0 = racine) */
    depth: number;
}

/**
 * Interface d’un moteur de mise en page pour un arbre hiérarchique.
 *
 * Gère la racine, l’orientation, les dimensions des nœuds et les calculs de positionnement.
 */
interface TreeLayoutEngine {
    /** Nœud racine de l’arbre d’entrée */
    root: TreeNode | null;

    /** Nœud racine positionné après calcul */
    rootNode: PositionedTreeNode | null;

    /** Boîte englobante complète de l’arbre positionné */
    bound: Bound | null;

    /** Orientation de l’arbre (vertical, horizontal, radial, etc.) */
    orientation: Orientation | undefined;

    /** Largeur fixe à utiliser pour chaque nœud */
    nodeWidth: number;

    /** Hauteur fixe à utiliser pour chaque nœud */
    nodeHeight: number;

    /** Définit l’orientation de l’arbre */
    setOrientation: (orientation: Orientation) => void;

    /** Définit la racine de l’arbre source */
    setRoot: (root: TreeNode | null) => void;

    /** Définit la largeur des nœuds */
    setNodeWidth: (nodeWidth: number) => void;

    /** Définit la hauteur des nœuds */
    setNodeHeight: (nodeHeight: number) => void;
}

// Export des types
export type {
    Identifier,
    Orientation,
    TreeNode,
    Bound,
    Line,
    MeasuredNode,
    PositionedTreeNode,
    TreeLayoutEngine
};
