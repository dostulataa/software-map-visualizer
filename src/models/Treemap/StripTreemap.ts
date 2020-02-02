import CCNode from "../codeCharta/CCNode";
import Point from "../visualization/Point";
import Rectangle from "../visualization/Rectangle";
import HorizontalStrip, { HorizontalOrder } from "./Strip/HorizontalStrip";
import SquarifiedTreemap from "./SquarifiedTreemap";
import Strip from "./Strip/Strip";

export default class StripTreemap extends SquarifiedTreemap {
    constructor(rootNode: CCNode, metric: string) {
        super(rootNode, metric);
    }

    protected createNodes(nodes: CCNode[], rect: Rectangle, rootSize: number) {
        let processed = 0;
        let currentRect = new Rectangle(new Point(rect.topLeft.x, rect.topLeft.y), rect.width, rect.height);
        let currentRootSize = rootSize;
        let order = HorizontalOrder.leftToRight;

        do {
            const currentStrip = this.createStrip(currentRect, nodes.slice(processed), currentRootSize);
            const stripSize = currentStrip.totalSize(this.metric)
            if (stripSize > 0) {
                const stripNodes = this.createStripNodes(currentStrip, currentRect, currentRootSize, order);
                this.createChildrenNodes(stripNodes);
                currentRect = this.remainingRectangle(currentRect, currentStrip, currentRootSize, currentRect.area());
                currentRootSize -= stripSize;
            }
            order = 1 - order;
            processed += currentStrip.nodes.length;
        } while (processed < nodes.length); /* as long as there are children to process */
    }

    protected createStrip(rect: Rectangle, nodes: CCNode[], rootSize: number): Strip {
        const currentStrip = new HorizontalStrip([nodes[0]]);
        currentStrip.populate(nodes.slice(1), rect, rootSize, this.metric);
        return currentStrip;
    }
}