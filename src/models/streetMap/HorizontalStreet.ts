import Box from "./Box";
import CCNode from "../codeCharta/CCNode";
import Point from "../visualization/Point";
import Rectangle from "../visualization/Rectangle";
import VisualizationNode from "../visualization/VisualizationNode";
import VerticalStreet from "./VerticalStreet";
import UpStreet from "./UpStreet";
import DownStreet from "./DownStreet";

export default class HorizontalStreet extends Box {

    protected children: Box[] = [];
    protected topRow: Box[] = [];
    protected bottomRow: Box[] = [];
    protected STREET_HEIGHT = 5;
    protected COLOR = "SteelBlue";
    protected SPACER = 2;

    constructor(node: CCNode, children: Box[]) {
        super(node);
        this.children = children;
    }

    public layout(metric: string): void {
        //Layout all children
        for (const child of this.children) {
            child.layout(metric);
        }

        //Divide children in topRow and bottomRow
        this.setRows(this.children);

        //Set width and hight of box
        this.height = this.getMaxHeight(this.topRow) + this.STREET_HEIGHT + this.getMaxHeight(this.bottomRow) + 2 * this.SPACER;
        this.width = Math.max(this.getLength(this.topRow), this.getLength(this.bottomRow)) + this.SPACER;
    }

    public draw(origin: Point): VisualizationNode[] {
        const maxTopHeight = this.getMaxHeight(this.topRow);
        const bottomStart = origin.y + maxTopHeight + this.STREET_HEIGHT;
        let nodes: VisualizationNode[] = [];
        
        //Draw topRow
        for (let i = 0; i < this.topRow.length; i++) {
            nodes.push.apply(nodes, this.topRow[i].draw(new Point(origin.x + this.getLengthUntil(this.topRow, i), origin.y + (maxTopHeight - this.topRow[i].height))));
        }

        //Draw street
        nodes.push(new VisualizationNode(new Rectangle(new Point(origin.x, origin.y + maxTopHeight), this.width, this.STREET_HEIGHT), this.node, this.COLOR));

        //Draw bottomRow
        for (let i = 0; i < this.bottomRow.length; i++) {
            nodes.push.apply(nodes, this.bottomRow[i].draw(new Point(origin.x + this.getLengthUntil(this.bottomRow, i), bottomStart)));
        }
        return nodes;
    }

    /**
     * Gets total length of the street.
     * @param boxes placed boxes
     */
    protected getLength(boxes: Box[]): number {
        return this.getLengthUntil(boxes, boxes.length);
    }

    /**
     * Gets length of street from start to end index.
     * @param boxes placed boxes
     * @param end end index
     */
    protected getLengthUntil(boxes: Box[], end: number): number {
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
    protected setRows(children: Box[]) {
        const totalLength = this.getLength(children);
        let sum = 0;

        for(let i = 0; i < children.length; i++) {
            if(sum < totalLength / 2) {
                if(children[i] instanceof VerticalStreet) {
                    children[i] = <UpStreet>children[i];
                }
                this.topRow.push(children[i]);
                sum += children[i].width;
            } else {
                if(children[i] instanceof VerticalStreet) {
                    children[i] = <DownStreet>children[i];
                }
                this.bottomRow.push(children[i]);
            }
        }
    }

    /**
     * Gets the highest box of an array of boxes.
     * @param boxes boxes to be checked
     */
    protected getMaxHeight(boxes: Box[]): number {
        return boxes.reduce((max, n) => Math.max(max, n.height), Number.MIN_VALUE);
    }
}