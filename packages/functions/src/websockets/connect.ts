import { APIGatewayProxyHandler } from "aws-lambda";
import { getLobbyByInviteCode } from "src/utils/lobby-utils";
import { Table } from "sst/node/table";
import dynamodb from "@my-texas-42-react-app/core/dynamodb";
import { addConnectionToTable } from "src/utils/websocket-utils";

export const main: APIGatewayProxyHandler = async (event) => {
  const { user_id, match_invite_code } = event?.queryStringParameters ?? { user_id: '', match_invite_code: ''};
  const conn_id = event.requestContext.connectionId ?? '';

  if (!user_id || !match_invite_code || match_invite_code.length !== 6) {
    return { statusCode: 500, body: 'Missing user id or match code.'};
  }

  const lobby = await getLobbyByInviteCode(match_invite_code);

  const { match_id } = lobby;

  await addConnectionToTable(conn_id, match_id, user_id);

  return { statusCode: 200, body: 'Connected' };
}