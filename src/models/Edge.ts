import Validation from "../Validation";
import EdgeAttribute from "./EdgeAttribute";

export default class Edge {
    fromNodeName: string;
    toNodeName: string;
    attributes: EdgeAttribute[];

    private constructor(fromNodeName: string, toNodeName: string, attributes: EdgeAttribute[]) {
        this.fromNodeName = fromNodeName;
        this.toNodeName = toNodeName;
        this.attributes = attributes;
    }

    /**
     * Creates a new Edge
     * @param data json data to create an Edge from
     */
    public static create(data: any) {
        const edgeAttributes : EdgeAttribute[] = [];
        for(const attribute of data.attributes) {
            edgeAttributes.push(EdgeAttribute.create(attribute));
        }
        
        return new Edge(data.fromNodeName, data.toNodeName, edgeAttributes);
    }
}