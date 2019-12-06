export default class CCNode {
    public name: string;
    public type: "File" | "Folder";
    public attributes: Map<string, number>;
    public id?: number;
    public children?: CCNode[];
    public link?: string;

    private constructor(name: string, type: "File" | "Folder", attributes: Map<string, number>, id?: number, children?: CCNode[] | undefined, link?: string | undefined) {
        this.name = name;
        this.type = type;
        this.id = id;
        this.children = children;
        this.attributes = attributes;
        this.link = link;
    }

    /**
     * Calculates the size of the Node using a nodes metric. 
     * @param metric the metric to scale by e.g. "rloc", "mcc", etc
     */
    public size(metric: string): number {
        //calculates size of subelements recursively
        if (this.children !== undefined) {
            let totalSize: number = 0.01;
            for (let child of this.children) {
                totalSize += child.size(metric);
            }
            return totalSize;
        }
        //Node is 'File' and should have attribute
        let metricValue: number | undefined = this.attributes.get(metric);
        if (metricValue === undefined) {
            metricValue = 0; //nodes that don't have the metric key are ignored
        }
        return metricValue;
    }

    /**
     * Creates a new Node
     * @param data json data to create a Node from
     */
    public static create(data: any): CCNode {
        const attributes: Map<string, number> = new Map();
        for (const key of Object.keys(data.attributes)) {
            attributes.set(key, Number(data.attributes[key]));
        }

        let id: number | undefined = undefined;
        if (data.id !== undefined) {
            id = Number(data.id);
        }

        let children: CCNode[] | undefined;
        if (data.children !== undefined && data.children.length > 0) {
            children = [];
            for (const child of data.children) {
                const newChild: CCNode = CCNode.create(child);
                children.push(newChild);
            }
        }

        let link: string | undefined = undefined;
        if (data.link !== undefined) {
            link = data.link;
        }

        return new CCNode(data.name, data.type, attributes, id, children, link);
    }
}