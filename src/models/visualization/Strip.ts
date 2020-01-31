import CCNode from "../codeCharta/CCNode";
import Rectangle from "./Rectangle";
import Point from "./Point";
import VisualNode, { Color } from "./VisualNode";

export enum Order {
    leftToRight = 0,
    rightToLeft = 1
};

export default class Strip {

    public nodes: CCNode[] = [];

    constructor(node: CCNode) {
        this.nodes = [node];
    }

    public layout(rect: Rectangle, rootSize: number, metric: string, order: Order): VisualNode[] {
        let x = rect.topLeft.x;
        const nodes = order === Order.leftToRight ? this.nodes : this.nodes.reverse();
        const rootArea = rect.area();
        const width = rect.width;
        const height = this.totalScaledSize(nodes, metric, rootSize, rootArea) / width;
        const treemapNodes: VisualNode[] = [];
        for (const node of nodes) {
            const nodeSize = node.scaledSize(metric, rootSize, rootArea);
            const nodeWidth = height > 0 ? nodeSize / height : 0;
            const newRect = new Rectangle(new Point(x, rect.topLeft.y), nodeWidth, height);
            const color = node.isFile() ? Color.File : Color.Folder;
            treemapNodes.push(new VisualNode(newRect, node, color));
            x += nodeWidth;
        }
        return treemapNodes;
    }

    public worstAspectRatio(nodes: CCNode[], rect: Rectangle, rootSize: number, metric: string): number {
        const width = rect.width;
        const rootArea = rect.area();
        const totalSize = this.totalScaledSize(nodes, metric, rootSize, rootArea);
        const stripMin = this.min(nodes, metric, rootSize, rootArea);
        const stripMax = this.max(nodes, metric, rootSize, rootArea);
        return Math.max((width ** 2) * stripMax / (totalSize ** 2), (totalSize ** 2) / ((width ** 2) * stripMin));
    }

    public totalScaledSize(nodes: CCNode[], metric: string, rootSize: number, rootArea: number): number {
        return nodes.reduce((total, n) => total + n.scaledSize(metric, rootSize, rootArea), 0);
    }

    public totalSize(metric: string) {
        return this.nodes.reduce((total, n) => total + n.size(metric), 0);
    }

    private min(nodes: CCNode[], metric: string, rootSize: number, rootArea: number): number {
        return nodes.reduce((min, n) => Math.min(min, n.scaledSize(metric, rootSize, rootArea)), Number.MAX_VALUE);
    }

    private max(nodes: CCNode[], metric: string, rootSize: number, rootArea: number): number {
        return nodes.reduce((max, n) => Math.max(max, n.scaledSize(metric, rootSize, rootArea)), Number.MIN_VALUE);
    }
}