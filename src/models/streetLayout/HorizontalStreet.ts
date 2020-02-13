import CCNode from "../codeCharta/CCNode";
import Point from "../visualization/Point";
import Rectangle from "../visualization/Rectangle";
import VisualNode, { Color } from "../visualization/VisualNode";
import Box from "./Box";
import VerticalStreet, { VerticalOrientation } from "./VerticalStreet";
import Street from "./Street";

export enum HorizontalOrientation { RIGHT, LEFT }

export default class HorizontalStreet extends Street {
    private children: Box[] = [];
    protected topRow: Box[] = [];
    protected bottomRow: Box[] = [];
    public orientation: HorizontalOrientation;
    protected depth: number;

    constructor(node: CCNode, children: Box[], depth: number, orientation: HorizontalOrientation = HorizontalOrientation.RIGHT) {
        super(node);
        this.children = children;
        this.depth = depth;
        this.orientation = orientation;
    }

    /**
     * Calculates height and width of the box and splits children in top- and bottomrow.
     * @param metric the used metric
     */
    public calculateDimension(metric: string): void {
        for (const child of this.children) {
            child.calculateDimension(metric);
        }

        this.splitChildrenToRows(this.children);
        this.rearrangeRows();

        this.width = Math.max(this.getLength(this.topRow), this.getLength(this.bottomRow));
        this.height = this.getMaxHeight(this.topRow) + this.getStreetThickness() + this.getMaxHeight(this.bottomRow) + 2 * this.spacer;
    }

    public layout(origin: Point = new Point(0, 0)): VisualNode[] {
        const maxTopHeight = this.getMaxHeight(this.topRow);
        const topRowNodes = this.layoutTopRow(origin, maxTopHeight);
        const bottomRowNodes = this.layoutBottomRow(origin, maxTopHeight);
        const streetNode = this.layoutStreet(origin, maxTopHeight);
        return [...topRowNodes, streetNode, ...bottomRowNodes];
    }

    /**
     * Creates the layout for the topRow.
     * @param origin origin of local coordinate system
     * @param maxTopHeight highest node in top row
     */
    private layoutTopRow(origin: Point, maxTopHeight: number): VisualNode[] {
        const rowOrigin = new Point(origin.x, origin.y);
        const nodes: VisualNode[] = [];
        if (this.orientation === HorizontalOrientation.LEFT) {
            const rowWidth = this.getLength(this.topRow);
            rowOrigin.x += this.width - rowWidth;
        }
        for (let i = 0; i < this.topRow.length; i++) {
            const childOriginX = this.calculateChildOriginX(rowOrigin, i, this.topRow);
            const childOriginY = this.calculateStreetOffsetY(rowOrigin, maxTopHeight) - this.topRow[i].height;
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
    protected layoutStreet(origin: Point, maxTopHeight: number): VisualNode {
        const streetOffsetY = this.calculateStreetOffsetY(origin, maxTopHeight);
        const streetOrigin = new Point(origin.x, streetOffsetY);
        const streetOverhang = this.calculateStreetOverhang(streetOrigin);
        const streetWidth = this.width - streetOverhang;
        streetOrigin.x += this.orientation === HorizontalOrientation.LEFT ? streetOverhang : 0;
        this.streetRect = new Rectangle(streetOrigin, streetWidth, this.getStreetThickness());
        return new VisualNode(this.streetRect, this.node, Color.Folder);
    }

    /**
     * Creates the layout for the bottomRow.
     * @param origin origin of local coordinate system
     * @param maxTopHeight highest node in top row
     */
    private layoutBottomRow(origin: Point, maxTopHeight: number): VisualNode[] {
        const rowOrigin = new Point(origin.x, origin.y);
        const nodes: VisualNode[] = [];
        if (this.orientation === HorizontalOrientation.LEFT) {
            const rowWidth = this.getLength(this.bottomRow);
            rowOrigin.x += this.width - rowWidth;
        }
        for (let i = 0; i < this.bottomRow.length; i++) {
            const childOriginX = this.calculateChildOriginX(rowOrigin, i, this.bottomRow);
            const childOriginY = this.calculateStreetOffsetY(rowOrigin, maxTopHeight) + this.getStreetThickness();
            const childOrigin = new Point(childOriginX, childOriginY);
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
        return origin.y + this.spacer + maxTopHeight;
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
    protected splitChildrenToRows(children: Box[]): void {
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
    protected rearrangeRows(): void {
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

    /**
     * Calculates overhang of a street.
     * @param streetOrigin topleft point of street
     */
    protected calculateStreetOverhang(streetOrigin: Point): number {
        if (this.orientation === HorizontalOrientation.LEFT) {
            return this.calculateLeftStreetOverhang(streetOrigin);
        } else {
            return this.calculateRightStreetOverhang(streetOrigin);
        }
    }

    /**
     * Calculates left hand side overhang of a street.
     * @param streetOrigin topleft point of street
     */
    private calculateLeftStreetOverhang(streetOrigin: Point): number {
        const firstTopNode = this.topRow[0];
        const firstBottomNode = this.bottomRow[0];
        const topOverhang = firstTopNode instanceof VerticalStreet ? firstTopNode.streetRect!.topLeft.x - streetOrigin.x : 0;
        const bottomOverhang = firstBottomNode instanceof VerticalStreet ? firstBottomNode.streetRect!.topLeft.x - streetOrigin.x : 0;
        if (topOverhang > 0 && bottomOverhang > 0) {
            return Math.min(topOverhang, bottomOverhang);
        } else {
            return Math.max(topOverhang, bottomOverhang);
        }
    }

    /**
     * Calculates right hand side overhang of a street.
     * @param streetOrigin topleft point of street
     */
    private calculateRightStreetOverhang(streetOrigin: Point): number {
        const lastTopNode = this.topRow[this.topRow.length - 1];
        const lastBottomNode = this.bottomRow[this.bottomRow.length - 1];
        const streetBottomX = streetOrigin.x + this.width;
        const topOverhang = lastTopNode instanceof VerticalStreet ? streetBottomX - lastTopNode.streetRect!.getBottomRight().x : 0;
        const bottomOverhang = lastBottomNode instanceof VerticalStreet ? streetBottomX - lastBottomNode.streetRect!.getBottomRight().x : 0;
        if (topOverhang > 0 && bottomOverhang > 0) {
            return Math.min(topOverhang, bottomOverhang);
        } else {
            return Math.max(topOverhang, bottomOverhang);
        }
    }
}