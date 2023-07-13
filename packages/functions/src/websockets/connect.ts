import { addConnectionToTable } from "src/utils/websocket-utils";
import { APIGatewayProxyHandler } from "aws-lambda";
import { getLobbyByInviteCode, isLobbyFull, updateLobby } from "src/utils/lobby-utils";
import { Table } from "sst/node/table";
import dynamodb from "@my-texas-42-react-app/core/dynamodb";

export const main: APIGatewayProxyHandler = async (event) => {
  const { match_invite_code, user_id, username } =
    event?.queryStringParameters ?? {
      match_invite_code: '',
      user_id: '',
      username: '',
    };
  const conn_id = event.requestContext.connectionId ?? '';
  const teamNumber = +(event?.queryStringParameters?.team_number ?? '0');

  if (
    !user_id ||
    !username ||
    !match_invite_code ||
    match_invite_code.length !== 6 ||
    !(teamNumber === 1 || teamNumber === 2)
  ) {
    return { statusCode: 500, body: 'Missing connection information.' };
  }

  let lobby = await getLobbyByInviteCode(match_invite_code);

  if (isLobbyFull(lobby)) {
    return { statusCode: 500, body: 'Lobby is full.' };
  }
  
  if (teamNumber === 1) {
    if (lobby.team_1.length < 2) {
      lobby.team_1.push(username);
      lobby.team_1_connections.push(conn_id);
    } else if (lobby.team_2.length < 2) {
      lobby.team_2.push(username);
      lobby.team_2_connections.push(conn_id);
    }
  } else {
    if (lobby.team_2.length < 2) {
      lobby.team_2.push(username);
      lobby.team_2_connections.push(conn_id);
    } else if (lobby.team_1.length < 2) {
      lobby.team_1.push(username);
      lobby.team_1_connections.push(conn_id);
    }
  }

  await updateLobby(lobby);

  const { match_id } = lobby;
  await addConnectionToTable(conn_id, match_id, user_id);

  return { statusCode: 200, body: 'Connected' };
}