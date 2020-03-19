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
 * @param rootNode projects root node
 * @param metricName metric by which nodes are scaled
 * @param treemapAlgorithm treemap algorithm for TMStreet layout
 * @param treemapDepth depth where treemaps substitute streets
 */
export default function createLayout(rootNode: CCNode, metricName: string, treemapAlgorithm: TreemapAlgorithm = TreemapAlgorithm.Strip, treemapDepth: number = Infinity): Street {
    const boxes = createBoxes(rootNode, StreetOrientation.Horizontal, metricName, 0, treemapDepth, treemapAlgorithm);
    const street = new HorizontalStreet(rootNode, boxes, 0);
    street.calculateDimension(metricName);
    return street;
}

/**
 * Creates boxes for street algorithm.
 * @param node current node
 * @param orientation orientation of root street 
 * @param metricName metric to be used
 * @param depth depth of current node
 * @param treemapDepth depth where treemaps substitute streets
 * @param treemapAlgorithm treemap algorithm to be used for TMStreet layout
 */
function createBoxes(node: CCNode, orientation: StreetOrientation, metricName: string, depth: number, treemapDepth: number, treemapAlgorithm: TreemapAlgorithm): Box[] {
    const children: Box[] = [];
    const mergedNode = mergeDirectories(node, metricName);
    for (let child of mergedNode.children) {
        if (child.size(metricName) === 0) { continue };
        if (child.isFile()) {
            children.push(new House(child));
        } else {
            child = mergeDirectories(child, metricName);
            if (depth >= treemapDepth) {
                const treemap: Treemap = createTreemapBox(child, metricName, treemapAlgorithm);
                children.push(treemap);
            } else {
                children.push(orientation === StreetOrientation.Horizontal
                    ? new VerticalStreet(child, createBoxes(child, 1 - orientation, metricName, depth + 1, treemapDepth, treemapAlgorithm), depth + 1)
                    : new HorizontalStreet(child, createBoxes(child, 1 - orientation, metricName, depth + 1, treemapDepth, treemapAlgorithm), depth + 1));
            }
        }
    }
    return children;
}

/**
 * Condenses a folder if child folder has the same size.
 * @param node current node
 * @param metricName visualization's metric
 */
function mergeDirectories(node: CCNode, metricName: string): CCNode {
    let mergedNode = node;
    for (const child of node.children) {
        if (child.isFolder()) {
            if(mergedNode.name.includes("root")) console.log(mergedNode.size(metricName))
            if (mergedNode.size(metricName) === child.size(metricName)) {
                let name = node.name;
                mergedNode = child;
                mergedNode.name = name + "." + child.name;
                break;
            }
        }
    }
    return mergedNode;
}

/**
 * Treemap Factory that returns treemap of requested type
 * @param node root node for the treemap
 * @param metric metric to be used
 * @param treemapAlgorithm chosen algorithm
 */
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