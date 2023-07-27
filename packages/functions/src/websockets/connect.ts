import { addConnectionToTable, getConnectionsByMatchId, sendToConnections } from "src/utils/websocket-utils";
import { APIGatewayProxyHandler } from "aws-lambda";
import { getLobbyByInviteCode, isLobbyFull, updateLobby } from "src/utils/lobby-utils";
import { startNextRound } from "src/utils/game-utils";

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
    return { statusCode: 400, body: 'Missing connection information.' };
  }

  let lobby = await getLobbyByInviteCode(match_invite_code);

  if (isLobbyFull(lobby)) {
    return { statusCode: 400, body: 'Lobby is full.' };
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

  if (isLobbyFull(lobby)) {
    lobby = startNextRound(lobby);
  }

  await updateLobby(lobby);

  const { match_id } = lobby;

  const conn_ids = await getConnectionsByMatchId(match_id);

  await addConnectionToTable(conn_id, match_id, user_id);

  const connectedPlayerMessage = {
    messageType: 'chat',
    message: `${username} connected.`,
    username: '(System)'
  }

  await sendToConnections(event, match_id, connectedPlayerMessage, conn_ids);

  return { statusCode: 200, body: 'Connected' };
}