import CCNode from "../models/codeCharta/CCNode";
import HorizontalStreet from "../models/streetLayout/HorizontalStreet";
import House from "../models/streetLayout/House";
import VerticalStreet from "../models/streetLayout/VerticalStreet";
import Box from "../models/streetLayout/Box";
import StripTreemap from "../models/Treemap/StripTreemap";
import SquarifiedTreemap from "../models/Treemap/SquarifiedTreemap";
import { TreemapAlgorithm } from "../models/visualization/Visualization";
import Treemap from "../models/Treemap/Treemap";
import SliceDiceTreemap from "../models/Treemap/SliceDiceTreemap";
import Street from "../models/streetLayout/Street";

enum StreetOrientation { Horizontal, Vertical };

/**
 * Initializes a new horizontal street and calls its layout function.
 * @param root root node of the project
 * @param metric metric by which nodes are scaled
 */
export default function init(root: CCNode, metric: string, treemapAlgorithm: TreemapAlgorithm = TreemapAlgorithm.Strip, treemapDepth: number = Infinity): Street {
    const boxes = createBoxes(root, StreetOrientation.Horizontal, metric, 0, treemapDepth, treemapAlgorithm);
    const street = new HorizontalStreet(root, boxes, 0);
    street.calculateDimension(metric);
    return street;
}

/**
 * Creates boxes for street algorithm.
 * @param node current to create a box for
 * @param streetOrientation a child's street orientation
 */
function createBoxes(node: CCNode, orientation: StreetOrientation, metric: string, depth: number, treemapDepth: number, treemapAlgorithm: TreemapAlgorithm): Box[] {
    const children: Box[] = [];
    for (let child of node.children) {
        if (child.size(metric) === 0) { continue };
        if (child.isFile()) {
            children.push(new House(child));
        } else {
            child = mergeDirectories(child, metric);
            if (depth >= treemapDepth) {
                const treemap: Treemap = createTreemapBox(child, metric, treemapAlgorithm);
                children.push(treemap);
            } else {
                children.push(orientation === StreetOrientation.Horizontal
                    ? new VerticalStreet(child, createBoxes(child, 1 - orientation, metric, depth + 1, treemapDepth, treemapAlgorithm), depth + 1)
                    : new HorizontalStreet(child, createBoxes(child, 1 - orientation, metric, depth + 1, treemapDepth, treemapAlgorithm), depth + 1));
            }
        }
    }
    return children;
}

/**
 * Condenses a folder if child folder has the same size.
 * @param node current node
 * @param metric visualization's metric
 */
function mergeDirectories(node: CCNode, metric: string): CCNode {
    let mergedNode = node;
    for (const child of node.children) {
        if (child.isFolder()) {
            if (mergedNode.size(metric) === child.size(metric)) {
                let name = node.name;
                mergedNode = child;
                mergedNode.name = name + "." + child.name;
                break;
            }
        }
    }
    return mergedNode;
}

function createTreemapBox(node: CCNode, metric: string, treemapAlgorithm: TreemapAlgorithm): Treemap {
    switch (treemapAlgorithm) {
        case TreemapAlgorithm.SliceAndDice:
            return new SliceDiceTreemap(node, metric);
        case TreemapAlgorithm.Squarified:
            return new SquarifiedTreemap(node, metric);
        case TreemapAlgorithm.Strip:
            return new StripTreemap(node, metric);
        default:
            throw new Error("Treemap Algorithm not specified.");
    }
}