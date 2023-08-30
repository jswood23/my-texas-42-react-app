import { StackContext, use, WebSocketApi } from "sst/constructs"
import { StorageStack } from "./StorageStack"

export function WebSocketStack({stack, app}: StackContext) {
  const {
    chatLogTable,
    currentMatchTable,
    matchHistoryTable,
    socketConnectionTable,
    userInfoTable,
  } = use(StorageStack);

  const socketApi = new WebSocketApi(stack, 'Api', {
    defaults: {
      function: {
        bind: [
          chatLogTable,
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
      play_turn: 'packages/functions/src/websockets/play-turn.main',
      refresh_player_game_state: 'packages/functions/src/websockets/refresh-player-game-state.main',
      send_chat_message: 'packages/functions/src/websockets/send-chat-message.main',
      switch_teams: 'packages/functions/src/websockets/switch-teams.main'
    },
  });

  stack.addOutputs({
    ApiEndpoint: socketApi.url,
  });

  return {
    socketApi,
  };
}