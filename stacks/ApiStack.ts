import { Api, StackContext, use } from "sst/constructs";
import { StorageStack } from "./StorageStack";

export function ApiStack({ stack, app }: StackContext) {
    const {
      chatLogTable,
      currentMatchTable,
      matchHistoryTable,
      notesTable,
      rulesetTable,
      socketConnectionTable,
      userInfoTable,
    } = use(StorageStack);

    // Create the API
    const api = new Api(stack, 'Api', {
      customDomain: app.stage === 'prod' ? 'api.mytexas42.com' : undefined,
      defaults: {
        authorizer: 'iam',
        function: {
          bind: [
            chatLogTable,
            currentMatchTable,
            matchHistoryTable,
            notesTable,
            rulesetTable,
            socketConnectionTable,
            userInfoTable
          ],
        },
      },
      routes: {
        // game lobbies
        'PUT /start_lobby': 'packages/functions/src/lobbies/start-lobby.main', // start new lobby
        'GET /list_lobbies': 'packages/functions/src/lobbies/list-lobbies.main', // list all lobbies available to the user
        // user profiles
        'GET /users/{username}': 'packages/functions/src/users/get-user-profile.main', // get a user's profile information by username
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