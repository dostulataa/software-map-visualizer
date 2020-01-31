import Rectangle from "../../models/visualization/Rectangle";
import VisualNode, { Color } from "../../models/visualization/VisualNode";
import CCNode from "../../models/codeCharta/CCNode";
import Point from "../../models/visualization/Point";

let treemapNodes: VisualNode[] = [];

/**
 * Default function for Squarified Algorithm. Prepares data for algorithm
 * and returns the boxes that have been created
 * 
 * @param nodes the nodes of a project that should be displayed
 * @param canvas rectangle in which the treemap should be placed
 * @param metric metric by which treemap nodes are scaled
 */
export default function squarify(root: CCNode, canvas: Rectangle, metric: string): VisualNode[] {
    let children: CCNode[] = root.children;
    treemapNodes.push(new VisualNode(canvas, root, Color.Folder));
    if (children.length === 0) {
        return treemapNodes;
    }
    treemap(sort(children, metric), canvas, metric, root.size(metric));
    return treemapNodes;
}

/**
 * The actual algorithm function that creates the Treemap 
 * 
 * @param children children of the node that should be displayed as a treemap
 * @param rect rectangle in which the treemap should be placed
 * @param metric metric by which treemap nodes are scaled
 * @param rootSize size of the current root element calculated by metric  
 */
function treemap(children: CCNode[], rect: Rectangle, metric: string, rootSize: number) {
    let processed = 0;
    let currentRect = new Rectangle(rect.topLeft, rect.width, rect.height);
    let currentRootSize = rootSize;

    do {
        /* Push first unprocessed child -> row is empty and aspect ratio can't be worse */
        let row: CCNode[] = [];
        row.push(children[processed]);

        /* Push new nodes to row as long as worst aspect ratio decreases or is unchanged */
        while (processed + row.length < children.length) {
            const currentScore = worst(row, currentRect, metric, currentRootSize);
            const newNode: CCNode = children[row.length + processed];
            const newScore = worst(row.concat(newNode), currentRect, metric, currentRootSize);
            if (newScore < currentScore) {
                row.push(newNode);
            } else {
                /* Node would increase worst aspect ratio, row is completed */
                break;
            }
        }

        /* Create new row of rectangles with current nodes in row */
        const rects: Rectangle[] = layoutRow(row, currentRect, metric, currentRootSize);
        processed += row.length;

        /* Start squarify algorithm for children nodes that have children of their own */
        for (let i = 0; i < row.length; i++) {
            const node = row[i];
            if (node.children.length > 0) {
                treemap(sort(node.children, metric), rects[i], metric, node.size(metric));
            }
        }
        currentRect = remainingRect(row, currentRect, metric, currentRootSize);
        currentRootSize -= totalSize(row, metric);
    } while (processed < children.length); /* as long as there are children to process */
}

/**
 * Returns the worst aspect ratio of a given row of Nodes
 * 
 * @param row current row of nodes to be layed out
 * @param rect rectangle of parent node
 * @param metric metric by which rectangle area is determined
 * @param rootSize metric size of parent node
 */
function worst(row: CCNode[], rect: Rectangle, metric: string, rootSize: number): number {
    const w = rect.shorterSide();
    const s: number = scale(totalSize(row, metric), rootSize, rect);
    const rowMax: number = max(row, rect, metric, rootSize);
    const rowMin: number = min(row, rect, metric, rootSize);
    return Math.max((w ** 2) * rowMax / (s ** 2), (s ** 2) / ((w ** 2) * rowMin));
}

/**
 * Scales the metric to the size of the parent rectangle
 * 
 * @param size size of the node
 * @param rootSize size of the parent node
 * @param rect rectangle of the parent node
 */
function scale(size: number, rootSize: number, rect: Rectangle): number {
    if (rootSize === 0) return 0;
    const scale = rect.width * rect.height / rootSize;
    return scale * size;
}

