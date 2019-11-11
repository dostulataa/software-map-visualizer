import Rect from "./rect";

export default class Box {
    private _name: string;
    private _rect: Rect;
    private _parameters: Map<string, string>;

    constructor(name: string, rect: Rect, parameters: Map<string, string> ) {
        this._name = name;
        this._rect = rect;
        this._parameters = parameters;
    }

    get name(): string {
        return this._name;
    }

    set name(newName: string) {
        this._name = newName;
    }

    get rect(): Rect {
        return this._rect;
    }

    get parameters(): Map<string, string> {
        return this._parameters;
    }
}