import Rect from "./models/Rect";
import Box from "./models/Box";
import Node from "./models/Node";

let boxes: Box[] = [];

/**
 * 
 * Default function for Squarified Algorithm. Prepares data for algorithm
 * and returns the boxes that have been created
 * 
 * @param nodes the nodes of a project that should be displayed
 * @param canvas rectangle in which the treemap should be placed
 * @param attribute attribute by which nodes are scaled
 */
export default function (nodes: Node[], canvas: Rect, attribute: string): Box[] {
    let root = nodes[0];
    let children: Node[] | undefined = root.children;
    boxes.push(new Box(root.name, canvas, root.attributes, root.type));
    if (children === undefined) {
        return boxes;
    }
    children = sort(children, attribute);
    squarify(children, canvas, attribute, root.size(attribute));
    return boxes;
}

/**
 * 
 * The actual algorithm function that creates the Treemap 
 * 
 * @param children children of the node that should be displayed as a treemap
 * @param rect rectangle in which the treemap should be placed
 * @param attribute attribute by which nodes are scaled
 * @param rootSize 
 */
function squarify(children: Node[], rect: Rect, attribute: string, rootSize: number) {
    let processed = 0;

    do {
        /* Push first unprocessed child -> row is empty and aspect ratio can't be worse */
        let row: Node[] = [];
        row.push(children[processed]);

        /* Push new nodes to row as long as worst aspect ratio decreases or is unchanged */
        while (processed + row.length < children.length) {
            const currentScore = worst(row, rect, attribute, rootSize);
            const newNode: Node = children[row.length + processed];
            const newScore = worst(row.concat(newNode), rect, attribute, rootSize);
            if (newScore <= currentScore) {
                row.push(newNode);
            } else {
                /* Node would increase worst aspect ratio, row is completed */
                break;
            }
        }

        /* Create new row of rectangles with current nodes in row */
        const rects: Rect[] = layoutRow(row, rect, attribute, rootSize);
        processed += row.length;

        /* Start squarify algorithm for children nodes that have children of their own */
        for (let i = 0; i < row.length; i++) {
            const node: Node = row[i];
            if (node.children) {
                squarify(node.children, rects[i], attribute, node.size(attribute));
            }
        }
        rect = remainingRect(row, rect, attribute, rootSize);
        rootSize -= totalSize(row, attribute);
    } while (processed < children.length); /* as long as there are children to process */
}

/**
 * Returns the worst aspect ratio of a given row of Nodes
 * 
 * @param row current row of nodes to be layed out
 * @param rect rectangle of parent node
 * @param attribute attribute by which rectangle area is determined
 * @param rootSize attribute size of parent node
 */
function worst(row: Node[], rect: Rect, attribute: string, rootSize: number): number {
    const w = rect.shorterSide();
    const s: number = scale(totalSize(row, attribute), rootSize, rect);
    const rowMax: number = max(row, rect, attribute, rootSize);
    const rowMin: number = min(row, rect, attribute, rootSize);
    return Math.max((w ** 2) * rowMax / (s ** 2), (s ** 2) / ((w ** 2) * rowMin));
}

/**
 * 
 * Scales the attribute to the size of the parent rectangle
 * 
 * @param size size of the node
 * @param rootSize size of the parent node
 * @param rect rectangle of the parent node
 */
function scale(size: number, rootSize: number, rect: Rect): number {
    const scale = rect.width() * rect.height() / rootSize;
    return scale * size;
}

/**
 * 
 * Returns the smallest size node in a list of nodes
 * 
 * @param row current row of nodes to be layed out
 * @param rect rectangle of the parent node
 * @param attribute attribute by which rectangle area is determined
 * @param rootSize size of the parent node
 */
function min(row: Node[], rect: Rect, attribute: string, rootSize: number): number {
    return row.reduce((min, n) => Math.min(min, scale(n.size(attribute), rootSize, rect)), Number.MAX_VALUE);
}

/**
 * 
 * Returns the largest size node in a list of nodes
 * 
 * @param row current row of nodes to be layed out
 * @param rect rectangle of the parent node
 * @param attribute attribute by which rectangle area is determined
 * @param rootSize size of the parent node
 */
function max(row: Node[], rect: Rect, attribute: string, rootSize: number): number {
    return row.reduce((max, n) => Math.max(max, scale(n.size(attribute), rootSize, rect)), Number.MIN_VALUE);
}

/**
 * 
 * Returns the total size of a list of nodes (don't forget to scale size if needed)
 * 
 * @param nodes list of nodes to be examined
 * @param attribute attribute by which rectangle area is determined
 */
function totalSize(nodes: Node[], attribute: string): number {
    return nodes.reduce((total, n) => total += n.size(attribute), 0);
}

/**
 * 
 * Sorts input nodes by attribute size
 * 
 * @param nodes list of nodes to be sorted
 * @param attribute attribute by which the list should be sorted
 */
function sort(nodes: Node[], attribute: string): Node[] {
    return nodes.sort((a, b) => { return b.size(attribute) - a.size(attribute) });
}

/**
 * 
 * Calculates the remaining rectangle after a row has been layed out.
 * 
 * @param row row that has just been layed out
 * @param rect current rectangle to be trimmed
 * @param attribute attribute by which rectangle area is determined
 * @param rootSize attribute size of rectangle
 */
function remainingRect(row: Node[], rect: Rect, attribute: string, rootSize: number) {
    const w: number = rect.shorterSide();
    const totSize: number = scale(totalSize(row, attribute), rootSize, rect);
    const h: number = totSize / w;
    let newRect: Rect;
    if (rect.isVertical()) {
        newRect = new Rect([rect.topLeft[0], rect.topLeft[1] + h], [rect.bottomRight[0], rect.bottomRight[1]]);
    } else {
        newRect = new Rect([rect.topLeft[0] + h, rect.topLeft[1]], [rect.bottomRight[0], rect.bottomRight[1]]);
    }
    return newRect;
}

/**
 * 
 * Lays out new row and returns the newly created rectangles
 * 
 * @param row the row of nodes to be layed out
 * @param attribute attribute by which rectangle area is determined
 * @param rect rectangle in which the row should be placed
 * @param rootSize attribute size of the rectangle
 */
function layoutRow(row: Node[], rect: Rect, attribute: string, rootSize: number) {
    const rowSize: number = scale(totalSize(row, attribute), rootSize, rect);
    const w = rect.shorterSide(); // row width (side of the rect on which nodes are to be laid out)
    const h: number = rowSize / w; // row height
    let x: number = rect.posX();
    let y: number = rect.posY();
    const rects: Rect[] = [];

    for (const node of row) {
        const nodeW: number = scale(node.size(attribute), rootSize, rect) / h;
        if (rect.isVertical()) {
            // if rectangle is vertical, row is layed out horizontally
            const newRect: Rect = new Rect([x, y], [x + nodeW, y + h]);
            boxes.push(new Box(node.name, newRect, node.attributes, node.type));
            rects.push(newRect);
            x += nodeW;
        } else {
            // if rectangle is horizontal, row is layed out vertically
            const newRect: Rect = new Rect([x, y], [x + h, y + nodeW]);
            boxes.push(new Box(node.name, newRect, node.attributes, node.type));
            rects.push(newRect);
            y += nodeW;
        }
    }

    return rects;
}