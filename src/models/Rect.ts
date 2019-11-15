export default class Rect {
    //x and y of top left corner
    p: [number, number];
    //x and y of bottom right corner
    q: [number, number];

    constructor(p: [number, number], q: [number, number]) {
        this.p = p;
        this.q = q;
    }

    width(): number {
        return this.q[0] - this.p[0];
    }

    height(): number {
        return this.q[1] - this.p[1];
    }

    posX(): number {
        return this.p[0];
    }

    posY(): number {
        return this.p[1];
    }
}