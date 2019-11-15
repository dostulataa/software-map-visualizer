import Rect from "./Rect";

export default class Box {
    name: string;
    rect: Rect;
    attributes: Map<string, number>;
    type : string

    constructor(name: string, rect: Rect, attributes: Map<string, number>, type: string) {
        this.name = name;
        this.rect = rect;
        this.attributes = attributes;
        this.type = type;
    }
}