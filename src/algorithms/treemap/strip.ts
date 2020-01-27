import CCNode from "../../models/codeCharta/CCNode";
import Rectangle from "../../models/visualization/Rectangle";
import VisualNode from "../../models/visualization/VisualNode";
import Strip, { Order } from "../../models/visualization/Strip";
import Point from "../../models/visualization/Point";

export enum Color { Folder = "SteelBlue", File = "LightSteelBlue" }

let treemapNodes: VisualNode[] = [];

export default function strip(root: CCNode, canvas: Rectangle, metric: string): VisualNode[] {
    treemapNodes.push(new VisualNode(canvas, root, Color.Folder));
    const children = root.children;
    if (children.length === 0) return treemapNodes;
    treemap(children, canvas, metric, root.size(metric));
    return treemapNodes;
}

function treemap(children: CCNode[], rect: Rectangle, metric: string, rootSize: number) {
    let processed = 0;
    let currentRect = new Rectangle(new Point(rect.topLeft.x, rect.topLeft.y), rect.width, rect.height);
    let currentRootSize = rootSize;
    let order = Order.leftToRight;

    do {
        const currentStrip = populateStrip(children, processed, currentRect, currentRootSize, metric);

        /* Create new row of rectangles with current nodes in strip */
        const nodes = currentStrip.layout(currentRect, currentRootSize, metric, order);
        treemapNodes.push(...nodes);

        /* Start algorithm for children nodes that have children of their own */
        for (let i = 0; i < currentStrip.nodes.length; i++) {
            const node = currentStrip.nodes[i];
            if (node.children.length > 0) {
                treemap(node.children, nodes[i].rectangle, metric, node.size(metric));
            }
        }

        order = 1 - order;
        processed += currentStrip.nodes.length;
        currentRect = remainingRectangle(currentRect, currentStrip, currentRootSize, currentRect.area(), metric);
        currentRootSize = remainingRootSize(currentRootSize, currentStrip, metric);
    } while (processed < children.length); /* as long as there are children to process */
}

function remainingRectangle(rect: Rectangle, strip: Strip, parentSize: number, parentArea: number, metric: string): Rectangle {
    const stripSize = strip.totalScaledSize(strip.nodes, metric, parentSize, parentArea);
    const stripHeight = stripSize / rect.width;
    const newOrigin = new Point(rect.topLeft.x, rect.topLeft.y + stripHeight);
    return new Rectangle(newOrigin, rect.width, rect.height - stripHeight);
}

function remainingRootSize(rootSize: number, strip: Strip, metric: string) {
    const stripSize = strip.totalSize(metric);
    return rootSize - stripSize;
}

function populateStrip(children: CCNode[], processed: number, currentRect: Rectangle, currentRootSize: number, metric: string) {
    let newStrip = new Strip(children[processed]);

    /* Push new nodes to strip as long as worst aspect ratio decreases or is unchanged */
    while (processed + newStrip.nodes.length < children.length) {
        const score = newStrip.worstAspectRatio(newStrip.nodes, currentRect, currentRootSize, metric);
        const node = children[newStrip.nodes.length + processed];
        const newScore = newStrip.worstAspectRatio(newStrip.nodes.concat(node), currentRect, currentRootSize, metric);
        if (newScore < score) {
            newStrip.nodes.push(node);
        } else {
            /* Node would increase worst aspect ratio, strip is completed */
            break;
        }
    }
    return newStrip;
}