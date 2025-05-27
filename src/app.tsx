import React, {StrictMode, useEffect} from 'react'
import { createRoot } from 'react-dom/client'
import {useCenteredTreeLayout, type TreeNode, TreeView} from '.'

const App = () => {
    const { setRoot, rootNode, bound, orientation } = useCenteredTreeLayout()

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
                        { id: 6, name: 'Child E' },
                        { id: 7, name: 'Child F' },
                        { id: 8, name: 'Child G' },
                    ]
                },
            ],
        }
        setRoot(data)
    }, [])

    if (!rootNode || !orientation || !bound) {
        return <p>Chargement...</p>
    }

    return (
        <>
            <TreeView root={rootNode} orientation={orientation} bound={bound} />
        </>
    )
}

document.addEventListener('DOMContentLoaded', () => {
    createRoot(document.getElementById('root')!).render(
        <StrictMode>
            <App />
        </StrictMode>,
    )
})
