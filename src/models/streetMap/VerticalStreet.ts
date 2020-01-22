import Box from "./Box";
import CCNode from "../codeCharta/CCNode";
import Rectangle from "../visualization/Rectangle";
import Point from "../visualization/Point";
import VisualizationNode from "../visualization/VisualizationNode";
import HorizontalStreet, { HorizontalOrientation } from "./HorizontalStreet";

export enum VerticalOrientation { UP, DOWN };

export default class VerticalStreet extends Box {
    private children: Box[] = [];
    private leftRow: Box[] = [];
    private rightRow: Box[] = [];
    private STREET_WIDTH = 5;
    private COLOR = "SteelBlue";
    private SPACER = 2;
    public orientation: VerticalOrientation;

    constructor(node: CCNode, children: Box[], orientation: VerticalOrientation = VerticalOrientation.UP) {
        super(node);
        this.children = children;
        this.orientation = orientation;
    }

    public layout(metric: string): void {
        //Layout all children
        for (const child of this.children) {
            child.layout(metric);
        }

        //Divide children in leftRow and rightRow
        this.setRows(this.children);

        if (this.orientation === VerticalOrientation.UP) {
            this.leftRow = this.leftRow.reverse();
        } else {
            this.rightRow = this.rightRow.reverse();
        }

        //Set width and height of box
        this.width = this.getMaxWidth(this.leftRow) + this.STREET_WIDTH + this.getMaxWidth(this.rightRow) + 2 * this.SPACER;
        this.height = Math.max(this.getLength(this.leftRow), this.getLength(this.rightRow));
    }

    public draw(origin: Point): VisualizationNode[] {
        const maxLeftWidth = this.getMaxWidth(this.leftRow);
        const rightStart = origin.x + maxLeftWidth + this.STREET_WIDTH;
        let nodes: VisualizationNode[] = [];
        //nodes.push(new VisualizationNode(new Rectangle(origin, this.width, this.height), this.node, "grey"));

        //Draw leftRow
        for (let i = 0; i < this.leftRow.length; i++) {
            nodes.push.apply(nodes, this.leftRow[i].draw(new Point(origin.x + this.SPACER + (maxLeftWidth - this.leftRow[i].width), origin.y + this.getLengthUntil(this.leftRow, i))));
        }

        //Draw street
        nodes.push(new VisualizationNode(new Rectangle(new Point(origin.x + this.SPACER + maxLeftWidth, origin.y), this.STREET_WIDTH, this.height), this.node, this.COLOR));

        //Draw rightRow
        for (let i = 0; i < this.rightRow.length; i++) {
            nodes.push.apply(nodes, this.rightRow[i].draw(new Point(rightStart + this.SPACER, origin.y + this.getLengthUntil(this.rightRow, i))));
        }

        return nodes;
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
            sum += boxes[i].height;
        }
        return sum;
    }

    /**
     * Divides children nodes into top- and bottomrow
     * @param children children of the current node
     */
    private setRows(children: Box[]) {
        const totalLength = this.getLength(children);
        let sum = 0;

        for (let i = 0; i < children.length; i++) {
            if (sum < totalLength / 2) {
                if (children[i] instanceof HorizontalStreet) {
                    (<HorizontalStreet>children[i]).orientation = HorizontalOrientation.LEFT;
                }
                this.leftRow.push(children[i]);
                sum += children[i].height;
            } else {
                this.rightRow.push(children[i]);
            }
        }
    }

    /**
     * Gets the widest box of an array of boxes.
     * @param boxes boxes to be checked
     */
    private getMaxWidth(boxes: Box[]): number {
        return boxes.reduce((max, n) => Math.max(max, n.width), Number.MIN_VALUE);
    }
}