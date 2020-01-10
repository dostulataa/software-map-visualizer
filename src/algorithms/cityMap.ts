import Rectangle from "../models/treemap/Rectangle";
import TreemapNode from "../models/treemap/TreemapNode";
import CCNode from "../models/codeCharta/CCNode";
import { Rotations } from "../models/treemap/Rectangle";

let treemapNodes: TreemapNode[] = [];

export default function start(nodes: CCNode[], canvas: Rectangle, metric: string): TreemapNode[] {
    create(nodes[0], metric, canvas, 0);
    return treemapNodes;
}

function create(root: CCNode, metric: string, rect: Rectangle, depth: number) {
    let rootNode: TreemapNode = center(new TreemapNode(new Rectangle([0, 0], [getStreetLength(root, metric, depth), getStreetWidth(depth)]), root, colorize(root)), rect);
    if (root.name === "root") {
        treemapNodes.push(rootNode);
        const node = skipEmptyFolders(root);
        createNodesAroundStreet(node, rootNode, metric, depth);
    }
}


/**
 * Creates the nodes around a street representation
 * @param streetNode the folder node 
 * @param streetRepr the street representation around which the nodes are placed
 * @param metric the metric used
 * @param depth depth progression through the tree used for street orientation
 */
function createNodesAroundStreet(streetNode: CCNode, streetRepr: TreemapNode, metric: string, depth: number) {
    let currentX = streetRepr.rectangle.topLeft[0];
    let y = streetRepr.rectangle.topLeft[1];
    let isFirstRow = true;
    let newNode;
    for (const child of streetNode.children) {
        const sideLength = getSideLength(child, metric, depth);
        const newTotalLength = currentX + sideLength - streetRepr.rectangle.topLeft[0];
        if (newTotalLength >= getStreetLength(streetNode, metric, depth)) {
            currentX = streetRepr.rectangle.topLeft[0];
            y = streetRepr.rectangle.bottomRight[1];
            isFirstRow = false;
        }
        // zur rotation wird die orientierung über oder unter der strasse benötigt ("ist die straße oben oder unten dran")
        if (child.type === "File") {
            const rotationPoint: [number, number] = [streetRepr.rectangle.topLeft[0], streetRepr.rectangle.topLeft[1] + getStreetWidth(depth) / 2];
            let newRect = createRectangle(currentX, y, sideLength, isFirstRow);
            newRect = newRect.rotateAroundPoint(rotationPoint, calcAngle(child.type, depth, isFirstRow));
            newNode = new TreemapNode(newRect, child, colorize(child));
        } else {
            newNode = new TreemapNode(createStreet(currentX, y, sideLength, getStreetLength(child, metric, depth), depth), child, colorize(child));
            const rotationPoint: [number, number] = [newNode.rectangle.topLeft[0], newNode.rectangle.topLeft[1] + getStreetWidth(depth) / 2];
            createNodesAroundStreet(child, newNode, metric, depth + 1);
            let angle = calcAngle(child.type, depth, isFirstRow);
            newNode.rectangle = newNode.rectangle.rotateAroundPoint(rotationPoint, angle);
        }
        treemapNodes.push(newNode);
        currentX += sideLength;
    }
}

function createRectangle(x: number, y: number, sideLength: number, isfirstRow: boolean): Rectangle {
    return isfirstRow ? new Rectangle([x, y - sideLength], [x + sideLength, y]) : new Rectangle([x, y], [x + sideLength, y + sideLength]);
}

function createStreet(x: number, y: number, sideLength: number, streetLength: number, depth: number): Rectangle {
    const streetWidth = getStreetWidth(depth);
    const streetX = x + sideLength / 2 - streetWidth / 2;
    return new Rectangle([streetX, y - streetWidth / 2], [streetX + streetLength, y + streetWidth / 2]);
}

/**
 * Gives the street length of a folder node
 * @param node folder node
 * @param metric used metric
 */
