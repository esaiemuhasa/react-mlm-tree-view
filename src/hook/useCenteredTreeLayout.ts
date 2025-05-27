import {useMemo, useState} from 'react';

import {
    Bound,
    Line,
    MeasuredNode,
    Orientation,
    PositionedTreeNode, TreeLayoutEngine,
    TreeNode
} from "..";


interface LayoutOptions {
    initialNodeWidth?: number;
    initialNodeHeight?: number;
    initialSpaceX?: number;
    initialSpaceY?: number;
    initialOrientation?: Orientation;
}


/**
 * Interface décrivant un moteur de mise en page centré pour des arbres binaires ou n-aires.
 *
 * Elle étend `TreeLayoutEngine` et ajoute la possibilité de modifier dynamiquement
 * les espacements horizontaux et verticaux entre les nœuds.
 */
interface CenteredTreeLayout extends TreeLayoutEngine {
    /** Espacement horizontal entre les nœuds frères */
    spaceX: number;

    /** Espacement vertical entre les niveaux de l’arbre */
    spaceY: number;

    /** Définit un nouvel espacement horizontal */
    setSpaceX: (spaceX: number) => void;

    /** Définit un nouvel espacement vertical */
    setSpaceY: (spaceY: number) => void;
}


/**
 * Hook React permettant de générer dynamiquement une disposition centrée d’un arbre hiérarchique.
 *
 * Ce hook calcule les coordonnées (`x`, `y`) et les dimensions (`width`, `height`) de chaque nœud d’un arbre
 * pour le positionner dans un espace 2D, en tenant compte de l’orientation, de l’espacement, et des dimensions des nœuds.
 *
 * Il fournit également une API pour mettre à jour dynamiquement les paramètres de mise en page (taille, orientation, espacement),
 * utile pour les composants interactifs (zoom, redimensionnement, orientation dynamique, etc.).
 *
 * @param {TreeNode | null | undefined} initialRoot - Nœud racine initial de l'arbre (optionnel).
 * @param {LayoutOptions} [options] - Options initiales de configuration de la mise en page.
 * @param {number} [options.initialNodeWidth=120] - Largeur par défaut d’un nœud.
 * @param {number} [options.initialNodeHeight=60] - Hauteur par défaut d’un nœud.
 * @param {number} [options.initialSpaceX=60] - Espacement horizontal entre les nœuds frères.
 * @param {number} [options.initialSpaceY=100] - Espacement vertical entre les niveaux.
 * @param {Orientation} [options.initialOrientation='horizontal'] - Orientation de l’arbre (`horizontal`, `vertical`, `radial`).
 *
 * @returns {CenteredTreeLayout} Objet contenant :
 * → le nœud racine source,
 * → le nœud racine positionné (`rootNode`),
 * → les dimensions globales (`bound`),
 * → les dimensions des nœuds (`nodeWidth`, `nodeHeight`),
 * → les espacements (`spaceX`, `spaceY`),
 * → l’orientation (`orientation`),
 * → des méthodes setters pour modifier ces paramètres.
 */
