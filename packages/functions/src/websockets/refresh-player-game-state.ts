import { APIGatewayProxyHandler } from "aws-lambda";
import { GlobalGameState, getLobbyById, getPlayerNumByConnId, PlayerGameState } from "src/utils/lobby-utils";
import { getConnectionById, sendToSingleConnection } from "src/utils/websocket-utils";

const getPlayerGSFromGlobalGS = (lobby: GlobalGameState, connectionId: string) => {
  let player_dominoes = '';

  if (lobby.all_player_dominoes.length) {
    const playerNum = getPlayerNumByConnId(lobby, connectionId);
    player_dominoes = lobby.all_player_dominoes[playerNum];
  }

  // remove all_player_dominoes so that we don't send this information to the frontend
  const { all_player_dominoes, ...gameState } = lobby;
  
  const playerGameState: PlayerGameState = {
    ...gameState,
    player_dominoes
  };

  return playerGameState;
}

export const main: APIGatewayProxyHandler = async (event) => {
  const { connectionId = '' } = event?.requestContext;

  const thisConnection = await getConnectionById(connectionId);

  const thisLobby = await getLobbyById(thisConnection.match_id);

  const playerConnections = thisLobby.team_1_connections.concat(thisLobby.team_2_connections);

  let promises: any[] = [];

  playerConnections.forEach(async (playerConnection) => {
    const playerGameState = getPlayerGSFromGlobalGS(thisLobby, playerConnection);
    const serverMessage = {
      messageType: 'game-update',
      gameData: playerGameState
    };
    promises.push(sendToSingleConnection(event, thisConnection.match_id, serverMessage, connectionId));
  })

  await Promise.all(promises);

  console.log('sent game states to all players');
  
  return { statusCode: 200, body: "Message sent"};
}