import Node from "./Node";
import Edge from "./Edge";
import Validation from "../Validation";
import AttributeTypes from "./AttributeTypes";

export default class Project {
    projectName: string;
    apiVersion: string;
    nodes: Node[];
    edges: Edge[];
    attributeTypes: AttributeTypes;

    /**
     * Validates input data and creates a new Project
     * @param data json data to create a Project from
     */
    public static create(data: any): Project {

        if (Validation.isNullOrUndefined({ data }, "data")) {
            throw new Error("data not defined.");
        }
        if (Validation.isNullOrUndefined(data, "projectName")) {
            throw new Error("projectName not defined.");
        }
        if (!Validation.isOfType(data, "projectName", "string")) {
            throw new Error("projectName is not of type string.");
        }
        if (Validation.isNullOrUndefined(data, "apiVersion")) {
            throw new Error("apiVersion not defined.");
        }
        if (!Validation.isOfType(data, "apiVersion", "string")) {
            throw new Error("apiVersion is not of type string.");
        }
        if (Validation.isNullOrUndefined(data, "nodes")) {
            throw new Error("nodes is not defined.");
        }
        if (!Array.isArray(data.nodes)) {
            throw new Error("nodes is not of type array.");
        }
        const nodes: Node[] = [];
        for (const node of data.nodes) {
            const newNode: Node = Node.create(node);
            nodes.push(newNode);
        }

        if (Validation.isNullOrUndefined(data, "edges")) {
            throw new Error("edges is not defined.");
        }
        if (!Array.isArray(data.edges)) {
            throw new Error("edges is not of type array.");
        }
        const edges: Edge[] = [];
        for (const edge of data.edges) {
            const newEdge: Edge = Edge.create(edge);
            edges.push(edge);
        }
        if (Validation.isNullOrUndefined(data, "attributeTypes")) {
            throw new Error("attributeTypes is not defined.");
        }
        const attributeTypes: AttributeTypes = AttributeTypes.create(data.attributeTypes);

        return new Project(data.projectName, data.apiVersion, nodes, edges, attributeTypes);
    }

    private constructor(projectName: string, apiVersion: string, nodes: Node[], edges: Edge[], attributeTypes: AttributeTypes) {
        this.projectName = projectName;
        this.apiVersion = apiVersion;
        this.nodes = nodes;
        this.edges = edges;
        this.attributeTypes = attributeTypes;
    }
}