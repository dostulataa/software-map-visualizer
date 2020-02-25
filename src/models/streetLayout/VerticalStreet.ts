import Box from "./Box";
import CCNode from "../codeCharta/CCNode";
import Rectangle from "../visualization/Rectangle";
import Point from "../visualization/Point";
import VisualNode, { Color } from "../visualization/VisualNode";
import HorizontalStreet, { HorizontalOrientation } from "./HorizontalStreet";
import Street from "./Street";

export enum VerticalOrientation { UP, DOWN };

export default class VerticalStreet extends Street {
    private children: Box[] = [];
    protected leftRow: Box[] = [];
    protected rightRow: Box[] = [];
    public orientation: VerticalOrientation;
    protected depth: number;

    constructor(node: CCNode, children: Box[], depth: number, orientation: VerticalOrientation = VerticalOrientation.UP) {
        super(node);
        this.children = children;
        this.depth = depth;
        this.orientation = orientation;
    }

    /**
     * Calculates height and width of the box and splits children in left- and rightrow.
     * @param metricName the used metric
     */
    public calculateDimension(metricName: string): void {
        for (const child of this.children) {
            child.calculateDimension(metricName);
        }
        this.splitChildrenToRows(this.children);
        this.rearrangeRows();

        this.width = this.getMaxWidth(this.leftRow) + this.getStreetThickness() + this.getMaxWidth(this.rightRow) + 2 * this.spacer;
        this.height = Math.max(this.getLength(this.leftRow), this.getLength(this.rightRow));
    }

    public layout(origin: Point = new Point(0, 0)): VisualNode[] {
        const maxLeftWidth = this.getMaxWidth(this.leftRow);
        const leftRowNodes = this.layoutLeftRow(origin, maxLeftWidth);
        const rightRowNodes = this.layoutRightRow(origin, maxLeftWidth);
        const streetNode = this.layoutStreet(origin, maxLeftWidth);

        return [...leftRowNodes, streetNode, ...rightRowNodes];
    }

    /**
     * Creates the layout for the leftRow.
     * @param origin origin of local coordinate system
     * @param maxLeftWidth widest node in leftRow
     */
    private layoutLeftRow(origin: Point, maxLeftWidth: number): VisualNode[] {
        const rowOrigin = new Point(origin.x, origin.y);
        const nodes: VisualNode[] = [];

        if (this.orientation === VerticalOrientation.UP) {
            const rowHeight = this.getLength(this.leftRow);
            rowOrigin.y += this.height - rowHeight;
        }
        for (let i = 0; i < this.leftRow.length; i++) {
            const childOriginX = this.calculateStreetOffsetX(rowOrigin, maxLeftWidth) - this.leftRow[i].width;
            const childOriginY = this.calculateChildOriginY(rowOrigin, i, this.leftRow);
            const childOrigin = new Point(childOriginX, childOriginY);
            nodes.push.apply(nodes, this.leftRow[i].layout(childOrigin));
        }
        return nodes;
    }

    /**
     * Creates the layout for the street node.
     * @param origin origin of local coordinate system
     * @param maxLeftWidth widest node in leftRow
     */
    protected layoutStreet(origin: Point, maxLeftWidth: number): VisualNode {
        const streetOffsetX = this.calculateStreetOffsetX(origin, maxLeftWidth);
        const streetOrigin = new Point(streetOffsetX, origin.y);
        const streetOverhang = this.calculateStreetOverhang(streetOrigin);
        const streetHeight = this.height - streetOverhang;

        streetOrigin.y += this.orientation === VerticalOrientation.UP ? streetOverhang : 0;
        this.streetRect = new Rectangle(streetOrigin, this.getStreetThickness(), streetHeight);

        return new VisualNode(this.streetRect, this.node, Color.Folder);
    }

