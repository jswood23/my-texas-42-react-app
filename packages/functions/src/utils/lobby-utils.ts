import { Table } from 'sst/node/table';
import dynamoDB from '@my-texas-42-react-app/core/dynamodb';

export interface Lobby {
  match_id: string
  match_name: string
  match_invite_code: string
  match_privacy: number
  allowed_players: string[]
  rules: string[]
  team_1: string[]
  team_1_connections: string[]
  team_2: string[]
  team_2_connections: string[]
  current_round: number
  current_starting_bidder: number
  current_is_bidding: boolean
  current_player_turn: number
  current_round_rules: string[]
  current_team_1_round_score: number
  current_team_2_round_score: number
  current_team_1_total_score: number
  current_team_2_total_score: number
  current_round_history: string[]
  total_round_history: string[]
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

  return (result.Item as Lobby);
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

  return (result.Items[0] as Lobby);
};

export const isLobbyEmpty = (lobby: Lobby) => {
  return lobby.team_1.length === 0 && lobby.team_2.length === 0;
};

export const isLobbyFull = (lobby: Lobby) => {
  if (lobby.team_1.length > 2 || lobby.team_2.length > 2) {
    console.log('One of the teams has too many players.');
  }
  return lobby.team_1.length >= 2 && lobby.team_2.length >= 2;
};

export const updateLobby = async (lobby: Lobby) => {
  const attributesToChange = [
    'team_1',
    'team_1_connections',
    'team_2',
    'team_2_connections',
    'current_round',
    'current_starting_bidder',
    'current_is_bidding',
    'current_player_turn',
    'current_round_rules',
    'current_team_1_round_score',
    'current_team_2_round_score',
    'current_team_1_total_score',
    'current_team_2_total_score',
    'current_round_history',
    'total_round_history',
  ];
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

export const removeLobby = async (match_id: string) => {
  const params = {
    TableName: Table.CurrentMatch.tableName,
    Key: {
      match_id
    }
  };

  await dynamoDB.delete(params);

  return { status: true };
}

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
