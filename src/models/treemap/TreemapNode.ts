import Rectangle from "./Rectangle";
import CCNode from "../codeCharta/CCNode";

export default class TreemapNode {
    public rect: Rectangle;
    public node: CCNode;

    public constructor(rect: Rectangle, node: CCNode) {
        this.rect = rect;
        this.node = node
    }
}