import Node from "./Node";
import Edge from "./Edge";
import AttributeTypes from "./AttributeTypes";

export default class Project {
    public projectName: string;
    public apiVersion: string;
    public nodes: Node[];
    public edges?: Edge[] | undefined;
    public attributeTypes?: AttributeTypes | undefined;

    private constructor(projectName: string, apiVersion: string, nodes: Node[], edges?: Edge[] | undefined, attributeTypes?: AttributeTypes) {
        this.projectName = projectName;
        this.apiVersion = apiVersion;
        this.nodes = nodes;
        this.edges = edges;
        this.attributeTypes = attributeTypes;
    }

    /**
     * Creates a new Project
     * @param data json data to create a Project from
     */
    public static create(data: any): Project {
        const nodes: Node[] = [];
        for (const node of data.nodes) {
            const newNode: Node = Node.create(node);
            nodes.push(newNode);
        }

        let edges: Edge[] | undefined = undefined;
        if(data.edges !== undefined && data.edges.length > 0) {
            edges = [];
            for (const edge of data.edges) {
                const newEdge: Edge = Edge.create(edge);
                edges.push(newEdge);
            }
        }

        let attributeTypes: AttributeTypes | undefined = AttributeTypes.create(data.attributeTypes);

        return new Project(data.projectName, data.apiVersion, nodes, edges, attributeTypes);
    }
} 