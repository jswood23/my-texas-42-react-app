import { APIGatewayProxyHandler } from "aws-lambda";
import { getLobbyById, refreshPlayerGameStates, updateLobby } from "src/utils/lobby-utils";
import { getConnectionById, getMessageData } from "src/utils/websocket-utils";
import { checkValidity, type PlayerMove } from "src/utils/game-utils";

export const main: APIGatewayProxyHandler = async (event) => {
  const { connectionId = '' } = event?.requestContext;

  const thisConnection = await getConnectionById(connectionId);
  let thisLobby = await getLobbyById(thisConnection.match_id);

  const messageData = getMessageData(event);
  const playerMove: PlayerMove = {
    connectionId,
    move: messageData.move,
    moveType: messageData.moveType
  }

  const moveValidity = checkValidity(thisLobby, playerMove)
  if (!moveValidity.isValid) {
    console.log('A player made an invalid move:');
    console.log(moveValidity.message)
    return { statusCode: 400, body: moveValidity.message }
  }

  return { statusCode: 200, body: 'Player played turn successfully.' }
}