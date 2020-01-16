import CCNode from "../models/codeCharta/CCNode";
import HorizontalStreet from "../models/streetMap/HorizontalStreet";
import House from "../models/streetMap/House";
import VerticalStreet from "../models/streetMap/VerticalStreet";
import Box from "../models/streetMap/Box";


export default function start(root: CCNode, metric: string): HorizontalStreet {
    let boxes = createBoxes(root, 0);
    let street = new HorizontalStreet(root, boxes);
    street.layout(metric);
    return street;
}

function createBoxes(node: CCNode, axis: number): Box[] {
    let children: Box[] = [];
    for (const child of node.children) {
        if(child.type === "File") {
            children.push(new House(child));
        } else {
            children.push(axis === 0 ? new VerticalStreet(child, createBoxes(child, 1 - axis)) : new HorizontalStreet(child, createBoxes(child, 1 - axis)));
        }
    }
    return children;
}