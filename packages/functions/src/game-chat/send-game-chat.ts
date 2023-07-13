import { getConnectionById, getConnectionsByMatchId, sendToConnections } from "src/utils/websocket-utils"
import type { APIGatewayProxyEvent } from "aws-lambda";

export const sendGameChat = async (event: APIGatewayProxyEvent) => {
  const { connectionId = '' } = event?.requestContext;

  console.log(`connection id: ${connectionId}`)

  const thisConnection = await getConnectionById(connectionId);

  const conn_ids = await getConnectionsByMatchId(thisConnection.match_id)

  const messageData = JSON.parse((event.body as string)).data;

  await sendToConnections(event, thisConnection.match_id, messageData, conn_ids)
}