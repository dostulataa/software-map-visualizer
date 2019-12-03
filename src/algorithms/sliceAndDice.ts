import Rectangle from "../models/treemap/Rectangle";
import TreemapNode from "../models/treemap/TreemapNode";
import Node from "../models/codeCharta/Node";

let treemapNodes: TreemapNode[] = [];

/**
 * 
 * Default function for Slice and Dice Algorithm. Returns the treemap nodes that have been created
 * 
 * @param nodes the nodes of a project that should be displayed
 * @param canvas rectangle in which the treemap should be placed
 * @param metric metric by which Treemap Nodes are scaled
 */
export default function sliceAndDice(nodes: Node[], canvas: Rectangle, metric: string): TreemapNode[] {
    treemap(nodes[0], canvas.topLeft[0], canvas.topLeft[1], canvas.bottomRight[0], canvas.bottomRight[1], 0, metric);
    return treemapNodes;
}

/**
 * 
 * The actual algorithm function that creates the Treemap 
 * 
 * @param root root node of the project
 * @param axis axis of current recursion level. Changes between 0 and 1
 * @param tlX X Coordinate of the rectangle's topLeft pointer
 * @param tlY Y Coordinate of the rectangle's topLeft pointer
 * @param brX X Coordinate of the rectangle's bottomRight pointer
 * @param brY Y Coordinate of the rectangle's bottomRight pointer
 * @param metric metric by which Treemap nodes are scaled
 */
function treemap(root: Node, tlX: number, tlY: number, brX: number, brY: number, axis: number, metric: string) {
    let newRect = new Rectangle([tlX, tlY], [brX, brY]);
    //adds new Treemap Node for Code Charta Node
    treemapNodes.push(new TreemapNode(new Rectangle([tlX, tlY], [brX, brY]), root));
    //uses x or y coord depending on orientation of the rectangle
    let width = newRect.bottomRight[axis] - newRect.topLeft[axis];

    if (root.children !== undefined) {
        for (const child of root.children) {
            //sets position of new rectangle
            newRect.bottomRight[axis] = newRect.topLeft[axis] + child.size(metric) / root.size(metric) * width;
            //go to child level and toggle axis
            treemap(child, newRect.topLeft[0], newRect.topLeft[1], newRect.bottomRight[0], newRect.bottomRight[1], 1 - axis, metric);
            newRect.topLeft[axis] = newRect.bottomRight[axis];
        }
    }
}