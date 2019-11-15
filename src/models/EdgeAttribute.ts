import Validation from "../Validation";

export default class EdgeAttribute {
    pairingRate: number;
    avgCommits: number;

    /**
     * Validates input data and creates a new EdgeAttribute
     * @param data json data to create an EdgeAttribute from
     */
    public static create(data: any): EdgeAttribute {
        if (Validation.isNullOrUndefined({ data }, "data")) {
            throw new Error("data not defined.");
        }
        if (Validation.isNullOrUndefined(data, "pairingRate")) {
            throw new Error("pairingRate is not defined");
        }
        if (Validation.isOfType(data, "pairingRate", "number")) {
            throw new Error("pairingRate ist not a number.");
        }
        if (Validation.isNullOrUndefined(data, "avgCommits")) {
            throw new Error("pairingRate is not defined");
        }
        if (Validation.isOfType(data, "avgCommits", "number")) {
            throw new Error("pairingRate ist not a number.");
        }
        return new EdgeAttribute(data.pairingRate, data.avgCommits);
    }


    private constructor(pairingRate: number, avgCommits: number) {
        this.pairingRate = pairingRate;
        this.avgCommits = avgCommits;
    }


}