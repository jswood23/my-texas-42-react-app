import { addToGameChat } from "src/utils/lobby-utils";
import { getConnectionById, getConnectionsByMatchId, sendToConnections } from "src/utils/websocket-utils"
import type { APIGatewayProxyEvent } from "aws-lambda";

export const sendGameChat = async (event: APIGatewayProxyEvent) => {
  const { connectionId = '' } = event?.requestContext;

  const thisConnection = await getConnectionById(connectionId);

  const conn_ids = await getConnectionsByMatchId(thisConnection.match_id);

  const messageData = JSON.parse(JSON.parse((event.body as string)).data as string);

  const chatLogMessage = {
    message: messageData.message,
    username: messageData.username
  };

  await addToGameChat(thisConnection.match_id, JSON.stringify(chatLogMessage));

  await sendToConnections(event, thisConnection.match_id, messageData, conn_ids);
}