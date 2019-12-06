export default class CCEdgeAttribute {
    public pairingRate: number;
    public avgCommits: number;

    private constructor(pairingRate: number, avgCommits: number) {
        this.pairingRate = pairingRate;
        this.avgCommits = avgCommits;
    }
    
    /**
     * Creates a new EdgeAttribute
     * @param data json data to create an EdgeAttribute from
     */
    public static create(data: any): CCEdgeAttribute {
        return new CCEdgeAttribute(data.pairingRate, data.avgCommits);
    }

}