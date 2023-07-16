import { addToGameChat } from "src/utils/lobby-utils";
import { APIGatewayProxyHandler } from "aws-lambda";
import { getConnectionById, getConnectionsByMatchId, sendToConnections } from "src/utils/websocket-utils"

export const main: APIGatewayProxyHandler = async (event) => {
  const { connectionId = '' } = event?.requestContext;

  const thisConnection = await getConnectionById(connectionId);

  const messageData = JSON.parse(JSON.parse((event.body as string)).data as string);

  const { messageType } = messageData;
  
  switch (messageType) {
    case 'chat': {
      const conn_ids = await getConnectionsByMatchId(thisConnection.match_id);

      const chatLogMessage = {
        message: messageData.message,
        username: messageData.username
      };
    
      await addToGameChat(thisConnection.match_id, JSON.stringify(chatLogMessage));

      await sendToConnections(event, thisConnection.match_id, messageData, conn_ids);
    }
  }

  return { statusCode: 200, body: "Message sent"};
}