import { Api, StackContext, use } from "sst/constructs";
import { StorageStack } from "./StorageStack";

export function ApiStack({ stack, app }: StackContext) {
    const { matchHistoryTable, notesTable, rulesetTable, userInfoTable } = use(StorageStack);

    // Create the API
    const api = new Api(stack, 'Api', {
      customDomain: app.stage === 'prod' ? 'api.mytexas42.com' : undefined,
      defaults: {
        authorizer: 'iam',
        function: {
          bind: [
            matchHistoryTable,
            notesTable,
            rulesetTable,
            userInfoTable
          ],
        },
      },
      routes: {
        // user profiles
        'GET /users/{username}': 'packages/functions/src/users/get-user-profile.main', // get a user's profile information by username
        // notes api from tutorial
        'GET /notes': 'packages/functions/src/notes-tutorial/list.main', // list all notes
        'GET /notes/{id}': 'packages/functions/src/notes-tutorial/get.main', // get one note
        'POST /notes': 'packages/functions/src/notes-tutorial/create.main', // create new note
        'PUT /notes/{id}': 'packages/functions/src/notes-tutorial/update.main', // create new note
        'DELETE /notes/{id}': 'packages/functions/src/notes-tutorial/delete.main', // delete note
      },
    });

    // Show the API endpoint in the output
    stack.addOutputs({
        ApiEndpoint: api.customDomainUrl || api.url,
    });

    // Return the API resource
    return {
        api,
    };
}