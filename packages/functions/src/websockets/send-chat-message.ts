import { addToGameChat } from "src/utils/lobby-utils";
import { APIGatewayProxyHandler } from "aws-lambda";
import { getConnectionById, getConnectionsByMatchId, getMessageData, sendToConnections } from "src/utils/websocket-utils"

export const main: APIGatewayProxyHandler = async (event) => {
  const { connectionId = '' } = event?.requestContext;

  const thisConnection = await getConnectionById(connectionId);

  const messageData = getMessageData(event);
  
  const conn_ids = await getConnectionsByMatchId(thisConnection.match_id);

  await addToGameChat(thisConnection.match_id, JSON.stringify(messageData));

  const chatMessageResponse = {
    messageType: 'chat',
    message: messageData.message,
    username: messageData.username
  };

  await sendToConnections(event, thisConnection.match_id, chatMessageResponse, conn_ids);

  return { statusCode: 200, body: "Message sent"};
}