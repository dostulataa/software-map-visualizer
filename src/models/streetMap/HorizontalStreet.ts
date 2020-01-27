import CCNode from "../codeCharta/CCNode";
import Point from "../visualization/Point";
import Rectangle from "../visualization/Rectangle";
import VisualNode from "../visualization/VisualNode";
import Box, { Color } from "./Box";
import VerticalStreet, { VerticalOrientation } from "./VerticalStreet";

export enum HorizontalOrientation { RIGHT, LEFT }

export default class HorizontalStreet extends Box {
    private depth: number;
    private children: Box[] = [];
    private topRow: Box[] = [];
    private bottomRow: Box[] = [];
    private STREET_HEIGHT = 10;
    private SPACER = 2;
    public orientation: HorizontalOrientation;

    constructor(node: CCNode, children: Box[], depth: number, orientation: HorizontalOrientation = HorizontalOrientation.RIGHT) {
        super(node);
        this.children = children;
        this.depth = depth;
        this.orientation = orientation;
    }

    public calculateDimension(metric: string): void {
        //Calculate dimensions of all children
        for (const child of this.children) {
            child.calculateDimension(metric);
        }

        this.splitChildrenToRows(this.children);
        this.rearrangeRows();

        //Set width and hight of box
        this.width = Math.max(this.getLength(this.topRow), this.getLength(this.bottomRow));
        this.height = this.getMaxHeight(this.topRow) + this.getStreetHeight() + this.getMaxHeight(this.bottomRow) + 2 * this.SPACER;
    }

    public layout(origin: Point): VisualNode[] {
        const maxTopHeight = this.getMaxHeight(this.topRow);
        const topRowNodes = this.layoutTopRow(origin, maxTopHeight);
        const streetNode = this.layoutStreet(origin, maxTopHeight);
        const bottomRowNodes = this.layoutBottomRow(origin, maxTopHeight);
        return [...topRowNodes, streetNode, ...bottomRowNodes];
    }

    /**
     * Creates the layout for the topRow.
     * @param origin origin of local coordinate system
     * @param maxTopHeight highest node in top row
     */
    private layoutTopRow(origin: Point, maxTopHeight: number): VisualNode[] {
        const nodes: VisualNode[] = [];
        for (let i = 0; i < this.topRow.length; i++) {
            const childOriginX = this.calculateChildOriginX(origin, i, this.topRow)
            const childOriginY = this.calculateStreetOffsetY(origin, maxTopHeight) - this.topRow[i].height;
            const childOrigin = new Point(childOriginX, childOriginY);
            nodes.push.apply(nodes, this.topRow[i].layout(childOrigin));
        }
        return nodes;
    }

    /**
     * Creates the layout for the street node.
     * @param origin origin of local coordinate system
     * @param maxTopHeight highest node in top row
     */
    private layoutStreet(origin: Point, maxTopHeight: number): VisualNode {
        const streetOffsetY = this.calculateStreetOffsetY(origin, maxTopHeight);
        const streetOrigin = new Point(origin.x, streetOffsetY);
        const streetRectangle = new Rectangle(streetOrigin, this.width, this.getStreetHeight())
        return new VisualNode(streetRectangle, this.node, Color.StreetColor);
    }

    /**
     * Creates the layout for the bottomRow.
     * @param origin origin of local coordinate system
     * @param maxTopHeight highest node in top row
     */
    private layoutBottomRow(origin: Point, maxTopHeight: number): VisualNode[] {
        const nodes: VisualNode[] = [];
        for (let i = 0; i < this.bottomRow.length; i++) {
            const childOriginX = this.calculateChildOriginX(origin, i, this.bottomRow);
            const childOriginY = this.calculateStreetOffsetY(origin, maxTopHeight) + this.getStreetHeight();
            const childOrigin = new Point(childOriginX, childOriginY)
            nodes.push.apply(nodes, this.bottomRow[i].layout(childOrigin));
        }
        return nodes;
    }

    /**
     * Calculates x-coordinate of current child
     * @param origin origin of local coordinate system
     * @param index index in row of current node
     * @param row the node's row
     */
    private calculateChildOriginX(origin: Point, index: number, row: Box[]): number {
        return origin.x + this.getLengthUntil(row, index);
    }

    /**
     * Calculates y-coordinate of street.
     * @param origin origin of local coordinate system
     * @param maxLeftWidth highest node in topRow
     */
    private calculateStreetOffsetY(origin: Point, maxTopHeight: number): number {
        return origin.y + this.SPACER + maxTopHeight;
    }

    /**
     * Gets total length of the street.
     * @param boxes placed boxes
     */
    private getLength(boxes: Box[]): number {
        return this.getLengthUntil(boxes, boxes.length);
    }

    /**
     * Gets length of street from start to end index.
     * @param boxes placed boxes
     * @param end end index
     */
    private getLengthUntil(boxes: Box[], end: number): number {
        let sum: number = 0;
        for (let i = 0; i < end; i++) {
            sum += boxes[i].width;
        }
        return sum;
    }

    /**
     * Divides children nodes into top- and bottomrow
     * @param children children of the current node
     */
    private splitChildrenToRows(children: Box[]): void {
        const totalLength = this.getLength(children);
        let sum = 0;

        for (let i = 0; i < children.length; i++) {
            if (sum < totalLength / 2) {
                this.topRow.push(children[i]);
                sum += children[i].width;
            } else {
                if (children[i] instanceof VerticalStreet) {
                    (<VerticalStreet>children[i]).orientation = VerticalOrientation.DOWN;
                }
                this.bottomRow.push(children[i]);
            }
        }
    }

    /**
     * Arranges rows according to their orientation
     */
    private rearrangeRows(): void {
        if (this.orientation === HorizontalOrientation.RIGHT) {
            this.bottomRow = this.bottomRow.reverse();
        } else {
            this.topRow = this.topRow.reverse();
        }
    }

    /**
     * Gets the highest box of an array of boxes.
     * @param boxes boxes to be checked
     */
    private getMaxHeight(boxes: Box[]): number {
        return boxes.reduce((max, n) => Math.max(max, n.height), Number.MIN_VALUE);
    }

    private getStreetHeight(): number {
        let streetHeight = this.STREET_HEIGHT;
        if (this.depth < this.STREET_HEIGHT) {
            streetHeight -= 3 * this.depth;
        } else {
            streetHeight = 1;
        }
        return streetHeight;
    }
}