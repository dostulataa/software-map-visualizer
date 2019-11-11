export default class Rect {
    private _x: number;
    private _y: number;
    private _width: number;
    private _height: number;

    constructor(x: number, y: number, width: number, height: number ) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
    }

    area () : number {
        return this._width * this._width; 
    }

    circumference () : number {
        return 2 * ( this._width + this._width );
    }

    get x(): number {
        return this._x;
    }

    set x(newX: number) {
        
        if (newX === undefined) {
            throw new Error("x coordinate not defined")
        }

        if (newX <= 0) {
            throw new Error("x coordinate can not be negative");
        }
        this._x = newX;
    }

    get y(): number {
        return this._y;
    }

    set y(newY: number) {
        if (newY === undefined) {
            throw new Error("y coordinate not defined")
        }

        if (newY <= 0) {
            throw new Error("y coordinate can not be negative");
        }
        this._y = newY;
    }

    get width(): number {
        return this._width;
    }

    set width(newWidth: number) {
        if (newWidth === undefined) {
            throw new Error("width not defined")
        }

        if (newWidth <= 0) {
            throw new Error("width can not be negative");
        }
        this._width = newWidth;
    }

    get height(): number {
        return this._height;
    }

    set height(newHeight: number) {
        if (newHeight === undefined) {
            throw new Error("height not defined")
        }

        if (newHeight <= 0) {
            throw new Error("height can not be negative");
        }
        this._x = newHeight;
    }
}