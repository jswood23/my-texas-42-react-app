import { APIGatewayProxyHandler } from "aws-lambda";
import { sendGameChat } from "src/game-chat/send-game-chat";

export const main: APIGatewayProxyHandler = async (event) => {
  const messageData = JSON.parse((event.body as string)).data;
  const { messageType } = messageData;
  // const { stage, domainName } = event.requestContext;
  
  switch (messageType) {
    case 'chat': {
      sendGameChat(event)
    }
  }

  return { statusCode: 200, body: "Message sent"};
}