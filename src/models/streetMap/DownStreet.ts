import VerticalStreet from "./VerticalStreet";
import VisualizationNode from "../visualization/VisualizationNode";
import Point from "../visualization/Point";
import Rectangle from "../visualization/Rectangle";

export default class DownStreet extends VerticalStreet {

    public draw(origin: Point): VisualizationNode[] {
        const maxLeftWidth = super.getMaxWidth(this.leftRow);
        const rightStart = origin.x + this.SPACER + maxLeftWidth + this.STREET_WIDTH;
        let nodes: VisualizationNode[] = [];

        this.rightRow = this.rightRow.reverse();

        //Draw leftRow
        for (let i = 0; i < this.leftRow.length; i++) {
            nodes.push.apply(nodes, this.leftRow[i].draw(new Point(origin.x + this.SPACER + (maxLeftWidth - this.leftRow[i].width), origin.y + this.getLengthUntil(this.leftRow, i))));
        }

        //Draw street
        nodes.push(new VisualizationNode(new Rectangle(new Point(origin.x + this.SPACER + maxLeftWidth, origin.y), this.STREET_WIDTH, this.height - this.SPACER), this.node, this.COLOR));

        //Draw rightRow
        for (let i = 0; i < this.rightRow.length; i++) {
            nodes.push.apply(nodes, this.rightRow[i].draw(new Point(rightStart, origin.y + this.getLengthUntil(this.rightRow, i))));
        }
        return nodes;
    }
}