import Rect from "./models/Rect";
import Box from "./models/Box";
import Node from "./models/Node";
import { rmdir } from "fs";

let boxes: Box[] = [];

export default function (nodes: Node[], canvas: Rect, attribute: string): Box[] {
    boxes.push(new Box(nodes[0].name, canvas, nodes[0].attributes, nodes[0].type));

    let children: Node[] | undefined = nodes[0].children;
    if (children === undefined) {
        return boxes;
    }
    children = sort(children, attribute);
    squarify(children, [], canvas.shorterSide(), attribute, canvas);
    return boxes;
}

function squarify(children: Node[], row: Node[], w: number, attribute: string, rect: Rect) {
    if (children.length === 0) {
        return;
    }
    const c: Node = children[0];
    if (row.length === 0 || worst(row.concat(c), w, attribute) <= worst(row, w, attribute)) {
        squarify(children.slice(1), row.concat(c), w, attribute, rect);
    } else {
        layoutRow(row, w, attribute, rect);
        const newRect: Rect = remainingRect(rect, row, w, attribute);
        squarify(children, [], newRect.shorterSide(), attribute, newRect);
    }
}

function remainingRect(rect: Rect, row: Node[], w: number, attribute: string) {
    const totalSize: number = rowTotalSize(row, attribute);
    const h: number = totalSize / w;
    if (rect.isVertical()) {
        return new Rect([rect.topLeft[0], rect.topLeft[1] + h], [rect.bottomRight[0], rect.bottomRight[1]]);
    } else {
        return new Rect([rect.topLeft[0] + h, rect.topLeft[1]], [rect.bottomRight[0], rect.bottomRight[1]]);
    }
}

function layoutRow(row: Node[], w: number, attribute: string, rect: Rect) {
    // total size of row
    const totalSize: number = rowTotalSize(row, attribute);
    // row height -> row boundaries are [w, h]
    const h: number = totalSize / w;
    let x: number = rect.posX();
    let y: number = rect.posY();

    for (const node of row) {
        const nodeW: number = node.size(attribute) / h;

        if (rect.isVertical()) {
            // if rectangle is vertical, row is layed out horizontally
            const newRect: Rect = new Rect([x, y], [nodeW, h]);
            boxes.push(new Box(node.name, newRect, node.attributes, node.type));
            x += newRect.width()
        } else {
            // if rectangle is horizontal, row is layed out vertically
            const newRect: Rect = new Rect([x, y], [h, nodeW]);
            boxes.push(new Box(node.name, newRect, node.attributes, node.type));
            y += newRect.height()
        }
    }
}

function worst(row: Node[], w: number, attribute: string): number {
    const s: number = rowTotalSize(row, attribute);
    const rPlus: number = max(row, attribute);
    const rMinus: number = min(row, attribute);
    console.log((s ** 2));
    return Math.max((w ** 2) * rPlus / (s ** 2), (s ** 2) / ((w ** 2) * rMinus));
}

function min(row: Node[], attribute: string) {
    return row.reduce((min, n) => Math.min(min, n.size(attribute)), Number.MAX_VALUE);
}

function max(row: Node[], attribute: string): number {
    return row.reduce((max, n) => Math.max(max, n.size(attribute)), Number.MIN_VALUE);
}

function rowTotalSize(row: Node[], attribute: string): number {
    return row.reduce((total, n) => total += n.size(attribute), 0);
}

function sort(nodes: Node[], attribute: string): Node[] {
    return nodes.sort((a, b) => { return b.size(attribute) - a.size(attribute) });
}