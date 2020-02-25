/**
 * Validates input files using a schema json file.
 * @param schema schema that is used for validation
 * @param inputFiles input files to be validated
 */
export default function validateInputFiles(schema: any, inputFiles: any[]) {
    const Ajv = require('ajv');
    const ajv = new Ajv({ allErrors: true });

    for (const data of inputFiles) {
        const valid = ajv.validate(schema, data);
        if (!valid) {
            let message: string = "";
            for (const error of ajv.errors) {
                message += "\n" + error.keyword + ": " + error.message;
            }
            throw new Error(message);
        }
    }
}


