export default class Validation {

    static isNullOrUndefined(data: any, key: string): boolean {
        return data[key] === undefined || data[key] === null;
    }

    static isOfType(data: any, key: string, type: string): boolean {
        return typeof data[key] === type;
    }

    static isOfLength(data: any[], length: number): boolean {
        return data.length === length;
    }
}