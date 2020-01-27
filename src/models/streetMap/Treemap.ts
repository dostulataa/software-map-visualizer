import Box from "./Box"
import Point from "../visualization/Point";
import VisualNode from "../visualization/VisualNode";
import CCNode from "../codeCharta/CCNode";
import strip from "../../algorithms/strip";
import Rectangle from "../visualization/Rectangle";

export default class Treemap extends Box {
    private metric: string;

    constructor(node: CCNode, metric: string) {
        super(node);
        this.metric = metric;
    }

    public calculateDimension(metric: string): void {
        const size = this.node.size(metric);
        this.width = Math.sqrt(size);
        this.height = Math.sqrt(size);
    }

    public layout(origin: Point): VisualNode[] {
        const rectangle = new Rectangle(origin, this.width, this.height);
        return strip(this.node, rectangle, this.metric);
    }
}