import CCNode from "./CCNode";
import CCEdge from "./CCEdge";
import CCAttributeTypes from "./CCAttributeTypes";

export default class CCProject {
    public projectName: string;
    public apiVersion: string;
    public nodes: CCNode[];
    public edges?: CCEdge[] | undefined;
    public attributeTypes?: CCAttributeTypes | undefined;

    private constructor(projectName: string, apiVersion: string, nodes: CCNode[], edges?: CCEdge[] | undefined, attributeTypes?: CCAttributeTypes | undefined) {
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
    public static create(data: any): CCProject {
        const nodes: CCNode[] = [];
        for (const node of data.nodes) {
            const newNode: CCNode = CCNode.create(node);
            nodes.push(newNode);
        }

        let edges: CCEdge[] | undefined = undefined;
        if(data.edges !== undefined && data.edges.length > 0) {
            edges = [];
            for (const edge of data.edges) {
                const newEdge: CCEdge = CCEdge.create(edge);
                edges.push(newEdge);
            }
        }

        let attributeTypes: CCAttributeTypes | undefined = CCAttributeTypes.create(data.attributeTypes);

        return new CCProject(data.projectName, data.apiVersion, nodes, edges, attributeTypes);
    }
} 