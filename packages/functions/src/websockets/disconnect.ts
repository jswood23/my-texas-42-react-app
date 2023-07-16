import { APIGatewayProxyHandler } from 'aws-lambda';
import { getConnectionById, getConnectionsByMatchId, removeConnectionFromTable, sendToConnections } from 'src/utils/websocket-utils';
import { refreshPlayerGameStates, removePlayerFromLobby } from 'src/utils/lobby-utils';

export const main: APIGatewayProxyHandler = async (event) => {
  const conn_id = event.requestContext.connectionId ?? '';

  const connection = await getConnectionById(conn_id);

  const removePlayerResult = await removePlayerFromLobby(connection.match_id, conn_id);

  await removeConnectionFromTable(conn_id);

  if (!removePlayerResult.isEmpty) {

    const conn_ids = await getConnectionsByMatchId(connection.match_id);

    const removedPlayerUsername = removePlayerResult?.removedPlayerUsername ?? 'Someone';
    const disconnectedPlayerMessage = {
      messageType: 'chat',
      message: `${removedPlayerUsername} disconnected.`,
      username: '(System)'
    };

    await sendToConnections(event, connection.match_id, disconnectedPlayerMessage, conn_ids);

    await refreshPlayerGameStates(event, connection.match_id);
  }

  return { statusCode: 200, body: 'Disconnected' };
};
