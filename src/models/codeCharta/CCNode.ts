export default class CCNode {
    public name: string;
    public type: "File" | "Folder";
    public attributes: Map<string, number>;
    public children: CCNode[];
    public id?: number;
    public link?: string;

    private constructor(name: string, type: "File" | "Folder", attributes: Map<string, number>, children: CCNode[], id?: number, link?: string | undefined) {
        this.name = name;
        this.type = type;
        this.attributes = attributes;
        this.children = children;
        this.id = id;
        this.link = link;
    }

    /**
     * Calculates the size of the Node using a nodes metric. 
     * @param metric the metric to scale by e.g. "rloc", "mcc", etc
     */
    public size(metric: string): number {
        //calculates size of subelements recursively
        let totalSize = 0;
        if(this.children.length > 0) {
            for (let child of this.children) {
                totalSize += child.size(metric);
            }
            return totalSize;
        }
        //Node is 'File' and should have attribute
        let metricValue = this.attributes.get(metric);
        if (metricValue === undefined) {
            metricValue = 0; //nodes that don't have the metric key are ignored
        }
        return metricValue;
    }

    /**
     * Calculates the size of the Node scaled to its parent node
     * @param rootSize 
     * @param rect 
     */
    public scaledSize(metric: string, parentSize: number, parentArea: number): number {
        const size = this.size(metric);
        const scale = parentArea / parentSize;
        return scale * size;
    }

    /**
     * Creates a new Node
     * @param data json data to create a Node from
     */
    public static create(data: any): CCNode {
        let name = data.name;

        //skip folders with only one folder child and concat names
        while(data.children.length === 1 && data.children[0].type === "Folder") {
            name += "." + data.children[0].name;
            data = data.children[0];
        }

        const attributes: Map<string, number> = new Map();
        for (const key of Object.keys(data.attributes)) {
            attributes.set(key, Number(data.attributes[key]));
        }

        let id: number | undefined = undefined;
        if (data.id !== undefined) {
            id = Number(data.id);
        }

        let children: CCNode[] = [];
        if (data.children !== undefined && data.children.length > 0) {
            for (const child of data.children) {
                const newChild: CCNode = CCNode.create(child);
                children.push(newChild);
            }
        }

        let link: string | undefined = undefined;
        if (data.link !== undefined) {
            link = data.link;
        }

        return new CCNode(name, data.type, attributes, children, id, link);
    }
}