const useCenteredTreeLayout = (
    initialRoot?: TreeNode | null,
    {
        initialNodeWidth = 120,
        initialNodeHeight = 60,
        initialSpaceX = 20,
        initialSpaceY = 80,
        initialOrientation = 'horizontal'
    }: LayoutOptions = {}
): CenteredTreeLayout => {

    const [root, setRoot] = useState<TreeNode | null>(initialRoot == undefined ? null : initialRoot);
    const [nodeWidth, setNodeWidth] = useState<number>(initialNodeWidth);
    const [nodeHeight, setNodeHeight] = useState<number>(initialNodeHeight);
    const [spaceX, setSpaceX] = useState<number>(initialSpaceX);
    const [spaceY, setSpaceY] = useState<number>(initialSpaceY);
    const [orientation, setOrientation] = useState<Orientation>(initialOrientation);

    /**
     * Calcule les dimensions d’un sous-arbre à partir du nœud donné.
     *
     * Cette fonction évalue récursivement la largeur et la hauteur requises pour afficher
     * chaque nœud et ses enfants, en tenant compte de l’espacement entre les nœuds.
     *
     * @param {TreeNode} node - Le nœud à mesurer (racine du sous-arbre).
     * @returns {MeasuredNode} Objet contenant les dimensions mesurées et les sous-nœuds mesurés.
     */
    const measure = (node: TreeNode): MeasuredNode => {
        const children = node.children || [];
        if (children.length === 0) {
            return { node, width: nodeWidth, height: nodeHeight, children: [] };
        }

        const measuredChildren = children.map(measure);
        const totalWidth = measuredChildren.reduce((sum, child) => sum + child.width, 0) + spaceX * (children.length - 1);
        const totalHeight = measuredChildren.reduce((sum, child) => sum + child.height, 0) + spaceY * (children.length - 1);

        return {
            node,
            width: Math.max(nodeWidth, totalWidth),
            height: Math.max(nodeHeight, totalHeight),
            children: measuredChildren,
        };
    }

    /**
     * Calcule la profondeur maximale d’un arbre à partir du nœud donné.
     *
     * La profondeur correspond au nombre maximal de niveaux depuis la racine jusqu'à une feuille.
     *
     * @param {TreeNode} node - Nœud racine de l’arbre à analyser.
     * @returns {number} Profondeur de l’arbre.
     */
    const getTreeDepth = (node: TreeNode): number => {
        if (!node.children || node.children.length === 0) return 1;
        return 1 + Math.max(...node.children.map(getTreeDepth));
    }

    /**
     * Positionne un nœud mesuré dans l’espace 2D avec ses enfants,
     * en calculant récursivement leurs coordonnées selon l’orientation.
     *
     * Cette fonction génère les coordonnées `x`, `y` du nœud, la structure hiérarchique des enfants positionnés
     * ainsi que les lignes de connexion entre le nœud parent et ses enfants.
     *
     * @param {MeasuredNode} measuredNode - Le nœud mesuré contenant les tailles et sous-arbres.
     * @param {number} offset - Position de départ sur l’axe principal (x ou y selon l’orientation).
     * @param {number} depth - Niveau de profondeur actuel dans l’arbre.
     * @param orientation configuration de l'orientation
     * @returns {PositionedTreeNode} Nœud positionné avec ses enfants et connexions.
     */
    const layout = (measuredNode: MeasuredNode, offset: number, depth: number, orientation: Orientation): PositionedTreeNode => {
        let x: number, y: number;

        if (orientation === 'vertical') {
            x = depth * (nodeWidth + spaceX) + spaceX / 2;
            y = offset + measuredNode.height / 2 - nodeHeight / 2 + spaceY;
        } else {
            x = offset + measuredNode.width / 2 - nodeWidth / 2 + spaceX;
            y = depth * (nodeHeight + spaceY) + spaceY / 2;
        }

        const bound: Bound = { x, y, width: nodeWidth, height: nodeHeight };
        const children: PositionedTreeNode[] = [];
        const connections: Line[] = [];
        let childOffset = offset;

        for (const child of measuredNode.children) {
            const positionedChild = layout(child, childOffset, depth + 1, orientation);

            let x1: number, y1: number, x2: number, y2: number;

            if (initialOrientation === 'vertical') {
                childOffset += child.height + spaceY;
                x1 = bound.x + bound.width;
                y1 = bound.y + bound.height / 2;
                x2 = positionedChild.bound.x;
                y2 = positionedChild.bound.y + positionedChild.bound.height / 2;
            } else {
                childOffset += child.width + spaceX;
                x1 = bound.x + bound.width / 2;
                y1 = bound.y + bound.height;
                x2 = positionedChild.bound.x + bound.width / 2;
                y2 = positionedChild.bound.y;
            }

            children.push(positionedChild);
            connections.push({ x1, y1, x2, y2 });
        }

        return {
            node: measuredNode.node,
            depth,
            bound,
            children,
            connections,
        };
    }
    /**
     * Mémoïse la version mesurée de l’arbre à partir de la racine actuelle.
     * Cette mesure tient compte des dimensions et espacements configurés.
     */
    const measuredRoot = useMemo((): MeasuredNode | null => {
        if (root == null) {
            return null;
        }
        return measure(root);
    }, [root, nodeWidth, nodeHeight, spaceX, spaceY, orientation]);

    /**
     * Mémoïse le nœud racine positionné (`rootNode`) à chaque modification des paramètres de mise en page
     * ou de la structure mesurée de l’arbre. Cela permet d’éviter des recalculs inutiles lors du rendu.
     */
    const rootNode = useMemo((): PositionedTreeNode | null => {
        if (measuredRoot == null) {
            return null;
        }

        return layout(measuredRoot, 0, 0, orientation); // orientation dynamique
    }, [measuredRoot]);

    /**
     * Mémoïse les dimensions globales (bound) du canevas nécessaire pour afficher l’arbre,
     * en fonction de la profondeur, de l’orientation et des mesures du nœud racine.
     */
    const bound = useMemo((): Bound | null => {
        if (measuredRoot == null || root == null) {
            return null;
        }

        const depth = getTreeDepth(root);

        return orientation === 'vertical'
            ? {
                x: 0,
                y: 0,
                width: depth * (spaceY + nodeWidth) + spaceX,
                height: measuredRoot.height + 2 * spaceY,
            }
            : {
                x: 0,
                y: 0,
                width: measuredRoot.width + 2 * spaceX,
                height: depth * (spaceY + nodeHeight) + spaceY,
            };
    }, [measuredRoot, root, orientation, spaceY, nodeWidth, nodeHeight, spaceX]);


    return {
        root,
        bound,
        rootNode,
        spaceX,
        spaceY,
        nodeWidth,
        nodeHeight,
        orientation,
        setOrientation,
        setRoot,
        setSpaceX,
        setSpaceY,
        setNodeHeight,
        setNodeWidth,
    }
}


export {
    useCenteredTreeLayout,
}

export type {
    CenteredTreeLayout,
}
