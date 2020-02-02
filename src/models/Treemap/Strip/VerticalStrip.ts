import CCNode from "../../codeCharta/CCNode";
import Rectangle from "../../visualization/Rectangle";
import Point from "../../visualization/Point";
import VisualNode, { Color } from "../../visualization/VisualNode";
import Strip from "./Strip";

export enum VerticalOrder {
    topToBottom = 0,
    bottomToTop = 1
};

export default class VerticalStrip extends Strip {

    constructor(nodes: CCNode[]) {
        super(nodes);
    }

    public layout(rect: Rectangle, rootSize: number, metric: string, order: VerticalOrder = VerticalOrder.topToBottom): VisualNode[] {
        let offsetY = rect.topLeft.y;
        const nodes = order === VerticalOrder.topToBottom ? this.nodes : this.nodes.reverse();
        const rootArea = rect.area();
        const height = rect.height;
        const width = this.totalScaledSize(nodes, metric, rootSize, rootArea) / height;
        const treemapNodes: VisualNode[] = [];
        for (const node of nodes) {
            const nodeSize = node.scaledSize(metric, rootSize, rootArea);
            const nodeHeight = width > 0 ? nodeSize / width : 0;
            const newRect = new Rectangle(new Point(rect.topLeft.x, offsetY), width, nodeHeight);
            const color = node.isFile() ? Color.File : Color.Folder;
            treemapNodes.push(new VisualNode(newRect, node, color));
            offsetY += nodeHeight;
        }
        return treemapNodes;
    }

    public worstAspectRatio(nodes: CCNode[], rect: Rectangle, rootSize: number, metric: string): number {
        const height = rect.height;
        const rootArea = rect.area();
        const totalSize = this.totalScaledSize(nodes, metric, rootSize, rootArea);
        const stripMin = this.min(nodes, metric, rootSize, rootArea);
        const stripMax = this.max(nodes, metric, rootSize, rootArea);
        return Math.max((height ** 2) * stripMax / (totalSize ** 2), (totalSize ** 2) / ((height ** 2) * stripMin));
    }

    public populate(nodes: CCNode[], rect: Rectangle, rootSize: number, metric: string) {
        for(let node of nodes) {
            const score = this.worstAspectRatio(this.nodes, rect, rootSize, metric);
            const newScore = this.worstAspectRatio(this.nodes.concat(node), rect, rootSize, metric);
            if (newScore < score) {
                this.nodes.push(node);
            } else {
                /* Node would increase worst aspect ratio, strip is completed */
                break;
            }
        }
    }
}