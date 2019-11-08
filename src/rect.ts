export default class Rect {
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    area () {
        return this.width * this.height; 
    }

    circumference () {
        return 2 * (this.width + this.height);
    }
}