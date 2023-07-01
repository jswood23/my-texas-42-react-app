import { Api, StackContext, use } from "sst/constructs";
import { StorageStack } from "./StorageStack";

export function ApiStack({ stack, app }: StackContext) {
    const { table } = use(StorageStack);

    // Create the API
    const api = new Api(stack, "Api", {
        defaults: {
            function: {
                bind: [table],
            },
        },
        routes: {
            "GET /notes": "packages/functions/src/notes-tutorial/list.main", // list all notes
            "GET /notes/{id}": "packages/functions/src/notes-tutorial/get.main", // get one note
            "POST /notes": "packages/functions/src/notes-tutorial/create.main", // create new note
        },
    });

    // Show the API endpoint in the output
    stack.addOutputs({
        ApiEndpoint: api.url,
    });

    // Return the API resource
    return {
        api,
    };
}