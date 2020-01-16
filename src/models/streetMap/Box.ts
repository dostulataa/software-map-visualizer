import CCNode from "../codeCharta/CCNode";
import Point from "../visualization/Point";
import VisualizationNode from "../visualization/VisualizationNode";

export default abstract class Box {
    public node: CCNode;
    public height: number = 0;
    public width: number = 0;

    constructor(node: CCNode) {
        this.node = node;
    }
    /**
     * Calculates height and width of the box.
     * @param metric 
     */
    public abstract layout(metric: string): void;

    /**
     * Creates VisualizationNode for the box.
     * @param origin 
     */
    public abstract draw(origin: Point): VisualizationNode[];
}