import Treemap from "./Treemap"
import CCNode from "../codeCharta/CCNode";
import Point from "../visualization/Point";
import VisualNode, { Color } from "../visualization/VisualNode";
import Rectangle from "../visualization/Rectangle";
import HorizontalStrip from "./Strip/HorizontalStrip";
import VerticalStrip from "./Strip/VerticalStrip";
import Strip from "./Strip/Strip";

export default class SquarifiedTreemap extends Treemap {
    constructor(rootNode: CCNode, metricName: string) {
        super(rootNode, metricName);
    }

    /**
     * Creates the Squarified Treemap root node and starts algorithm for children.
     * @param origin origin of node
     */
    public layout(origin: Point = new Point(0, 0)): VisualNode[] {
        const rectangle = new Rectangle(origin, this.width, this.height);
        const rootNode = new VisualNode(rectangle, this.node, Color.Folder);
        const children = this.node.children.filter(value => value.size(this.metricName) > 0);

        this.treemapNodes.push(rootNode);

        if (children.length === 0) {
            return this.treemapNodes
        };
        this.createNodes(children, rectangle, this.node.size(this.metricName));

        return this.treemapNodes;
    }

    /**
     * Creates nodes for the squarified treemap layout.
     * @param nodes current CCNodes to be created
     * @param rect remaining rectangle
     * @param rootSize size of root node
     */
    protected createNodes(nodes: CCNode[], rect: Rectangle, rootSize: number): void {
        let processedNodesCount = 0;
        let currentRect = new Rectangle(new Point(rect.topLeft.x, rect.topLeft.y), rect.width, rect.height);
        let currentRootSize = rootSize;
        let orderedNodes = this.orderBySizeDescending(nodes);

        do {
            const currentStrip = this.createStrip(currentRect, orderedNodes.slice(processedNodesCount), currentRootSize);
            const stripSize = currentStrip.totalSize(this.metricName);

            if (stripSize > 0) {
                const stripNodes = this.createStripNodes(currentStrip, currentRect, currentRootSize);
                this.createChildrenNodes(stripNodes);
                currentRect = this.remainingRectangle(currentRect, currentStrip, currentRootSize, currentRect.area());
                currentRootSize -= stripSize;
            }
            processedNodesCount += currentStrip.nodes.length;
        } while (processedNodesCount < orderedNodes.length); /* as long as there are children to process */
    }

    /**
     * Creates a Strip.
     * @param rect rectangle where strip is placed
     * @param nodes nodes in strip
     * @param rootSize size of root node
     */
    protected createStrip(rect: Rectangle, nodes: CCNode[], rootSize: number): Strip {
        const firstNode = nodes[0];
        const currentStrip = rect.isVertical()
            ? new HorizontalStrip([firstNode])
            : new VerticalStrip([firstNode]);

        currentStrip.populate(nodes.slice(1), rect, rootSize, this.metricName);

        return currentStrip;
    }

    /**
     * Calculates the remaining rectangle after a strip has been placed.
     * @param rect current rectangle
     * @param strip placed strip
     * @param parentSize size of parent node
     * @param parentArea area of parent node
     */
    protected remainingRectangle(rect: Rectangle, strip: Strip, parentSize: number, parentArea: number): Rectangle {
        const stripSize = strip.totalScaledSize(strip.nodes, this.metricName, parentSize, parentArea);

        let newOrigin: Point;
        let width = rect.width;
        let height = rect.height;

        if (strip instanceof HorizontalStrip) {
            const stripHeight = stripSize / rect.width;
            height -= stripHeight;
            newOrigin = new Point(rect.topLeft.x, rect.topLeft.y + stripHeight);
        } else {
            const stripWidth = stripSize / rect.height;
            width -= stripWidth;
            newOrigin = new Point(rect.topLeft.x + stripWidth, rect.topLeft.y);
        }
        return new Rectangle(newOrigin, width, height);
    }

    protected createStripNodes(strip: Strip, rect: Rectangle, rootSize: number, order?: number): VisualNode[] {
        const stripNodes = strip.layout(rect, rootSize, this.metricName, order);
        this.treemapNodes.push(...stripNodes);
        return stripNodes;
    }

    protected createChildrenNodes(stripNodes: VisualNode[]): void {
        for (let node of stripNodes) {
            const children = node.node.children.filter(node => node.size(this.metricName) > 0 );
            if (children.length > 0) {
                const size = node.node.size(this.metricName);
                this.createNodes(children, node.rectangle, size);
            }
        }
    }

    private orderBySizeDescending(nodes: CCNode[]): CCNode[] {
        return nodes.sort((a, b) => { return b.size(this.metricName) - a.size(this.metricName) });
    }
}