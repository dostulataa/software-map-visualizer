export default class Validation {
    
    static checkData(data: any, schema: any) {
        const Ajv = require('ajv');
        const ajv = new Ajv({allErrors: true});
        const valid = ajv.validate(schema, data);
        return valid ? [] : ajv.errors;       
    }

    static isNullOrUndefined(data: any, key: string): boolean {
        return data[key] === undefined || data[key] === null;
    }

    static isOfType(data: any, key: string, type: string): boolean {
        return typeof data[key] === type;
    }

    static isEmptyElement(data: any, key: string): boolean {
        return Object.keys(data[key]).length === 0;
    }
}