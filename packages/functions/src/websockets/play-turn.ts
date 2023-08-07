import { APIGatewayProxyHandler } from "aws-lambda";
import { checkValidity, type PlayerMove, getWinningPlayerOfTrick, getTrickScore, getRoundRules, processRoundWinner, startNextRound, processBids, getIsCalling, setRoundRules } from "src/utils/game-utils";
import { getLobbyById, getPlayerUsernameByConnId, refreshPlayerGameStates, updateLobby } from "src/utils/lobby-utils";
import { getConnectionById, getMessageData } from "src/utils/websocket-utils";

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
    return { statusCode: 400, body: moveValidity.message };
  }

  const playerMoveStr = `${playerMove.username}\\${playerMove.moveType}\\${playerMove.move}`;
  lobby.current_round_history.push(playerMoveStr);

  lobby.current_player_turn = (lobby.current_player_turn + 1) % 4;

  if (getIsCalling(lobby)) {
    setRoundRules(lobby, playerMove);
  } else if (lobby.current_player_turn === lobby.current_starting_player) {
    // end of trick or bidding phase
    if (lobby.current_is_bidding) {
      lobby = processBids(lobby);
    } else {
      const roundRules = getRoundRules(lobby);

      // decide who won this trick and how many points they won
      const winningPlayerOfTrick = getWinningPlayerOfTrick(lobby);
      const winningTeamOfTrick = winningPlayerOfTrick % 2 === 0 ? 1 : 2;
      const trickScore = getTrickScore(lobby);

      // update lobby
      let isEndOfRound = false;
      const endOfTrickMessage = `Team ${winningTeamOfTrick} wins trick worth ${trickScore} points.`;
      lobby.current_round_history.push(endOfTrickMessage);
      if (winningTeamOfTrick === 1) {
        lobby.current_team_1_round_score += trickScore;
        if (
          (roundRules.biddingTeam === 1 &&
            lobby.current_team_1_round_score >= roundRules.bid) ||
          (roundRules.biddingTeam === 2 &&
            lobby.current_team_1_round_score >= 42 - roundRules.bid)
        ) {
          isEndOfRound = true;
          lobby = processRoundWinner(lobby, 1);
          lobby = startNextRound(lobby);
        }
      } else {
        lobby.current_team_2_round_score += trickScore;
        if (
          (roundRules.biddingTeam === 2 &&
            lobby.current_team_2_round_score >= roundRules.bid) ||
          (roundRules.biddingTeam === 1 &&
            lobby.current_team_2_round_score >= 42 - roundRules.bid)
        ) {
          isEndOfRound = true;
          lobby = processRoundWinner(lobby, 2);
          lobby = startNextRound(lobby);
        }
      }

      // start next trick if round is not over
      if (!isEndOfRound) {
        lobby.current_starting_player = winningPlayerOfTrick;
      }
    }
  }

  await updateLobby(lobby);
  await refreshPlayerGameStates(event, lobby.match_id);

  return { statusCode: 200, body: 'Player played turn successfully.' };
}