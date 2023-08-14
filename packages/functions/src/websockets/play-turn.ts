import { APIGatewayProxyHandler } from "aws-lambda";
import { checkValidity, type PlayerMove, getIsCalling, setRoundRules, getIsPlaying, playDomino, processEndOfTrick } from "src/utils/game-utils";
import { getLobbyById, getPlayerUsernameByConnId, refreshPlayerGameStates, updateLobby } from "src/utils/lobby-utils";
import { getConnectionById, getMessageData, sendToSingleConnection } from "src/utils/websocket-utils";

export const main: APIGatewayProxyHandler = async (event) => {
  const { connectionId = '' } = event?.requestContext;

  const thisConnection = await getConnectionById(connectionId);
  let lobby = await getLobbyById(thisConnection.match_id);

  const messageData = getMessageData(event);
  const playerMove: PlayerMove = {
    connectionId,
    username: getPlayerUsernameByConnId(lobby, connectionId),
    move: messageData.move,
    moveType: messageData.moveType,
  };

  const moveValidity = checkValidity(lobby, playerMove);
  if (!moveValidity.isValid) {
    console.log(`${playerMove.username} made an invalid move: ${moveValidity.message}`);
    const errorMessage = {
      messageType: 'game-error',
      message: moveValidity.message,
    };
    await sendToSingleConnection(event, lobby.match_id, errorMessage, connectionId);
    return { statusCode: 400, body: moveValidity.message };
  }

  const playerMoveStr = `${playerMove.username}\\${playerMove.moveType}\\${playerMove.move}`;
  lobby.current_round_history.push(playerMoveStr);

  if (getIsPlaying(lobby)) {
    lobby = playDomino(lobby, playerMove);
  }

  lobby.current_player_turn = (lobby.current_player_turn + 1) % 4;

  if (getIsCalling(lobby)) {
    lobby = setRoundRules(lobby, playerMove);
  } else if (lobby.current_player_turn === lobby.current_starting_player) {
    lobby = processEndOfTrick(lobby);
  }

  await updateLobby(lobby);
  await refreshPlayerGameStates(event, lobby.match_id);

  return { statusCode: 200, body: 'Player played turn successfully.' };
}