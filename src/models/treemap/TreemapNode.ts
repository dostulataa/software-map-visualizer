import Rectangle from "./Rectangle";
import CCNode from "../codeCharta/CCNode";

export default class TreemapNode {
    public rectangle: Rectangle;
    public node: CCNode;

    public constructor(rectangle: Rectangle, node: CCNode) {
        this.rectangle = rectangle;
        this.node = node
    }
}