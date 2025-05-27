import React, {ChangeEvent, FormEvent, StrictMode, useEffect, useState} from 'react'
import { createRoot } from 'react-dom/client'
import {useCenteredTreeLayout, type TreeNode, TreeView, PositionedTreeNode} from '.'
import styles from "./app.module.scss"
import "./style.scss"

const App = () => {

    const [model, setModel] = useState<TreeNode|null>(null);
    const {
        setRoot, setSpaceY, setSpaceX, setNodeWidth, setNodeHeight,
        rootNode, bound, orientation, spaceX, spaceY, nodeWidth, nodeHeight,
    } = useCenteredTreeLayout();

    const [selectedNode, setSelectedNode] = useState<TreeNode|undefined>(undefined);

    useEffect(() => {
        setRoot(model);
    }, [model]);

    useEffect(() => {
        const data: TreeNode = {
            id: 1,
            name: 'Root',
            children: [
                { id: 2, name: 'Child A' },
                {
                    id: 3, name: 'Child B',
                    children: [
                        { id: 9 , name: 'Child H' },
                        { id: 10, name: 'Child I' },
                        { id: 11, name: 'Child J' },
                    ]
                },
                {
                    id: 4, name: 'Child C',
                    children: [
                        { id: 5, name: 'Child D' },
                        {
                            id: 6, name: 'Child E',
                            children: [
                                { id: 12, name: 'Child K' },
                                { id: 13, name: 'Child L' },
                            ]
                        },
                        { id: 7, name: 'Child F' },
                        { id: 8, name: 'Child G' },
                    ]
                },
            ],
        }
        setModel(data)
    }, []);

    const handleNodeClick = (node : PositionedTreeNode) : void => {
        setSelectedNode(node.node)
    }

    /**
     * Insertion d'un nouveau nœud
     *
     * @param newNode nouveau nœud
     * @param parent parent du nœud
     * @param node racine du réseau
     */
    const insertAt = (newNode : TreeNode, parent: TreeNode, node: TreeNode) : TreeNode|null => {

        const children = node.children || [];

        if (node.id == parent.id) {
            children.push(newNode);
            node.children = children;
        } else {
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                insertAt(newNode, parent, child);
            }
        }

        return node;
    }

    const handleInsert = (even: FormEvent<HTMLFormElement>) : void => {
        even.preventDefault();

        const content = new FormData(even.currentTarget);
        const name = content.get("name")!.toString();
        if (name.trim() === '' || selectedNode == undefined) {
            return;

        }

        const node : TreeNode = {
            id: new Date().getTime(),
            name: name,
            children: []
        }
        console.log(node)
        even.currentTarget.reset();

        if (model != null) {
            const newRoot = insertAt(node, selectedNode, model);
            if (newRoot != null) {
                setModel({...newRoot});
                setSelectedNode(node);
            }
        }
    }

    const handleChange = (e : ChangeEvent<HTMLInputElement>) => {
        const name = e.currentTarget.name
        const value = e.currentTarget.value

        let toInt = Number.parseInt(value);

        if (Number.isNaN(toInt)) {
            toInt = 0
        }

        switch (name) {
            case 'spaceX':
                setSpaceX(toInt)
                break;
            case 'spaceY':
                setSpaceY(toInt)
                break;

            case 'nodeWidth':
                setNodeWidth(toInt)
                break;
            case 'nodeHeight':
                setNodeHeight(toInt)
                break;
        }
    }

    if (!rootNode || !orientation || !bound) {
        return <p>Chargement...</p>
    }

    return (
        <div className={styles.app}>
            <section className={styles.treeControl}>
                <div className={styles.sizing}>
                    <div className={styles.inputGroup}>
                        <label>Space X</label>
                        <input type={"range"} min={1} max={300} name={"spaceX"} onChange={handleChange} value={spaceX}/>
                        <span>{spaceX} px</span>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Space Y</label>
                        <input type={"range"} min={10} max={300} name={"spaceY"} onChange={handleChange} value={spaceY}/>
                        <span>{spaceY} px</span>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Node Width X</label>
                        <input type={"range"} min={30} max={300} name={"nodeWidth"} onChange={handleChange} value={nodeWidth}/>
                        <span>{nodeWidth} px</span>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Node Height</label>
                        <input type={"range"} min={30} max={300} name={"nodeHeight"} onChange={handleChange} value={nodeHeight}/>
                        <span>{nodeHeight} px</span>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Bound</label>
                        <span>{bound.width}x{bound.height}px</span>
                    </div>
                </div>

                {selectedNode && (
                    <form onSubmit={handleInsert} method={'post'} className={styles.selectedNode}>
                        <h2>{selectedNode.name}</h2>

                        <div>
                            <label>Insert new child</label>
                            <input name={"name"}/>
                        </div>

                        <button type={"submit"}>
                            Validate
                        </button>
                    </form>
                )}
            </section>
            <section className={styles.treeContainer}>
                <TreeView root={rootNode} orientation={orientation} bound={bound} onClick={handleNodeClick}/>
            </section>
        </div>
    )
}

document.addEventListener('DOMContentLoaded', () => {
    createRoot(document.getElementById('root')!).render(
        <StrictMode>
            <App />
        </StrictMode>,
    )
})
