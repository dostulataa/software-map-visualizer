import Validation from "../Validation";

export default class EdgeAttribute {
    pairingRate: number;
    avgCommits: number;

    /**
     * Creates a new EdgeAttribute
     * @param data json data to create an EdgeAttribute from
     */
    public static create(data: any): EdgeAttribute {
        return new EdgeAttribute(data.pairingRate, data.avgCommits);
    }

    private constructor(pairingRate: number, avgCommits: number) {
        this.pairingRate = pairingRate;
        this.avgCommits = avgCommits;
    }


}