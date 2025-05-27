import React, { FunctionComponent } from 'react'
import {
    Bound,
    Line,
    Orientation,
    PositionedTreeNode,
} from '..'

import "./tree-view.scss"

/**
 * Calcule dynamiquement un décalage pour la courbe de liaison
 * en fonction de la profondeur du nœud afin d'ajuster l'arrondi.
 *
 * @param depth - Profondeur du nœud dans l'arbre.
 * @returns Décalage calculé pour la courbure.
 */
const calculateCurveOffset = (depth: number): number => {
    const base = 60
    const decay = 0.35
    const min = 20
    const offset = base * Math.exp(-decay * depth)
    return Math.max(offset, min)
}

interface TreeViewProps {
    /** Nœud racine positionné de l’arbre */
    root: PositionedTreeNode
    /** Orientation de l’arbre : 'vertical' ou 'horizontal' */
    orientation: Orientation
    /** Dimensions globales du rendu (largeur/hauteur) */
    bound: Bound;

    /**
     * Lors du click sur un item
     * @param node
     */
    onClick?: (node: PositionedTreeNode) => void;
}

/**
 * Composant principal permettant d'afficher un arbre positionné avec des connexions SVG.
 *
 * @param root - Nœud racine avec coordonnées et liaisons calculées.
 * @param orientation - Détermine l’orientation des connexions.
 * @param bound - Taille du canevas de rendu.
 */
const TreeView: FunctionComponent<TreeViewProps> = ({ root, orientation, bound, onClick }) => {

    const handleClick = (node: PositionedTreeNode) : void => {
        if (onClick) {
            onClick(node)
        }
    }
    return (
        <div className="mlm-tree-view-container"
             style={{
                 position: 'relative',
                 width: bound.width,
                 height: bound.height
             }}>

            <svg className="mlm-tree-svg"
                 xmlns="http://www.w3.org/2000/svg"
                 style={{
                     position: 'absolute',
                     width: '100%',
                     height: '100%',
                     top: 0,
                     left: 0,
                     pointerEvents: 'none'
                 }}>
                <NodeConnection node={root} orientation={orientation} />
            </svg>

            <NodeView node={root} onClick={handleClick} />
        </div>
    )
}

interface NodeViewProps {
    /** Nœud à afficher avec ses enfants récursivement */
    node: PositionedTreeNode;

    /**
     * Traitement de l'action du click sur un nœud.
     */
    onClick: (node: PositionedTreeNode) => void;
}

/**
 * Composant récursif qui rend chaque nœud de l'arbre à sa position calculée.
 */
const NodeView: FunctionComponent<NodeViewProps> = ({ node, onClick }) => {


    const handClick = () : void => {
        onClick(node)
    }

    const box = node.bound

    const style = {
        position: 'absolute' as const,
        left: box.x,
        top: box.y,
        width: box.width,
        height: box.height,
    }

    return (
        <>
            <div onClick={handClick} className="mlm-tree-node" style={style}>
                <div className="mlm-tree-node-content">
                    {node.node.name}
                </div>
            </div>
            {node.children.map(item => (
                <NodeView node={item} key={`${item.node.id}`} onClick={onClick} />
            ))}
        </>
    )
}

interface ConnectionItemProps {
    /** Nœud à afficher les connextions, memement pour ses enfants récursivement */
    node: PositionedTreeNode;

    /** Ligne de connexion entre deux nœuds */
    line: Line
    /** Orientation des connexions ('vertical' ou 'horizontal') */
    orientation: Orientation
}

interface NodeConnectionProps {
    /** Nœud racine dont les connexions seront rendues */
    node: PositionedTreeNode
    /** Orientation des connexions ('vertical' ou 'horizontal') */
    orientation: Orientation
}

/**
 * Composant récursif qui rend les connexions SVG d'un nœud et de ses enfants.
 *
 * @param node - Nœud source dont les connexions sont à dessiner.
 * @param orientation - Orientation du tracé ('horizontal' ou 'vertical').
 */
const NodeConnection: FunctionComponent<NodeConnectionProps> = ({ node, orientation }) => {
    return (
        <>
            {node.connections.map((item, index) => (
                <ConnectionItem
                    key={node.node.id + `${index}`}
                    line={item}
                    orientation={orientation}
                    node={node}
                />
            ))}
            {node.children.map(child => (
                <NodeConnection
                    key={`conn-${child.node.id}`}
                    node={child}
                    orientation={orientation}
                />
            ))}
        </>
    )
}

/**
 * Composant représentant une ligne (droite ou courbe) entre deux nœuds.
 *
 * @param line - Coordonnées de la ligne à dessiner.
 * @param node - Nœud parent utilisé pour le calcul de courbure.
 * @param orientation - Orientation de l’arbre (influence la courbe).
 */
const ConnectionItem: FunctionComponent<ConnectionItemProps> = ({ node, orientation, line }) => {
    const { x1, x2, y1, y2 } = line

    // Cas ligne droite
    if (x1 === x2 || y1 === y2) {
        return (
            <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#555"
                strokeWidth="2"
            />
        )
    }

    // Cas courbe
    let cx1 = x1, cy1 = y1, cx2 = x2, cy2 = y2
    if (orientation === 'vertical') {
        const curveOffset = 35
        const controlOffset = 20
        cx1 = x1 + curveOffset
        cx2 = x2 - curveOffset
        if (y1 < y2) {
            cy1 = y1 + controlOffset
            cy2 = y2
        } else {
            cy1 = y1 - controlOffset
            cy2 = y2 + controlOffset
        }
    } else {
        const curveOffset = calculateCurveOffset(node.depth)
        cy1 = y1 + curveOffset
        cy2 = y2 - curveOffset
    }

    return (
        <path
            d={`M${x1},${y1} C${cx1},${cy1} ${cx2},${cy2} ${x2},${y2}`}
            stroke="#555"
            strokeWidth="2"
            fill="none"
            style={{ animationDelay: `${0.05 * node.depth}s` }}
        />
    )
}

export {
    TreeView
}
