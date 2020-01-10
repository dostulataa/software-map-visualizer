export const enum Rotation {
    SINGLEROTATION = 90,
    DOUBLEROTATION = 180,
    TRIPLEROTATION = 270
};

export default class Rectangle {
    public topLeft: [number, number];      //x and y of top left corner
    public bottomRight: [number, number];  //x and y of bottom right corner


    public constructor(topLeft: [number, number], bottomRight: [number, number]) {
        if(topLeft[0] < 0 || topLeft[1] < 0) {
            throw new Error("Rectangle's topleft can not have negative values.");
        }
        if(bottomRight[0] < 0 || bottomRight[1] < 0) {
            throw new Error("Rectangle's bottomRight can not have negative values.");
        }
        if(bottomRight[0] - topLeft[0] < 0) {
            throw new Error("Rectangle must not have negative width.");
        }
        if(bottomRight[1] - topLeft[1] < 0) {
            throw new Error("Rectangle must not have negative height.");
        }
        this.topLeft = topLeft;
        this.bottomRight = bottomRight;
    }

    public rotateAroundPoint(rotationPoint: [number, number], angle: Rotation): Rectangle {
        let topLeft: [number, number] = this.rotate(rotationPoint[0], rotationPoint[1], this.topLeft[0], this.topLeft[1], angle);
        let bottomRight: [number, number] = this.rotate(rotationPoint[0], rotationPoint[1], this.bottomRight[0], this.bottomRight[1], angle);

        switch (angle) {
            case Rotation.SINGLEROTATION:
                topLeft[0] -= this.height();
                bottomRight[0] += this.height();
                break;
            case Rotation.DOUBLEROTATION:
                const tl: [number, number] = topLeft;
                topLeft = bottomRight;
                bottomRight = tl;
                break;
            case Rotation.TRIPLEROTATION:
                topLeft[1] -= this.width();
                bottomRight[1] += this.width();
                break;
        }
        return new Rectangle(topLeft, bottomRight);
    }

    private rotate(cx: number, cy: number, x: number, y: number, angle: number): [number, number] {
        const radians = (Math.PI / 180) * angle,
            cos = Math.cos(radians),
            sin = Math.sin(radians),
            nx = (cos * (x - cx)) - (sin * (y - cy)) + cx, 
            ny = (cos * (y - cy)) + (sin * (x - cx)) + cy;
        return [nx, ny];
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

    public getTopRight(): [number, number] {
        return [this.topLeft[0] + this.width(), this.topLeft[1]];
    }

    public getBottomLeft(): [number, number] {
        return [this.bottomRight[0] - this.width(), this.bottomRight[1]];
    }
}