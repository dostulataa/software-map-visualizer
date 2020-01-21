import HorizontalStreet from "./HorizontalStreet";
import VisualizationNode from "../visualization/VisualizationNode";
import Point from "../visualization/Point";
import Rectangle from "../visualization/Rectangle";

export default class RightStreet extends HorizontalStreet {
    
    public draw(origin: Point): VisualizationNode[] {
        const maxTopHeight = this.getMaxHeight(this.topRow);
        const bottomStart = origin.y + this.SPACER + maxTopHeight + this.STREET_HEIGHT;
        let nodes: VisualizationNode[] = [];

        this.bottomRow = this.bottomRow.reverse();
        
        //Draw topRow
        for (let i = 0; i < this.topRow.length; i++) {
            nodes.push.apply(nodes, this.topRow[i].draw(new Point(origin.x + this.getLengthUntil(this.topRow, i), origin.y + this.SPACER + (maxTopHeight - this.topRow[i].height))));
        }

        //Draw street
        nodes.push(new VisualizationNode(new Rectangle(new Point(origin.x, origin.y + this.SPACER + maxTopHeight), this.width - this.SPACER, this.STREET_HEIGHT), this.node, this.COLOR));

        //Draw bottomRow
        for (let i = 0; i < this.bottomRow.length; i++) {
            nodes.push.apply(nodes, this.bottomRow[i].draw(new Point(origin.x + this.getLengthUntil(this.bottomRow, i), bottomStart)));
        }
        return nodes;
    }
}