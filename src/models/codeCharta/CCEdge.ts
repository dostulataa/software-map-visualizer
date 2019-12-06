import CCEdgeAttribute from "./CCEdgeAttribute";

export default class CCEdge {
    public fromNodeName: string;
    public toNodeName: string;
    public attributes: CCEdgeAttribute[];

    private constructor(fromNodeName: string, toNodeName: string, attributes: CCEdgeAttribute[]) {
        this.fromNodeName = fromNodeName;
        this.toNodeName = toNodeName;
        this.attributes = attributes;
    }

    /**
     * Creates a new Edge
     * @param data json data to create an Edge from
     */
    public static create(data: any) {
        const edgeAttributes : CCEdgeAttribute[] = [];
        for(const attribute of data.attributes) {
            edgeAttributes.push(CCEdgeAttribute.create(attribute));
        }
        
        return new CCEdge(data.fromNodeName, data.toNodeName, edgeAttributes);
    }
}