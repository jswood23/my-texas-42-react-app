import type { APIGatewayProxyEvent } from 'aws-lambda';
import { dynamoDB } from '@my-texas-42-react-app/core/aws-helpers';
import { sendToSingleConnection } from './websocket-utils';
import { Table } from 'sst/node/table';

export interface Lobby {
  match_id: string
  match_name: string
  match_invite_code: string
  match_privacy: number
  allowed_players: string[]
  rules: string[]
  team_1: string[]
  team_2: string[]
  current_round: number
  current_starting_bidder: number
  current_starting_player: number
  current_is_bidding: boolean
  current_player_turn: number
  current_round_rules: string
  current_team_1_round_score: number
  current_team_2_round_score: number
  current_team_1_total_score: number
  current_team_2_total_score: number
  current_round_history: string[]
  total_round_history: string[][]
}

export interface GlobalGameState extends Lobby {
  all_player_dominoes: string[][]
  chat_log: string[]
  team_1_connections: string[]
  team_2_connections: string[]
}

export interface PlayerGameState extends Lobby {
  player_dominoes: string[]
}

export const addToGameChat = async (match_id: string, new_message: string) => {
  const params = {
    TableName: Table.CurrentMatch.tableName,
    Key: {
      match_id,
    },
    UpdateExpression: 'SET #cl = list_append(#cl, :new_message)',
    ExpressionAttributeNames: {
      '#cl': 'chat_log',
    },
    ExpressionAttributeValues: {
      ':new_message': [new_message],
    },
    ReturnValues: 'ALL_NEW',
  };

  await dynamoDB.update(params);

  return { status: true };
}

export const getLobbyById = async (match_id: string) => {
  const params = {
    TableName: Table.CurrentMatch.tableName,
    Key: {
      match_id: match_id,
    },
  };

  const result = await dynamoDB.get(params);

  if (!result.Item) {
    throw new Error('Lobby does not exist.');
  }

  return (result.Item as GlobalGameState);
};

export const getLobbyByInviteCode = async (match_invite_code: string) => {
  const findGameParams = {
    TableName: Table.CurrentMatch.tableName,
    FilterExpression: 'match_invite_code = :match_invite_code',
    ExpressionAttributeValues: {
      ':match_invite_code': match_invite_code,
    },
  };

  const result = await dynamoDB.scan(findGameParams);

  if (result.Items?.length === 0 || !result.Items) {
    throw new Error('Lobby does not exist.');
  }

  return (result.Items[0] as GlobalGameState);
};

export const getPlayerNumByConnId = (lobby: GlobalGameState, connectionId: string) => {
  // 0: t1p1 (team 1 player 1), 1: t2p1, 2: t1p2, 3: t2p2, -1: not found
  if (lobby.team_1_connections.includes(connectionId)) {
    const index = lobby.team_1_connections.indexOf(connectionId);
    return index * 2;
  } else if (lobby.team_2_connections.includes(connectionId)) {
    const index = lobby.team_2_connections.indexOf(connectionId);
    return index * 2 + 1;
  } else {
    return -1;
  }
};

export const getPlayerUsernameByConnId = (lobby: GlobalGameState, connectionId: string) => {
  if (lobby.team_1_connections.includes(connectionId)) {
    const index = lobby.team_1_connections.indexOf(connectionId);
    return lobby.team_1[index];
  } else if (lobby.team_2_connections.includes(connectionId)) {
    const index = lobby.team_2_connections.indexOf(connectionId);
    return lobby.team_2[index];
  } else {
    return '**username not found**';
  }
}

export const getPlayerUsernameByPosition =  (lobby: GlobalGameState, position: number) => {
  if (position % 2 === 0) {
    return lobby.team_1[position / 2];
  } else {
    return lobby.team_2[(position - 1) / 2];
  }
};

