import CCNode from "../../codeCharta/CCNode";
import Rectangle from "../../visualization/Rectangle";
import VisualNode from "../../visualization/VisualNode";

export default abstract class Strip {

    public nodes: CCNode[] = [];

    constructor(nodes: CCNode[]) {
        this.nodes = nodes;
    }

    public abstract layout(rect: Rectangle, rootSize: number, metric: string, order?: Number): VisualNode[];

    public totalScaledSize(nodes: CCNode[], metric: string, rootSize: number, rootArea: number): number {
        return nodes.reduce((total, n) => total + n.scaledSize(metric, rootSize, rootArea), 0);
    }

    public totalSize(metric: string) {
        return this.nodes.reduce((total, n) => total + n.size(metric), 0);
    }

    protected min(nodes: CCNode[], metric: string, rootSize: number, rootArea: number): number {
        return nodes.reduce((min, n) => Math.min(min, n.scaledSize(metric, rootSize, rootArea)), Number.MAX_VALUE);
    }

    protected max(nodes: CCNode[], metric: string, rootSize: number, rootArea: number): number {
        return nodes.reduce((max, n) => Math.max(max, n.scaledSize(metric, rootSize, rootArea)), Number.MIN_VALUE);
    }
}