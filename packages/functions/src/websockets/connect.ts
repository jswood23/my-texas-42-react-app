import { APIGatewayProxyHandler } from "aws-lambda";
import { getLobbyByInviteCode } from "src/utils/lobby-utils";
import { Table } from "sst/node/table";
import dynamodb from "@my-texas-42-react-app/core/dynamodb";
import { addConnectionToTable } from "src/utils/websocket-utils";

export const main: APIGatewayProxyHandler = async (event) => {
  const { match_invite_code, user_id } =
    event?.queryStringParameters ?? {
      user_id: '',
      match_invite_code: '',
    };
  const conn_id = event.requestContext.connectionId ?? '';
  const teamNumber = +(event?.queryStringParameters?.team_number ?? '0');

  if (
    !user_id ||
    !match_invite_code ||
    match_invite_code.length !== 6 ||
    !(teamNumber === 1 || teamNumber === 2)
  ) {
    return { statusCode: 500, body: 'Missing connection information.' };
  }

  const lobby = await getLobbyByInviteCode(match_invite_code);

  const { match_id } = lobby;
  await addConnectionToTable(conn_id, match_id, user_id);

  return { statusCode: 200, body: 'Connected' };
}