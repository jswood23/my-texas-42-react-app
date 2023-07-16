import { APIGatewayProxyHandler } from "aws-lambda";
import { getLobbyById } from "src/utils/lobby-utils";
import { getConnectionById, sendToConnections } from "src/utils/websocket-utils";

export const main: APIGatewayProxyHandler = async (event) => {
  const { connectionId = '' } = event?.requestContext;

  console.log('getting game state for ' + connectionId);
  
  return { statusCode: 200, body: "Message sent"};
}