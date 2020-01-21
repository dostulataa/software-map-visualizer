import CCNode from "../codeCharta/CCNode";
import Point from "../visualization/Point";
import VisualizationNode from "../visualization/VisualizationNode";

// REVIEW: ich würde hier erklären was eine Box ist.
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
    // REVIEW: layout ist eigentlich mehr als width und height-Berechnung.
    // Dazu gehört auch die Positionierung von Knoten.
    // Deshalb würde ich die Funktion eher calculateDimension() oder so nennen
    public abstract layout(metric: string): void;

    /**
     * Creates VisualizationNode for the box.
     * @param origin 
     */
    // REVIEW: this is the actual layout()
    public abstract draw(origin: Point): VisualizationNode[];
}