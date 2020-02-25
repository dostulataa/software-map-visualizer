import Point from "../visualization/Point";
import VisualNode, { Color } from "../visualization/VisualNode";
import CCNode from "../codeCharta/CCNode";
import Rectangle from "../visualization/Rectangle";
import Treemap from "./Treemap";

export default class SliceDiceTreemap extends Treemap {
    protected treemapNodes: VisualNode[] = [];

    constructor(rootNode: CCNode, metricName: string) {
        super(rootNode, metricName)
    }

    public layout(origin: Point = new Point(0, 0)): VisualNode[] {
        const rect = new Rectangle(origin, this.width, this.height);
        let topLeft: [number, number] = [rect.topLeft.x, rect.topLeft.y];
        let bottomRight: [number, number] = [rect.topLeft.x + rect.width, rect.topLeft.y + rect.height];
        this.sliceAndDice(this.node, topLeft, bottomRight, 0);

        return this.treemapNodes;
    }

    /**
     * Creates the Slice and Dice Treemap Layout. 
     * @param rootNode root node of the treemap
     * @param topLeft pointer to topLeft of rectangle
     * @param bottomRight pointer to bottomRight of rectangle
     * @param axis axis in which the slices are made
     */
    private sliceAndDice(rootNode: CCNode, topLeft: [number, number], bottomRight: [number, number], axis: number): void {
        let newTopLeft: [number, number] = [topLeft[0], topLeft[1]];
        let newBottomRight: [number, number] = [bottomRight[0], bottomRight[1]];

        const color = rootNode.isFile() ? Color.File : Color.Folder;
        const newOrigin = new Point(topLeft[0], topLeft[1]);
        const newWidth = bottomRight[0] - topLeft[0];
        const newHeight = bottomRight[1] - topLeft[1];
        const newRect = new Rectangle(newOrigin, newWidth, newHeight);

        this.treemapNodes.push(new VisualNode(newRect, rootNode, color));
        
        //uses x or y coord depending on orientation of the rectangle
        const width = bottomRight[axis] - topLeft[axis];

        for (const child of rootNode.children) {
            const rootSize = rootNode.size(this.metricName);
            const childSize = child.size(this.metricName);
            
            if (rootSize !== 0) {
                //sets position of new rectangle
                newBottomRight[axis] = newTopLeft[axis] + childSize / rootSize * width;
                //go to child level and toggle axis
                this.sliceAndDice(child, newTopLeft, newBottomRight, 1 - axis);
                newTopLeft[axis] = newBottomRight[axis];
            }
        }
    }
}