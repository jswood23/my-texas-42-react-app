import { APIGatewayProxyHandler } from "aws-lambda";
import { refreshPlayerGameStates } from "src/utils/lobby-utils";
import { getConnectionById } from "src/utils/websocket-utils";

export const main: APIGatewayProxyHandler = async (event) => {
  const { connectionId = '' } = event?.requestContext;

  const thisConnection = await getConnectionById(connectionId);

  await refreshPlayerGameStates(event, thisConnection.match_id);
  
  return { statusCode: 200, body: "Message sent"};
}