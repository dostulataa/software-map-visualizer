import Rectangle from "./Rectangle";
import CCNode from "../codeCharta/CCNode";

export enum Color { Folder = "SteelBlue", File = "LightSteelBlue", Highlighted = "Black" };

export default class VisualNode {
    public rectangle: Rectangle;
    public node: CCNode;
    public color: Color;

    public constructor(rectangle: Rectangle, node: CCNode, color: Color) {
        this.rectangle = rectangle;
        this.node = node;
        this.color = color;
    }

    public isFile(): boolean {
        return this.node.isFile();
    }

    public isFolder(): boolean {
        return this.node.isFolder();
    }
}