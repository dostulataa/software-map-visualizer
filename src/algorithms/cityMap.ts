import Rectangle from "../models/treemap/Rectangle";
import TreemapNode from "../models/treemap/TreemapNode";
import CCNode from "../models/codeCharta/CCNode";

const STREETWIDTH = 10;
let treemapNodes: TreemapNode[] = [];

export default function start(nodes: CCNode[], canvas: Rectangle, metric: string): TreemapNode[] {
    create(nodes[0], metric, canvas, 0);
    return treemapNodes;
}

function create(root: CCNode, metric: string, rect: Rectangle, axis: number) {
    let rootNode: TreemapNode = center(new TreemapNode(new Rectangle([0, 0], [getStreetLength(root, metric), STREETWIDTH]), root, colorize(root)), rect);
    if (root.name === "root") {
        treemapNodes.push(rootNode);
        createChildren(root, rootNode, metric, axis);
    }
}

function createChildren(root: CCNode, rootNode: TreemapNode, metric: string, axis: number) {
    let currentX = rootNode.rectangle.topLeft[0];
    let currentY = rootNode.rectangle.bottomRight[1];
    let newNode;

    for (const child of root.children) {
        let topLeft: [number, number], bottomRight: [number, number];
        let sideLength = getSideLength(child, metric);

        if (child.type === "File") {
            if (axis === 0) {
                topLeft = [currentX, rootNode.rectangle.topLeft[1] - sideLength];
                currentX += sideLength;
            } else {
                topLeft = [rootNode.rectangle.bottomRight[0] - STREETWIDTH - sideLength, currentY - sideLength];
                currentY -= sideLength;
            }
            bottomRight = [topLeft[0] + sideLength, topLeft[1] + sideLength];
            newNode = new TreemapNode(new Rectangle(topLeft, bottomRight), child, colorize(child));
        } else {
            let streetLength = getStreetLength(child, metric);
            if (axis === 0) {
                let streetX = currentX + sideLength / 2 - STREETWIDTH / 2;
                topLeft = [streetX, rootNode.rectangle.topLeft[1] - streetLength];
                bottomRight = [topLeft[0] + STREETWIDTH, topLeft[1] + streetLength];
                currentX += sideLength;
            } else {
                let streetY = currentY - sideLength / 2 + STREETWIDTH / 2;
                bottomRight = [rootNode.rectangle.topLeft[0], streetY];
                topLeft = [bottomRight[0] - streetLength, bottomRight[1] - STREETWIDTH];
                currentY -= sideLength;
                console.log(new Rectangle(topLeft, bottomRight));
            }
            newNode = new TreemapNode(new Rectangle(topLeft, bottomRight), child, colorize(child));
            createChildren(child, newNode, metric, 1 - axis);
        }
        treemapNodes.push(newNode);
    }
}

function getStreetLength(node: CCNode, metric: string): number {
    let streetLength = 0;
    for (const child of node.children) {
        streetLength += getSideLength(child, metric);
    }
    return streetLength;
}

function getSideLength(node: CCNode, metric: string): number {
    let totalSideLength = 0;
    if (node.type === "File") {
        // Size is area of the square. sqrt of square is side length.
        totalSideLength = Math.sqrt(node.size(metric));
    }
    if (node.type === "Folder") {
        totalSideLength = blockWidth(node.children, metric);
    }
    return totalSideLength;
}

function blockWidth(children: CCNode[], metric: string) {
    let max: number = 0;
    for (const child of children) {
        const actSize = child.type === "File" ? Math.sqrt(child.size(metric)) : blockWidth(child.children, metric);
        if (actSize > max) {
            max = actSize;
        }
    }
    return max * 2 + STREETWIDTH;
}

function center(node: TreemapNode, rect: Rectangle) {
    let rectCenter: [number, number] = [rect.topLeft[0] + rect.bottomRight[0] / 2, rect.topLeft[1] + rect.bottomRight[1] / 2];
    let newTopLeft: [number, number] = [rectCenter[0] - node.rectangle.width() / 2, rectCenter[1] - node.rectangle.height() / 2];
    let newBottomRight: [number, number] = [rectCenter[0] + node.rectangle.width() / 2, rectCenter[1] + node.rectangle.height() / 2];
    node.rectangle = new Rectangle(newTopLeft, newBottomRight);
    return node;
}

function colorize(node: CCNode): string {
    return node.type === "File" ? "LightSteelBlue" : "SteelBlue";
}