import Box from "./Box";
import CCNode from "../codeCharta/CCNode"
import Point from "../visualization/Point";
import Rectangle from "../visualization/Rectangle";
import VisualizationNode from "../visualization/VisualizationNode";

export default class House extends Box {

    private COLOR = "LightSteelBlue";

    constructor(node: CCNode) {
        super(node);
    }

    public layout(metric: string): void {
        const size = this.node.size(metric);
        this.height = Math.sqrt(size);
        this.width = Math.sqrt(size);
    }

    public draw(origin: Point): VisualizationNode[] {
        const newNode = new VisualizationNode(new Rectangle(new Point(origin.x, origin.y), this.width, this.height), this.node, this.COLOR);
        return [newNode];
    }
}