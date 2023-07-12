import { StackContext, use, WebSocketApi } from "sst/constructs"
import { StorageStack } from "./StorageStack"

export function WebSocketStack({stack, app}: StackContext) {
  const {
    currentMatchTable,
    matchHistoryTable,
    socketConnectionTable,
    userInfoTable,
  } = use(StorageStack);

  const socketApi = new WebSocketApi(stack, 'Api', {
    authorizer: 'iam',
    customDomain: app.stage === 'prod' ? 'socket.mytexas42.com' : undefined,
    defaults: {
      function: {
        bind: [
          currentMatchTable,
          matchHistoryTable,
          socketConnectionTable,
          userInfoTable,
        ],
      },
    },
    routes: {},
  });

  stack.addOutputs({
    ApiEndpoint: socketApi.customDomainUrl || socketApi.url,
  });

  return {
    socketApi,
  };
}