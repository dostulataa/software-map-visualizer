import CCNode from "../../codeCharta/CCNode";
import Rectangle from "../../visualization/Rectangle";
import VisualNode from "../../visualization/VisualNode";

/**
 * Strip to be placed in a Squarified or Strip Treemap
 */
export default abstract class Strip {

    public nodes: CCNode[] = [];

    constructor(nodes: CCNode[]) {
        this.nodes = nodes;
    }

    /**
     * Creates the strips layout.
     * @param rect rectangle on that strip is placed
     * @param rootSize size of root node
     * @param metricName metric by which nodes are scaled
     * @param order order of nodes in strip
     */
    public abstract layout(rect: Rectangle, rootSize: number, metricName: string, order?: Number): VisualNode[];

    /**
     * Calculates worst aspect ratio of a number of nodes
     * @param nodes nodes to be analysed
     * @param rect rectangle that strip is to be placed in
     * @param rootSize size of root node
     * @param metricName metric to be used
     */
    public abstract worstAspectRatio(nodes: CCNode[], rect: Rectangle, rootSize: number, metricName: string): number;

    /**
     * Calculates the strip total size scaled to root node.
     * @param nodes nodes in strip
     * @param metricName metric to calculate size by
     * @param rootSize size of root node
     * @param rootArea area of root node
     */
    public totalScaledSize(nodes: CCNode[], metricName: string, rootSize: number, rootArea: number): number {
        return nodes.reduce((total, n) => total + n.scaledSize(metricName, rootSize, rootArea), 0);
    }

    /**
     * Calculates strip total size.
     * @param metricName metric to calculate size by
     */
    public totalSize(metricName: string) {
        return this.nodes.reduce((total, n) => total + n.size(metricName), 0);
    }

    /**
     * Returns smallest size node in strip.
     * @param nodes nodes in strip
     * @param metricName metric to caluclate size by
     * @param rootSize size of root node
     * @param rootArea area of root node
     */
    protected min(nodes: CCNode[], metricName: string, rootSize: number, rootArea: number): number {
        return nodes.reduce((min, n) => Math.min(min, n.scaledSize(metricName, rootSize, rootArea)), Number.MAX_VALUE);
    }

        /**
     * Returns largest size node in strip.
     * @param nodes nodes in strip
     * @param metricName metric to caluclate size by
     * @param rootSize size of root node
     * @param rootArea area of root node
     */
    protected max(nodes: CCNode[], metricName: string, rootSize: number, rootArea: number): number {
        return nodes.reduce((max, n) => Math.max(max, n.scaledSize(metricName, rootSize, rootArea)), Number.MIN_VALUE);
    }

    /**
     * Adds new nodes to strip as long as worst aspect ratio does not decrease.
     * @param nodes CCNodes that are not yet processed
     * @param rect rectangle that strip is to be placed in
     * @param rootSize size of root node
     * @param metricName metric to be used
     */
    public populate(nodes: CCNode[], rect: Rectangle, rootSize: number, metricName: string) {
        for(let node of nodes) {
            const score = this.worstAspectRatio(this.nodes, rect, rootSize, metricName);
            const newScore = this.worstAspectRatio(this.nodes.concat(node), rect, rootSize, metricName);

            if (newScore < score) {
                this.nodes.push(node);
            } else {
                /* Node would increase worst aspect ratio, strip is completed */
                break;
            }
        }
    }
}