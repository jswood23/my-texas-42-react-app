import { APIGatewayProxyHandler } from 'aws-lambda';
import { getConnectionById, removeConnectionFromTable } from 'src/utils/websocket-utils';
import { removePlayerFromLobby } from 'src/utils/lobby-utils';

export const main: APIGatewayProxyHandler = async (event) => {
  const conn_id = event.requestContext.connectionId ?? '';

  const connection = await getConnectionById(conn_id);

  await removePlayerFromLobby(connection.match_id, conn_id);

  await removeConnectionFromTable(conn_id);

  return { statusCode: 200, body: 'Disconnected' };
};