const getPlayerGSFromGlobalGS = (lobby: GlobalGameState, connectionId: string) => {
  let player_dominoes: string[] = [];

  // remove variables specific to the global game state so that the player only gets what they need to know
  const { all_player_dominoes, chat_log, team_1_connections, team_2_connections, ...gameState } = lobby;

  if (all_player_dominoes.length) {
    const playerNum = getPlayerNumByConnId(lobby, connectionId);
    player_dominoes = all_player_dominoes[playerNum];
  }
  
  const playerGameState: PlayerGameState = {
    ...gameState,
    player_dominoes
  };

  return playerGameState;
};

export const isLobbyEmpty = (lobby: GlobalGameState) => {
  return lobby.team_1.length === 0 && lobby.team_2.length === 0;
};

export const isLobbyFull = (lobby: GlobalGameState) => {
  if (lobby.team_1.length > 2 || lobby.team_2.length > 2) {
    console.log('One of the teams has too many players.');
  }
  return lobby.team_1.length >= 2 && lobby.team_2.length >= 2;
};

export const updateLobby = async (lobby: GlobalGameState) => {
  const { match_id, rules, ...everythingElse } = lobby
  const attributesToChange = Object.keys(everythingElse);
  let UpdateExpression = 'SET ';
  let ExpressionAttributeValues = {};
  for (let i = 0; i < attributesToChange.length; i++) {
    UpdateExpression += `${attributesToChange[i]} = :${attributesToChange[i]}`;
    if (i < attributesToChange.length - 1) {
      UpdateExpression += ', ';
    }
    ExpressionAttributeValues = {
      ...ExpressionAttributeValues,
      [`:${attributesToChange[i]}`]: (lobby as any)[attributesToChange[i]]
    }
  }

  const params = {
    TableName: Table.CurrentMatch.tableName,
    Key: {
      match_id: lobby.match_id,
    },
    UpdateExpression,
    ExpressionAttributeValues,
    ReturnValues: 'ALL_NEW',
  };

  await dynamoDB.update(params);

  return { status: true };
};

export const refreshPlayerGameStates = async (event: APIGatewayProxyEvent, match_id: string) => {
  const thisLobby = await getLobbyById(match_id);

  const playerConnections = thisLobby.team_1_connections.concat(thisLobby.team_2_connections);

  let promises: any[] = [];

  playerConnections.forEach(async (playerConnection) => {
    const playerGameState = getPlayerGSFromGlobalGS(thisLobby, playerConnection);
    const serverMessage = {
      messageType: 'game-update',
      gameData: playerGameState
    };
    promises.push(sendToSingleConnection(event, match_id, serverMessage, playerConnection));
  });

  await Promise.all(promises);
};

export const removeLobby = async (match_id: string) => {
  const params = {
    TableName: Table.CurrentMatch.tableName,
    Key: {
      match_id
    }
  };

  await dynamoDB.delete(params);

  return { status: true };
};

export const removePlayerFromLobby = async (
  match_id: string,
  conn_id: string
) => {
  let lobby = await getLobbyById(match_id);

  let removedPlayerUsername = '';

  if (lobby.team_1_connections.includes(conn_id)) {
    const index = lobby.team_1_connections.indexOf(conn_id);
    removedPlayerUsername = lobby.team_1[index];
    lobby.team_1_connections.splice(index, 1);
    lobby.team_1.splice(index, 1);
  } else if (lobby.team_2_connections.includes(conn_id)) {
    const index = lobby.team_2_connections.indexOf(conn_id);
    removedPlayerUsername = lobby.team_2[index];
    lobby.team_2_connections.splice(index, 1);
    lobby.team_2.splice(index, 1);
  } else {
    throw new Error('Player not found in lobby.');
  }

  if (isLobbyEmpty(lobby)) {
    await removeLobby(lobby.match_id);
    return { removedPlayerUsername, isEmpty: true };
  }

  await updateLobby(lobby);

  return { removedPlayerUsername, isEmpty: false };
};
