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
     * Validates input data and creates a new Edge
     * @param data json data to create an Edge from
     */
    public static create(data: any) {
        if(Validation.isNullOrUndefined({data}, "data")) {
            throw new Error("data not defined.");
        }
        if(Validation.isNullOrUndefined(data, "fromNodeName")) {
            throw new Error("fromNodeName not defined.");
        }
        if(!Validation.isOfType(data, "fromNodeName", "string")) {
            throw new Error("fromNodeName must be a string.");
        }
        if(Validation.isNullOrUndefined(data, "toNodeName")) {
            throw new Error("toNodeName not defined.");
        }
        if(!Validation.isOfType(data, "toNodeName", "string")) {
            throw new Error("toNodeName must be a string.");
        }
        if(Validation.isNullOrUndefined(data, "attributes")) {
            throw new Error("attributes not defined.");
        }
        const edgeAttributes : EdgeAttribute[] = [];
        for(const attribute of data.attributes) {
            edgeAttributes.push(EdgeAttribute.create(attribute));
        }
        
        return new Edge(data.fromNodeName, data.toNodeName, edgeAttributes);
    }
}