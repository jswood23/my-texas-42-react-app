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
    routes: {
      $connect: 'packages/functions/src/websockets/connect.main',
      $disconnect: 'packages/functions/src/websockets/disconnect.main',
      refresh_player_game_state: 'packages/functions/src/websockets/refresh-player-game-state.main',
      send_chat_message: 'packages/functions/src/websockets/send-chat-message.main'
    },
  });

  stack.addOutputs({
    ApiEndpoint: socketApi.customDomainUrl || socketApi.url,
  });

  return {
    socketApi,
  };
}