/**
 * Returns the smallest size node in a list of nodes
 * 
 * @param row current row of nodes to be layed out
 * @param rect rectangle of the parent node
 * @param metric metric by which rectangle area is determined
 * @param rootSize size of the parent node
 */
function min(row: CCNode[], rect: Rectangle, metric: string, rootSize: number): number {
    return row.reduce((min, n) => Math.min(min, scale(n.size(metric), rootSize, rect)), Number.MAX_VALUE);
}

/**
 * Returns the largest size node in a list of nodes
 * 
 * @param row current row of nodes to be layed out
 * @param rect rectangle of the parent node
 * @param metric metric by which rectangle area is determined
 * @param rootSize size of the parent node
 */
function max(row: CCNode[], rect: Rectangle, metric: string, rootSize: number): number {
    return row.reduce((max, n) => Math.max(max, scale(n.size(metric), rootSize, rect)), Number.MIN_VALUE);
}

/**
 * Returns the total size of a list of nodes (don't forget to scale size if needed)
 * 
 * @param nodes list of nodes to be examined
 * @param metric metric by which rectangle area is determined
 */
function totalSize(nodes: CCNode[], metric: string): number {
    return nodes.reduce((total, n) => total + n.size(metric), 0);
}

/**
 * Sorts input nodes by metric size
 * 
 * @param nodes list of nodes to be sorted
 * @param metric metric by which the list should be sorted
 */
function sort(nodes: CCNode[], metric: string): CCNode[] {
    return nodes.sort((a, b) => { return b.size(metric) - a.size(metric) });
}

/**
 * Calculates the remaining rectangle after a row has been layed out.
 * 
 * @param row row that has just been layed out
 * @param rect current rectangle to be trimmed
 * @param metric metric by which rectangle area is determined
 * @param rootSize metric size of rectangle
 */
function remainingRect(row: CCNode[], rect: Rectangle, metric: string, rootSize: number) {
    const w: number = rect.shorterSide();
    const totSize: number = scale(totalSize(row, metric), rootSize, rect);
    const h: number = totSize / w;
    let newRect: Rectangle;
    if (rect.isVertical()) {
        newRect = new Rectangle(new Point(rect.topLeft.x, rect.topLeft.y + h), rect.width, rect.height - h);
    } else {
        newRect = new Rectangle(new Point(rect.topLeft.x + h, rect.topLeft.y), rect.width - h, rect.height);
    }
    return newRect;
}

/**
 * Lays out new row and returns the newly created rectangles
 * 
 * @param row the row of nodes to be layed out
 * @param rect rectangle in which the row should be placed
 * @param metric metric by which rectangle area is determined
 * @param rootSize metric size of the rectangle
 */
function layoutRow(row: CCNode[], rect: Rectangle, metric: string, rootSize: number) {
    const rowSize: number = scale(totalSize(row, metric), rootSize, rect);
    const rowWidth = rect.shorterSide() > 0 ? rect.shorterSide() : 1; // row width (side of the rect on which nodes are to be laid out)
    const rowHeight: number = rowSize / rowWidth;
    let x: number = rect.topLeft.x;
    let y: number = rect.topLeft.y;
    const rects: Rectangle[] = [];

    for (const node of row) {
        let nodeW: number = scale(node.size(metric), rootSize, rect);
        const color = node.isFile() ? Color.File : Color.Folder;
        if (rowHeight !== 0) nodeW = nodeW / rowHeight;
        if (rect.isVertical()) {
            // Row is layed out horizontally
            const newRect = new Rectangle(new Point(x, y), nodeW, rowHeight);
            treemapNodes.push(new VisualNode(newRect, node, color));
            rects.push(newRect);
            x += nodeW;
        } else {
            // Row is layed out vertically
            const newRect = new Rectangle(new Point(x, y), rowHeight, nodeW);
            treemapNodes.push(new VisualNode(newRect, node, color));
            rects.push(newRect);
            y += nodeW;
        }
    }
    return rects;
}