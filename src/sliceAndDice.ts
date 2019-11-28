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
export default function sliceAndDice(nodes: Node[], canvas: Rect, attribute: string): Box[] {
    treemap(nodes[0], canvas.topLeft[0], canvas.topLeft[1], canvas.bottomRight[0], canvas.bottomRight[1], 0, attribute);
    return boxes;
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
 * @param attribute attribute by which nodes are scaled
 */
function treemap(root: Node, tlX: number, tlY: number, brX: number, brY: number, axis: number, attribute: string) {
    let newRect = new Rect([tlX, tlY], [brX, brY]);
    //adds new box for node
    boxes.push(new Box(root.name, new Rect([tlX, tlY], [brX, brY]), root.attributes, root.type));
    //uses x or y coord depending on orientation of the rectangle
    let width = newRect.bottomRight[axis] - newRect.topLeft[axis];

    if (root.children !== undefined) {
        for (const child of root.children) {
            //sets position of new rectangle
            newRect.bottomRight[axis] = newRect.topLeft[axis] + child.size(attribute) / root.size(attribute) * width;
            //go to child level and toggle axis
            treemap(child, newRect.topLeft[0], newRect.topLeft[1], newRect.bottomRight[0], newRect.bottomRight[1], 1 - axis, attribute);
            newRect.topLeft[axis] = newRect.bottomRight[axis];
        }
    }
}