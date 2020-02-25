import Box from "../streetLayout/Box"
import VisualNode from "../visualization/VisualNode";
import CCNode from "../codeCharta/CCNode";

export default abstract class Treemap extends Box {
    protected metricName: string;
    protected treemapNodes: VisualNode[] = [];

    constructor(rootNode: CCNode, metricName: string) {
        super(rootNode)
        this.metricName = metricName;
    }

    public abstract layout(): VisualNode[];

    public calculateDimension(metricName: string): void {
        const size = this.node.size(metricName);
        this.width = Math.sqrt(size);
        this.height = Math.sqrt(size);
    }
}