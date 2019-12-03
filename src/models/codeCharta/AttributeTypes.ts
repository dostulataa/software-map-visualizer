export default class AttributeTypes {
    public nodes?: Map<string, string> | undefined;
    public edges?: Map<string, string> | undefined;

    private constructor(nodes?: Map<string, string>, edges?: Map<string, string>) {
        this.nodes = nodes;
        this.edges = edges;
    }

    /**
     * Creates a new AttributesTypes object
     * @param data json data to create an AttributeTypes object from
     */
    public static create(data: any) {
        let nodes : Map<string, string> | undefined = undefined;
        if (data.nodes !== undefined) {
            nodes = new Map();
            for (const nodeEntry of data.nodes) {
                for (const nodeKey of Object.keys(nodeEntry)) {
                    nodes.set(nodeKey, nodeEntry[nodeKey]);
                }
            }
        }

        let edges: Map<string, string> | undefined = undefined;
        if(data.edges !== undefined) {
            edges = new Map();
            for (const edgeEntry of data.edges) {
                for (const edgeKey of Object.keys(edgeEntry)) {
                    edges.set(edgeKey, edgeEntry[edgeKey]);
                }
            }
        }

        if(nodes === undefined && edges === undefined) {
            return undefined;
        }

        return new AttributeTypes(nodes, edges);
    }
}