import Rect from "./models/Rect";
import Box from "./models/Box";
import Node from "./models/Node";

let boxes: Box[] = [];
const attribute: string = "rloc";

export function sliceAndDice(root: Node, p: [number, number], q: [number, number], axis: number): Box[] {
    //adds new box for node
    boxes.push(new Box(root.name, new Rect([p[0], p[1]], [q[0], q[1]]), root.attributes, root.type));
    //uses x or y coord depending on orientation of the rectangle
    let width = q[axis] - p[axis];

    if(root.children !== undefined) {
        for (const child of root.children) {
            //sets position of new rectangle
            let childSize: number = child.size(attribute);
            q[axis] = p[axis] + childSize / root.size(attribute) * width;
            //go to child level and toggle axis
            sliceAndDice(child, p, q, 1 - axis);
            p[axis] = q[axis];
        }
    }
    return boxes;
}