import { getConnectionById, getConnectionsByMatchId } from "src/utils/websocket-utils"
import type { APIGatewayProxyEvent } from "aws-lambda";

export const sendGameChat = async (event: APIGatewayProxyEvent) => {
  const { connectionId = '' } = event?.requestContext;

  console.log(`connection id: ${connectionId}`)
  
  const thisConnection = await getConnectionById(connectionId);

  const conn_ids = await getConnectionsByMatchId(thisConnection.match_id)

  console.log(conn_ids)
}