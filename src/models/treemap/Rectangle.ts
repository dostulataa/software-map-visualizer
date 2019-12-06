export default class Rectangle {
    public topLeft: [number, number];      //x and y of top left corner
    public bottomRight: [number, number];  //x and y of bottom right corner


    public constructor(topLeft: [number, number], bottomRight: [number, number]) {
        if(topLeft[0] < 0 || topLeft[1] < 0) {
            throw new Error("Rectangle's topleft can not have negative values.");
        }
        if(bottomRight[0] < 0 || bottomRight[1] < 0) {
            throw new Error("Rectangle's bottomRight can not have negative values");
        }
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