    /**
     * Creates the layout for the rightRow.
     * @param origin origin of local coordinate system
     * @param maxLeftWidth widest node in leftRow
     */
    private layoutRightRow(origin: Point, maxLeftWidth: number): VisualNode[] {
        const rowOrigin = new Point(origin.x, origin.y)
        const nodes: VisualNode[] = [];

        if (this.orientation === VerticalOrientation.UP) {
            const rowHeight = this.getLength(this.rightRow);
            rowOrigin.y += this.height - rowHeight;
        }
        for (let i = 0; i < this.rightRow.length; i++) {
            const childOriginX = this.calculateStreetOffsetX(rowOrigin, maxLeftWidth) + this.getStreetThickness();
            const childOriginY = this.calculateChildOriginY(rowOrigin, i, this.rightRow);
            const childOrigin = new Point(childOriginX, childOriginY);
            nodes.push.apply(nodes, this.rightRow[i].layout(childOrigin));
        }
        return nodes;
    }

    /**
     * Calculates x-coordinate of street.
     * @param origin origin of local coordinate system
     * @param maxLeftWidth widest node in leftRow
     */
    private calculateStreetOffsetX(origin: Point, maxLeftWidth: number): number {
        return origin.x + this.spacer + maxLeftWidth;
    }

    /**
     * Calculates y-coordinate of current child
     * @param origin origin of local coordinate system
     * @param index index in row of current node
     * @param row the node's row
     */
    private calculateChildOriginY(origin: Point, index: number, row: Box[]): number {
        return origin.y + this.getLengthUntil(row, index);
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
    protected splitChildrenToRows(children: Box[]) {
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
     * Arranges rows according to their orientation
     */
    protected rearrangeRows(): void {
        if (this.orientation === VerticalOrientation.UP) {
            this.leftRow = this.leftRow.reverse();
        } else {
            this.rightRow = this.rightRow.reverse();
        }
    }

    /**
     * Gets the widest box of an array of boxes.
     * @param boxes boxes to be checked
     */
    private getMaxWidth(boxes: Box[]): number {
        return boxes.reduce((max, n) => Math.max(max, n.width), Number.MIN_VALUE);
    }

    /**
     * Calculates overhang of street.
     * @param streetOrigin topleft point of street
     */
    protected calculateStreetOverhang(streetOrigin: Point): number {
        if (this.orientation === VerticalOrientation.UP) {
            return this.calculateTopStreetOverhang(streetOrigin);
        }
        return this.calculateBottomStreetOverhang(streetOrigin)
    }

    /**
     * Calculates upper side overhang of a street.
     * @param streetOrigin topleft point of street
     */
    private calculateTopStreetOverhang(streetOrigin: Point): number {
        const firstLeftNode = this.leftRow[0];
        const firstRightNode = this.rightRow[0];
        const leftOverhang = firstLeftNode instanceof HorizontalStreet
            ? firstLeftNode.streetRect!.topLeft.y - streetOrigin.y
            : this.height - this.getLength(this.leftRow);
        const rightOverhang = firstRightNode instanceof HorizontalStreet
            ? firstRightNode.streetRect!.topLeft.y - streetOrigin.y
            : this.height - this.getLength(this.rightRow);

        return leftOverhang > 0 && rightOverhang > 0 ? Math.min(leftOverhang, rightOverhang) : 0;
    }

    /**
     * Calculates bottom side overhang of a street.
     * @param streetOrigin topleft point of street
     */
    private calculateBottomStreetOverhang(streetOrigin: Point): number {
        const lastLeftNode = this.leftRow[this.leftRow.length - 1];
        const lastRightNode = this.rightRow[this.rightRow.length - 1];
        const streetBottomY = streetOrigin.y + this.height;
        const leftOverhang = lastLeftNode instanceof HorizontalStreet
            ? streetBottomY - lastLeftNode.streetRect!.getBottomRight().y
            : this.height - this.getLength(this.leftRow);
        const rightOverhang = lastRightNode instanceof HorizontalStreet
            ? streetBottomY - lastRightNode.streetRect!.getBottomRight().y
            : this.height - this.getLength(this.rightRow);

        return leftOverhang > 0 && rightOverhang > 0 ? Math.min(leftOverhang, rightOverhang) : 0;
    }
}