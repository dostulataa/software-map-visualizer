import Box from "../streetLayout/Box"
import VisualNode from "../visualization/VisualNode";
import CCNode from "../codeCharta/CCNode";

export default abstract class Treemap extends Box {
    protected metric: string;
    protected treemapNodes: VisualNode[] = [];

    constructor(rootNode: CCNode, metric: string) {
        super(rootNode)
        this.metric = metric;
    }

    public calculateDimension(metric: string): void {
        const size = this.node.size(metric);
        this.width = Math.sqrt(size);
        this.height = Math.sqrt(size);
    }
}