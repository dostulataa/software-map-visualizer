import Box, { Colors } from "./Box";
import CCNode from "../codeCharta/CCNode"
import Point from "../visualization/Point";
import Rectangle from "../visualization/Rectangle";
import VisualNode from "../visualization/VisualNode";

export default class House extends Box {

    constructor(node: CCNode) {
        super(node);
    }

    public calculateDimension(metric: string): void {
        const size = this.node.size(metric);
        this.width = Math.sqrt(size);
        this.height = Math.sqrt(size);
    }

    public layout(origin: Point): VisualNode[] {
        const newNode = new VisualNode(new Rectangle(new Point(origin.x, origin.y), this.width, this.height), this.node, Colors.HouseColor);
        return [newNode];
    }
}