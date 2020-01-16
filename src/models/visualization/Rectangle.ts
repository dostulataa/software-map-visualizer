import Point from "./Point";

export default class Rectangle {
    public topLeft: Point;
    public width: number;
    public height: number;
    
    constructor(topLeft: Point, width: number, height: number) {
        this.topLeft = topLeft;
        this.width = width;
        this.height = height;
    }
    
    public shorterSide(): number {
        return this.width > this.height ? this.height : this.width;
    }

    public isVertical(): boolean {
        return this.height > this.width;
    }
}