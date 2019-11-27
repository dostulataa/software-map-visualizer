import Rect from "./models/Rect";
import Box from "./models/Box";
import Node from "./models/Node";

let boxes: Box[] = [];

/**
 * 
 * Default function for Slice and Dice Algorithm. Returns the boxes that have been created
 * 
 * @param nodes the nodes of a project that should be displayed
 * @param canvas rectangle in which the treemap should be placed
 * @param attribute attribute by which nodes are scaled
 */
export default function (nodes: Node[], canvas: Rect, attribute: string): Box[] {
    sliceAndDice(nodes[0], canvas, 0, attribute);
    return boxes;
}

/**
 * 
 * The actual algorithm function that creates the Treemap 
 * 
 * @param root root node of the project
 * @param rect rectangle in which the treemap should be placed
 * @param axis axis of current recursion level. Changes between 0 and 1
 * @param attribute attribute by which nodes are scaled
 */
function sliceAndDice(root: Node, rect: Rect, axis: number, attribute: string) {
    //adds new box for node
    boxes.push(new Box(root.name, new Rect([rect.topLeft[0], rect.topLeft[1]], [rect.bottomRight[0], rect.bottomRight[1]]), root.attributes, root.type));
    //uses x or y coord depending on orientation of the rectangle
    let width = rect.bottomRight[axis] - rect.topLeft[axis];

    if (root.children !== undefined) {
        for (const child of root.children) {
            //sets position of new rectangle
            rect.bottomRight[axis] = rect.topLeft[axis] + child.size(attribute) / root.size(attribute) * width;
            //go to child level and toggle axis
            sliceAndDice(child, rect, 1 - axis, attribute);
            rect.topLeft[axis] = rect.bottomRight[axis];
        }
    }
}