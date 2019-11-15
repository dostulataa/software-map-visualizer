import Validation from "../Validation";

export default class Node {
    name: string;
    type: "File" | "Folder";
    attributes: Map<string, number>;
    children?: Node[];
    link?: string;

    /**
     * Validates input data and creates a new Node
     * @param data json data to create a Node from
     */
    static create(data: any): Node {
        if (Validation.isNullOrUndefined({ data }, "data")) {
            throw new Error("data not defined.");
        }
        if (Validation.isNullOrUndefined(data, "name")) {
            throw new Error("name not defined.");
        }
        if (!Validation.isOfType(data, "name", "string")) {
            throw new Error("name is not of type string.");
        }
        if (!Validation.isOfType(data, "type", "string")) {
            throw new Error("type is not of type string.");
        }
        if (data.type === "Folder" && data.children === undefined) {
            throw new Error("node with type 'Folder' must also have 'children'");
        }
        if (data.type === "File" && data.attributes === {}) {
            throw new Error("node with type 'File' must also have 'attributes'");
        }

        const attributes: Map<string, number> = new Map();
        for (const key of Object.keys(data.attributes)) {
            if (Validation.isNullOrUndefined(data.attributes, key)) {
                throw new Error("Value of " + key + " is null.");
            }
            if (!Validation.isOfType(data.attributes, key, "number")) {
                throw new Error("value of " + key + " is not a number.");
            }
            attributes.set(key, data.attributes[key]);
        }

        let children: Node[] | undefined = undefined;
        if (!Validation.isNullOrUndefined(data, "children")) {
            if (!Array.isArray(data.children)) {
                throw new Error("children is not of type Array.");
            }
            children = [];
            for (const child of data.children) {
                const newChild: Node = Node.create(child);
                children.push(newChild);
            }
        }

        let link: string | undefined = undefined;
        if (!Validation.isNullOrUndefined(data, "link")) {
            if (!Validation.isOfType(data, "link", "string")) {
                throw new Error("link is not of type string.");
            }
            link = data.link;
        }

        return new Node(data.name, data.type, attributes, children, link);
    }

    private constructor(name: string, type: "File" | "Folder", attributes: Map<string, number>, children?: Node[] | undefined, link?: string | undefined) {
        this.name = name;
        this.type = type;
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
                let toAdd: number = child.size(attribute);
                totalSize += toAdd;
            }
            return totalSize;
        }
        //Node is 'File' and should have attribute mcc
        const attributeValue: number | undefined = this.attributes.get(attribute);
        if (attributeValue === undefined) {
            throw new Error("node '" + this.name + "' has no attribute " + attribute);
        }
        return attributeValue;
    }
}