function getStreetLength(node: CCNode, metric: string, depth: number): number {
    let totalLength = 0;
    let length = 0;
    let toAdd = 0;
    for (const child of node.children) {
        totalLength += getSideLength(child, metric, depth);
    }
    let halfLength = totalLength / 2;
    for (const child of node.children) {
        if (length < halfLength) {
            length += getSideLength(child, metric, depth);
        }
        toAdd = getSideLength(child, metric, depth);
    }
    return length + toAdd;
}

/**
 * Gives side length of a node. For file nodes it is one side of the square
 * For folder nodes it is street width plus width of child nodes on each side
 * @param node the node to get the side length of
 * @param metric used metric
 */
function getSideLength(node: CCNode, metric: string, depth: number): number {
    let totalSideLength = 0;
    if (node.type === "File") {
        // Size is area of the square. sqrt of size is side length.
        totalSideLength = Math.sqrt(node.size(metric));
    }
    if (node.type === "Folder") {
        totalSideLength = blockWidth(node, metric, depth);
    }
    return totalSideLength;
}

/**
 * calculates the needed width of a folder node
 * @param node a folder node to calculate the width of
 * @param metric used metric
 */
function blockWidth(node: CCNode, metric: string, depth: number): number {
    let max: number = 0;
    for (const child of node.children) {
        const actSize = child.type === "File" ? Math.sqrt(child.size(metric)) : blockWidth(child, metric, depth);
        if (actSize > max) {
            max = actSize;
        }
    }
    return max * 2 + getStreetWidth(depth);
}

/**
 * Centers a node to a given rectangle
 * @param node node with rect to reposition
 * @param rect rectangle to which the node should be aligned
 */
function center(node: TreemapNode, rect: Rectangle): TreemapNode {
    let rectCenter: [number, number] = [rect.topLeft[0] + rect.bottomRight[0] / 2, rect.topLeft[1] + rect.bottomRight[1] / 2];
    let newTopLeft: [number, number] = [rectCenter[0] - node.rectangle.width() / 2, rectCenter[1] - node.rectangle.height() / 2];
    let newBottomRight: [number, number] = [rectCenter[0] + node.rectangle.width() / 2, rectCenter[1] + node.rectangle.height() / 2];
    node.rectangle = new Rectangle(newTopLeft, newBottomRight);
    return node;
}

/**
 * Colorizes the node with the right color for its type
 * @param node node to colorize
 */
function colorize(node: CCNode): string {
    return node.type === "File" ? "LightSteelBlue" : "SteelBlue";
}

function getStreetWidth(depth: number): number {
    if (depth > 0) {
        return 5;
    }
    return 10;
}

function skipEmptyFolders(node: CCNode): CCNode {
    let ret = node;
    while (!hasFileNode(node) && node.children.length === 1) {
        ret = node.children[0];
    }
    return ret;
}

function hasFileNode(node: CCNode): boolean {
    for (const child of node.children) {
        if (child.type === "File") {
            return true;
        }
    }
    return false;
}

function calcAngle(type: string, depth: number, isFirstRow: boolean): number {
    let angle = 0;
    switch (depth) {
        case 0:
            if (isFirstRow) {
                angle = type === "Folder" ? Rotations.TRIPLEROTATION : 0;
            } else {
                angle = type === "Folder" ? Rotations.SINGLEROTATION : 0;
            }
            break;
        case 1:
            if (isFirstRow) {
                angle = type === "Folder" ? Rotations.DOUBLEROTATION : Rotations.TRIPLEROTATION;
            } else {
                angle = type === "Folder" ? 0 : Rotations.TRIPLEROTATION;
            }
            break;
        case 2:
            if (isFirstRow) {
                angle = type === "Folder" ? Rotations.SINGLEROTATION : Rotations.DOUBLEROTATION;
            } else {
                angle = type === "Folder" ? Rotations.TRIPLEROTATION : Rotations.DOUBLEROTATION;
            }
            break;
        case 3:
            if (isFirstRow) {
                angle = type === "Folder" ? 0 : Rotations.SINGLEROTATION;
            } else {
                angle = type === "Folder" ? Rotations.DOUBLEROTATION : Rotations.SINGLEROTATION;
            }
            break;
    }
    return angle;
}