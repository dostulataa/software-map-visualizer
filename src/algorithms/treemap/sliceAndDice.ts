import Rectangle from "../../models/visualization/Rectangle";
import VisualNode from "../../models/visualization/VisualNode";
import CCNode from "../../models/codeCharta/CCNode";
import Point from "../../models/visualization/Point";

let treemapNodes: VisualNode[] = [];

/**
 * 
 * Default function for Slice and Dice Algorithm. Returns the treemap nodes that have been created
 * 
 * @param nodes the nodes of a project that should be displayed
 * @param canvas rectangle in which the treemap should be placed
 * @param metric metric by which Treemap Nodes are scaled
 */
export default function sliceAndDice(root: CCNode, canvas: Rectangle, metric: string): VisualNode[] {
    let topLeft: [number, number] = [canvas.topLeft.x, canvas.topLeft.y];
    let bottomRight: [number, number] = [canvas.topLeft.x + canvas.width, canvas.topLeft.y + canvas.height];
    treemap(root, topLeft, bottomRight, 0, metric);
    return treemapNodes;
}

/**
 * 
 * The actual algorithm function that creates the Treemap
 * 
 * @param root root node of the project
 * @param tlX rectangle's top left point
 * @param tlY rectangle's bottom right point
 * @param axis axis of current recursion level. Changes between 0 and 1
 * @param metric metric by which Treemap nodes are scaled
 */
function treemap(root: CCNode, topLeft: [number, number], bottomRight: [number, number], axis: number, metric: string) {
    let newTopLeft: [number, number] = [topLeft[0], topLeft[1]];
    let newBottomRight: [number, number] = [bottomRight[0], bottomRight[1]];
    //adds new Treemap Node for Code Charta Node
    treemapNodes.push(new VisualNode(new Rectangle(new Point(topLeft[0], topLeft[1]), bottomRight[0] - topLeft[0], bottomRight[1] - topLeft[1]), root, colorize(root)));
    //uses x or y coord depending on orientation of the rectangle
    let width = bottomRight[axis] - topLeft[axis];

    for (const child of root.children) {
        if (root.size(metric) !== 0) {
            //sets position of new rectangle
            newBottomRight[axis] = newTopLeft[axis] + child.size(metric) / root.size(metric) * width;
            //go to child level and toggle axis
            treemap(child, newTopLeft, newBottomRight, 1 - axis, metric);
            newTopLeft[axis] = newBottomRight[axis];
        }
    }
}

/**
 * Returns color depending on file's type
 * @param node current node being colorized
 */
function colorize(node: CCNode): string {
    return node.type === "File" ? "LightSteelBlue" : "SteelBlue";
}