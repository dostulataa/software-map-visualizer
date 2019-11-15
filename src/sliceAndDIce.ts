import Rect from "./models/Rect";
import Box from "./models/Box";
import Node from "./models/Node";

let boxes: Box[] = [];
const attribute: string = "rloc";

export function sliceAndDice(root: Node, rect: Rect, axis: number): Box[] {
    //adds new box for node
    boxes.push(new Box(root.name, new Rect([rect.p[0], rect.p[1]], [rect.q[0], rect.q[1]]), root.attributes, root.type));
    //uses x or y coord depending on orientation of the rectangle
    let width = rect.q[axis] - rect.p[axis];

    if(root.children !== undefined) {
        for (const child of root.children) {
            //sets position of new rectangle
            rect.q[axis] = rect.p[axis] + child.size(attribute) / root.size(attribute) * width;
            //go to child level and toggle axis
            sliceAndDice(child, rect, 1 - axis);
            rect.p[axis] = rect.q[axis];
        }
    }
    return boxes;
}