import Box from "./Box";
import Rectangle from "../visualization/Rectangle";
import VisualNode from "../visualization/VisualNode";
import Point from "../visualization/Point";

export default abstract class Street extends Box{
    public streetRect: Rectangle | undefined;
    protected spacer: number = 2;
    protected abstract depth: number;

    protected abstract layoutStreet(origin: Point, maxNodeSideLength: number): VisualNode;

    protected abstract splitChildrenToRows(children: Box[]): void;

    protected abstract calculateStreetOverhang(streetOrigin: Point): number;

    protected abstract rearrangeRows(): void;

    protected getStreetThickness(): number {
        return 10 / (this.depth + 1);
    }
}