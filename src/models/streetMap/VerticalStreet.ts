import Box from "./Box";
import CCNode from "../codeCharta/CCNode";
import Rectangle from "../visualization/Rectangle";
import Point from "../visualization/Point";
import VisualizationNode from "../visualization/VisualizationNode";

export default class VerticalStreet extends Box {

    private children: Box[] = [];
    private leftRow: Box[] = [];
    private rightRow: Box[] = [];
    private STREET_WIDTH = 5;
    private COLOR = "SteelBlue";

    constructor(node: CCNode, children: Box[]) {
        super(node);
        this.children = children;
    }

    public layout(metric: string): void {

        //Layout all children
        for (const child of this.children) {
            child.layout(metric);
        }

        //Divide children in leftRow and rightRow
        this.setRows(this.children);

        //Set width and height of box
        this.width = this.getMaxWidth(this.leftRow) + this.STREET_WIDTH + this.getMaxWidth(this.rightRow);
        this.height = Math.max(this.getLength(this.leftRow), this.getLength(this.rightRow));
    }

    public draw(origin: Point): VisualizationNode[] {
        const maxLeftWidth = this.getMaxWidth(this.leftRow);
        const rightStart = origin.x + maxLeftWidth + this.STREET_WIDTH;
        let nodes: VisualizationNode[] = [];

        //Draw leftRow
        for (let i = 0; i < this.leftRow.length; i++) {
            nodes.push.apply(nodes, this.leftRow[i].draw(new Point(origin.x + (maxLeftWidth - this.leftRow[i].width), origin.y + this.getLengthUntil(this.leftRow, i))));
        }

        //Draw street
        nodes.push(new VisualizationNode(new Rectangle(new Point(origin.x + maxLeftWidth, origin.y), this.STREET_WIDTH, this.height), this.node, this.COLOR));

        //Draw rightRow
        for (let i = 0; i < this.rightRow.length; i++) {
            nodes.push.apply(nodes, this.rightRow[i].draw(new Point(rightStart, origin.y + this.getLengthUntil(this.rightRow, i))));
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

        for(let i = 0; i < children.length; i++) {
            if(sum < totalLength / 2) {
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