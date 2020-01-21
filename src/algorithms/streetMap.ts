import CCNode from "../models/codeCharta/CCNode";
import HorizontalStreet from "../models/streetMap/HorizontalStreet";
import House from "../models/streetMap/House";
import VerticalStreet from "../models/streetMap/VerticalStreet";
import Box from "../models/streetMap/Box";

/**
 * Initializes a new horizontal street and calls its layout function.
 * @param root root node of the project
 * @param metric metric by which nodes are scaled
 */
export default function init(root: CCNode, metric: string): HorizontalStreet {
    const boxes = createBoxes(root, 0);
    const street = new HorizontalStreet(root, boxes);
    street.COLOR = 'gray'
    street.layout(metric);
    return street;
}

/**
 * Creates boxes for a street.
 * @param node current to create a box for
 * @param streetOrientation a child's street orientation: 0 for vertical, 1 for horizontal
 */
// REVIEW: Ich würde für streetOrientation enum verwenden.
// Dann entfällt die Codierung und es ist leicht ersichtlich was die Werte bedeuten.
function createBoxes(node: CCNode, streetOrientation: number): Box[] {
    let children: Box[] = [];
    for (const child of node.children) {
        if(child.type === "File") {
            children.push(new House(child));
        } else {
            // REVIEW: Diese Zeile würde ich umbrechen. Sie ist zu lang.
            children.push(streetOrientation === 0
                ? new VerticalStreet(child, createBoxes(child, 1 - streetOrientation))
                : new HorizontalStreet(child, createBoxes(child, 1 - streetOrientation)));
        }
    }
    return children;
}