import Validation from "../Validation";

export default class AttributeTypes {
    public nodes: Map<string, string>;
    public edges: Map<string, string>

    private constructor(nodes: Map<string, string>, edges: Map<string,string>) {
        this.nodes = nodes;
        this.edges = edges;
    }

    /**
     * Validates input data and creates a new AttributesTypes object
     * @param data json data to create a AttributeTypes object from
     */
    public static create(data: any) {
        if (Validation.isNullOrUndefined({ data }, "data")) {
            throw new Error("data is not defined.");
        }
        if (Validation.isNullOrUndefined(data, "nodes")) {
            throw new Error("nodes is not defined.")
        }
        if (!Array.isArray(data.nodes)) {
            throw new Error("nodes is not of type Array.");
        }

        const nodes: Map<string, string> = new Map();

        for(const entry of data.nodes) {
            if(Object.keys(entry).length !== 1){
                throw new Error("node entry has too many elements.");
            }
            for (const nodeKey of Object.keys(entry)) {
                if (!Validation.isOfType(entry, nodeKey, "string")) {
                    throw new Error("value of " + nodeKey + " is not a string.");
                }
                nodes.set(nodeKey, entry[nodeKey]);
            }
        }

        if (Validation.isNullOrUndefined(data, "edges")) {
            throw new Error("nodes is not defined.")
        }
        if (!Array.isArray(data.edges)) {
            throw new Error("edges is not of type Array.");
        }

        const edges: Map<string, string> = new Map();

        for(const entry of data.edges) {
            if(Object.keys(entry).length !== 1){
                throw new Error("edge entry has too many elements.");
            }
            for (const edgeKey of Object.keys(entry)) {
                if (!Validation.isOfType(entry, edgeKey, "string")) {
                    throw new Error("value of " + edgeKey + " is not a string.");
                }
                edges.set(edgeKey, entry[edgeKey]);
            }
        }
        return new AttributeTypes(nodes, edges);
    }
}