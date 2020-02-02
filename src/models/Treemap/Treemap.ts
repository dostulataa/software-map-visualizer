import Box from "../streetMap/Box"
import Point from "../visualization/Point";
import VisualNode, { Color } from "../visualization/VisualNode";
import CCNode from "../codeCharta/CCNode";
import Rectangle from "../visualization/Rectangle";

export default class Treemap extends Box {
    protected metric: string;
    protected treemapNodes: VisualNode[] = [];

    constructor(rootNode: CCNode, metric: string) {
        super(rootNode)
        this.metric = metric;
    }

    public calculateDimension(): void {
        const size = this.node.size(this.metric);
        this.width = Math.sqrt(size);
        this.height = Math.sqrt(size);
    }

    public layout(origin: Point = new Point(0, 0)): VisualNode[] {
        const rect = new Rectangle(origin, this.width, this.height);
        let topLeft: [number, number] = [rect.topLeft.x, rect.topLeft.y];
        let bottomRight: [number, number] = [rect.topLeft.x + rect.width, rect.topLeft.y + rect.height];
        this.sliceAndDice(this.node, topLeft, bottomRight, 0);
        return this.treemapNodes;
    }

    public setDimensions(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    private sliceAndDice(root: CCNode, topLeft: [number, number], bottomRight: [number, number], axis: number) {
        let newTopLeft: [number, number] = [topLeft[0], topLeft[1]];
        let newBottomRight: [number, number] = [bottomRight[0], bottomRight[1]];
        const color = root.isFile() ? Color.File : Color.Folder;
        const newOrigin = new Point(topLeft[0], topLeft[1]);
        const newWidth = bottomRight[0] - topLeft[0];
        const newHeight = bottomRight[1] - topLeft[1];
        const newRect = new Rectangle(newOrigin, newWidth, newHeight);
        this.treemapNodes.push(new VisualNode(newRect, root, color));
        
        //uses x or y coord depending on orientation of the rectangle
        const width = bottomRight[axis] - topLeft[axis];

        for (const child of root.children) {
            const rootSize = root.size(this.metric);
            const childSize = child.size(this.metric);
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