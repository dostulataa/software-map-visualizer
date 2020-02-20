import CCNode from "../../codeCharta/CCNode";
import Rectangle from "../../visualization/Rectangle";
import Point from "../../visualization/Point";
import VisualNode, { Color } from "../../visualization/VisualNode";
import Strip from "./Strip";

export enum HorizontalOrder {
    leftToRight = 0,
    rightToLeft = 1
};

export default class HorizontalStrip extends Strip {

    constructor(nodes: CCNode[]) {
        super(nodes);
    }

    public layout(rect: Rectangle, rootSize: number, metric: string, order: HorizontalOrder = HorizontalOrder.leftToRight): VisualNode[] {
        let offsetX = rect.topLeft.x;
        
        const nodes = order === HorizontalOrder.leftToRight ? this.nodes : this.nodes.reverse();
        const rootArea = rect.area();
        const width = rect.width;
        const height = this.totalScaledSize(nodes, metric, rootSize, rootArea) / width;
        const treemapNodes: VisualNode[] = [];

        for (const node of nodes) {
            const nodeSize = node.scaledSize(metric, rootSize, rootArea);
            const nodeWidth = height > 0 ? nodeSize / height : 0;
            const newRect = new Rectangle(new Point(offsetX, rect.topLeft.y), nodeWidth, height);
            const color = node.isFile() ? Color.File : Color.Folder;
            treemapNodes.push(new VisualNode(newRect, node, color));
            offsetX += nodeWidth;
        }
        return treemapNodes;
    }

    public worstAspectRatio(nodes: CCNode[], rect: Rectangle, rootSize: number, metric: string): number {
        const width = rect.width;
        const rootArea = rect.area();
        const totalSize = this.totalScaledSize(nodes, metric, rootSize, rootArea);
        const stripMin = this.min(nodes, metric, rootSize, rootArea);
        const stripMax = this.max(nodes, metric, rootSize, rootArea);

        return Math.max((width ** 2) * stripMax / (totalSize ** 2), (totalSize ** 2) / ((width ** 2) * stripMin));
    }

    public populate(nodes: CCNode[], rect: Rectangle, rootSize: number, metric: string) {
        for(let node of nodes) {
            const score = this.worstAspectRatio(this.nodes, rect, rootSize, metric);
            const newScore = this.worstAspectRatio(this.nodes.concat(node), rect, rootSize, metric);

            if (newScore < score) {
                this.nodes.push(node);
            } else {
                /* Node would increase worst aspect ratio, strip is completed */
                break;
            }
        }
    }
}