import CCNode from "../models/codeCharta/CCNode";
import HorizontalStreet from "../models/streetMap/HorizontalStreet";
import House from "../models/streetMap/House";
import VerticalStreet from "../models/streetMap/VerticalStreet";
import Box from "../models/streetMap/Box";
import Treemap from "../models/streetMap/Treemap";

enum StreetOrientation { Horizontal, Vertical };

/**
 * Initializes a new horizontal street and calls its layout function.
 * @param root root node of the project
 * @param metric metric by which nodes are scaled
 */
export default function init(root: CCNode, metric: string): HorizontalStreet {
    const boxes = createBoxes(root, 0, metric, 0);
    const street = new HorizontalStreet(root, boxes, 0);
    street.calculateDimension(metric);
    return street;
}

/**
 * Creates boxes for a street.
 * @param node current to create a box for
 * @param streetOrientation a child's street orientation
 */
function createBoxes(node: CCNode, orientation: StreetOrientation, metric: string, depth: number): Box[] {
    const children: Box[] = [];
    for (const child of node.children) {
        if (child.isFile()) {
            children.push(new House(child));
        } else {
            if(child.size(metric) === 0) {
                continue;
            }
            if(depth >= 3) {
                children.push(new Treemap(child, metric));
            } else {
                children.push(orientation === StreetOrientation.Horizontal
                    ? new VerticalStreet(child, createBoxes(child, 1 - orientation, metric, depth + 1), depth + 1)
                    : new HorizontalStreet(child, createBoxes(child, 1 - orientation, metric, depth + 1), depth + 1));
            }
        }
    }
    return children;
}