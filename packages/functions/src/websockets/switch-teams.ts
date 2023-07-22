import { APIGatewayProxyHandler } from "aws-lambda";
import { getLobbyById, refreshPlayerGameStates, updateLobby } from "src/utils/lobby-utils";
import { getConnectionById } from "src/utils/websocket-utils";

export const main: APIGatewayProxyHandler = async (event) => {
  const { connectionId = '' } = event?.requestContext;

  const thisConnection = await getConnectionById(connectionId);

  let thisLobby = await getLobbyById(thisConnection.match_id);

  const oldTeam = thisLobby.team_1_connections.includes(connectionId) ? 1 : 2;

  const newTeam = oldTeam === 1 ? 1 : 2;

  if (thisLobby.current_round > 0) {
    return { statusCode: 500, body: 'Game has already started.' }
  }

  const isNewTeamFull = (newTeam === 1 && thisLobby.team_1.length >= 2) || (newTeam === 2 && thisLobby.team_2.length >= 2);
  if (isNewTeamFull) {
    return { statusCode: 200, body: `Team ${newTeam} is full.` }
  }

  if (oldTeam === 1) {
    // switch to team 2
    const index = thisLobby.team_1_connections.indexOf(connectionId);
    const username = thisLobby.team_1[index];

    // remove player from team 1
    thisLobby.team_1_connections.splice(index, 1);
    thisLobby.team_1.splice(index, 1);

    // add player to team 2
    thisLobby.team_2_connections.push(connectionId);
    thisLobby.team_2.push(username);
  } else {
    // switch to team 2
    const index = thisLobby.team_2_connections.indexOf(connectionId);
    const username = thisLobby.team_2[index];

    // remove player from team 2
    thisLobby.team_2_connections.splice(index, 1);
    thisLobby.team_2.splice(index, 1);

    // add player to team 1
    thisLobby.team_1_connections.push(connectionId);
    thisLobby.team_1.push(username);
  }

  console.log(thisLobby);

  // update game state in database and send it out to players in parallel
  const promises = [
    refreshPlayerGameStates(event, thisConnection.match_id),
    updateLobby(thisLobby)
  ];
  await Promise.all(promises);

  return { statusCode: 200, body: `Successfully switched to team ${newTeam}.` }
}
