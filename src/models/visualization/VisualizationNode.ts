import Rectangle from "./Rectangle";
import CCNode from "../codeCharta/CCNode";

// REVIEW: könnte man zu VisualNode verkürzen
export default class VisualizationNode {
    public rectangle: Rectangle;
    public node: CCNode;
    public color: string;

    public constructor(rectangle: Rectangle, node: CCNode, color: string) {
        this.rectangle = rectangle;
        this.node = node;
        this.color = color;
    }
}