export default class Node {
    name: string;
    type: "File" | "Folder";
    attributes: Map<string, number>;
    id?: number;
    children?: Node[];
    link?: string;

    /**
     * Creates a new Node
     * @param data json data to create a Node from
     */
    static create(data: any): Node {
        const attributes: Map<string, number> = new Map();
        for (const key of Object.keys(data.attributes)) {
            attributes.set(key, Number(data.attributes[key]));
        }

        let id: number | undefined = undefined;
        if (data.id !== undefined) {
            id = Number(data.id);
        }

        let children: Node[] | undefined;
        if (data.children !== undefined && data.children.length > 0) {
            children = [];
            for (const child of data.children) {
                const newChild: Node = Node.create(child);
                children.push(newChild);
            }
        }

        let link: string | undefined = undefined;
        if (data.link !== undefined) {
            link = data.link;
        }

        return new Node(data.name, data.type, attributes, id, children, link);
    }

    private constructor(name: string, type: "File" | "Folder", attributes: Map<string, number>, id?: number, children?: Node[] | undefined, link?: string | undefined) {
        this.name = name;
        this.type = type;
        this.id = id;
        this.children = children;
        this.attributes = attributes;
        this.link = link;
    }

    /**
     * Calculates the size of the Node using an attribute. 
     * @param attribute the attribute to scale by e.g. "rloc", "mcc", etc
     */
    public size(attribute: string): number {
        //calculates size of subelements recursively
        if (this.children !== undefined) {
            let totalSize: number = 0;
            for (let child of this.children) {
                totalSize += child.size(attribute);
            }
            return totalSize;
        }
        //Node is 'File' and should have attribute
        let attributeValue: number | undefined = this.attributes.get(attribute);
        if (attributeValue === undefined) {
            attributeValue = 0; //nodes that don't have the attribute are ignored
            //throw new Error("node '" + this.name + "' has no attribute " + attribute);
        }
        return attributeValue;
    }
}