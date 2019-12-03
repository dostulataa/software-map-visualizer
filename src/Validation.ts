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


