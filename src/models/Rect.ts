export default class Rect {
    //x and y of top left corner
    topLeft: [number, number];
    //x and y of bottom right corner
    bottomRight: [number, number];

    constructor(topLeft: [number, number], bottomRight: [number, number]) {
        this.topLeft = topLeft;
        this.bottomRight = bottomRight;
    }

    width(): number {
        return this.bottomRight[0] - this.topLeft[0];
    }

    height(): number {
        return this.bottomRight[1] - this.topLeft[1];
    }

    posX(): number {
        return this.topLeft[0];
    }

    posY(): number {
        return this.topLeft[1];
    }

    shorterSide(): number {
        return this.width() > this.height() ? this.height() : this.width();
    }

    longerSide(): number {
        return this.width() > this.height() ? this.width() : this.height();
    }

    aspectRatio(): number {
        return this.longerSide() / this.shorterSide();
    }

    isVertical(): boolean {
        return this.height() < this.width();
    }
}