import CCNode from "../codeCharta/CCNode";
import Point from "../visualization/Point";
import VisualNode from "../visualization/VisualNode";

export enum Color { StreetColor = "SteelBlue", HouseColor = "LightSteelBlue" };

/**
 * Bounding box of an element in the street layout.
 */
export default abstract class Box {
    public node: CCNode;
    public height: number = 0;
    public width: number = 0;

    constructor(node: CCNode) {
        this.node = node;
    }

    /**
     * Calculates height and width of the box and assigns nodes to rows.
     * @param metric 
     */
    public abstract calculateDimension(metric: string): void;

    /**
     * Creates VisualizationNode for the box.
     * @param origin 
     */
    public abstract layout(origin: Point): VisualNode[];
}