import Rectangle from "./Rectangle";
import Node from "../codeCharta/Node";

export default class TreemapNode {
    public rect: Rectangle;
    public node: Node;

    public constructor(rect: Rectangle, node: Node) {
        this.rect = rect;
        this.node = node
    }
}