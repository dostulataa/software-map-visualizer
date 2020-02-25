import CCNode from "../codeCharta/CCNode";
import Point from "../visualization/Point";
import VisualNode from "../visualization/VisualNode";

/**
 * Bounding box of an element in the street layout.
 */
export default abstract class Box {
    protected node: CCNode;
    public height: number = 0;
    public width: number = 0;

    constructor(node: CCNode) {
        this.node = node;
    }

    /**
     * Calculates height and width of the box.
     * @param metricName the used metric
     */
    public abstract calculateDimension(metricName: string): void;

    /**
     * Creates corresponding VisualNodes.
     * @param origin upper left point of the box
     */
    public abstract layout(origin: Point): VisualNode[];
}