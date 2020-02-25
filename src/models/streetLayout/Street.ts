import Box from "./Box";
import Rectangle from "../visualization/Rectangle";
import VisualNode from "../visualization/VisualNode";
import Point from "../visualization/Point";

export default abstract class Street extends Box {
    public streetRect: Rectangle | undefined;
    protected spacer = 2;
    protected abstract depth: number;
    protected maxStreetThickness = 10;

    protected abstract layoutStreet(origin: Point, maxNodeSideLength: number): VisualNode;

    protected abstract splitChildrenToRows(children: Box[]): void;

    protected abstract calculateStreetOverhang(streetOrigin: Point): number;

    protected abstract rearrangeRows(): void;

    /**
     * Calculates street thickness depending on the streets depth
     */
    protected getStreetThickness(): number {
        return this.maxStreetThickness / (this.depth + 1);
    }
}