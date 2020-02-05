export default class CCNode {
    public name: string;
    public type: "File" | "Folder";
    public attributes: Map<string, number>;
    public children: CCNode[];
    public id?: number;
    public link?: string;

    private constructor(name: string, type: "File" | "Folder", attributes: Map<string, number>, children: CCNode[], id?: number, link?: string) {
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

    public isFile(): boolean {
        return this.type === "File";
    }

    public isFolder(): boolean {
        return this.type === "Folder";
    }

    /**
     * Creates a new Node
     * @param data json data to create a Node from
     */
    public static create(data: any): CCNode {
        let mergedData = data;
        let name = data.name;

        //skip folders with only one folder child and concat names
        while(mergedData.children.length === 1 && mergedData.children[0].type === "Folder") {
            name += "." + mergedData.children[0].name;
            mergedData = mergedData.children[0];
        }

        const attributes: Map<string, number> = new Map();
        for (const key of Object.keys(mergedData.attributes)) {
            attributes.set(key, Number(mergedData.attributes[key]));
        }

        let id: number | undefined = undefined;
        if (mergedData.id !== undefined) {
            id = Number(mergedData.id);
        }

        let children: CCNode[] = [];
        if (mergedData.children !== undefined && mergedData.children.length > 0) {
            for (const child of mergedData.children) {
                const newChild: CCNode = CCNode.create(child);
                children.push(newChild);
            }
        }

        let link: string | undefined = undefined;
        if (mergedData.link !== undefined) {
            link = mergedData.link;
        }

        return new CCNode(name, mergedData.type, attributes, children, id, link);
    }
}