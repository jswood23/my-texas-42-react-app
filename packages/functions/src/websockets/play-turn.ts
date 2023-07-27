import { APIGatewayProxyHandler } from "aws-lambda";
import { getLobbyById, getPlayerUsernameByConnId, refreshPlayerGameStates, updateLobby } from "src/utils/lobby-utils";
import { getConnectionById, getMessageData } from "src/utils/websocket-utils";
import { checkValidity, type PlayerMove, getWinningPlayerOfTrick, getTrickScore } from "src/utils/game-utils";

export const main: APIGatewayProxyHandler = async (event) => {
  const { connectionId = '' } = event?.requestContext;

  const thisConnection = await getConnectionById(connectionId);
  let lobby = await getLobbyById(thisConnection.match_id);

  const messageData = getMessageData(event);
  const playerMove: PlayerMove = {
    connectionId,
    move: messageData.move,
    moveType: messageData.moveType
  }

  const playerUsername = getPlayerUsernameByConnId(lobby, connectionId)
  const moveValidity = checkValidity(lobby, playerMove)
  if (!moveValidity.isValid) {
    console.log(`${playerUsername} made an invalid move: ${moveValidity.message}`);
    return { statusCode: 400, body: moveValidity.message }
  }

  const playerMoveStr = `${playerUsername}\\${playerMove.moveType}\\${playerMove.move}`
  lobby.current_round_history.push(playerMoveStr)

  lobby.current_player_turn = (lobby.current_player_turn + 1) % 4

  if (lobby.current_player_turn === lobby.current_starting_player) {
    // decide who won this trick and how many points they won
    const winningPlayerOfTrick = getWinningPlayerOfTrick(lobby);
    const winningTeamOfTrick = winningPlayerOfTrick % 2 === 0 ? 1 : 2
    const trickScore = getTrickScore(lobby);

    // update lobby

    // start next trick
  }

  await updateLobby(lobby);
  await refreshPlayerGameStates(event, lobby.match_id);

  return { statusCode: 200, body: 'Player played turn successfully.' }
}