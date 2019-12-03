export default class Rectangle {
    public topLeft: [number, number];      //x and y of top left corner
    public bottomRight: [number, number];  //x and y of bottom right corner


    public constructor(topLeft: [number, number], bottomRight: [number, number]) {
        this.topLeft = topLeft;
        this.bottomRight = bottomRight;
    }

    public width(): number {
        return this.bottomRight[0] - this.topLeft[0];
    }

    public height(): number {
        return this.bottomRight[1] - this.topLeft[1];
    }

    public posX(): number {
        return this.topLeft[0];
    }

    public posY(): number {
        return this.topLeft[1];
    }

    public shorterSide(): number {
        return this.width() > this.height() ? this.height() : this.width();
    }

    public isVertical(): boolean {
        return this.height() > this.width();
    }
}