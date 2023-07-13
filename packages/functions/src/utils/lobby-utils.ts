import { Table } from 'sst/node/table';
import dynamoDB from '@my-texas-42-react-app/core/dynamodb';

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

  return result.Items[0];
};

export const isLobbyFull = (lobby: any) => {
  if (lobby.team_1.length > 2 || lobby.team_2.length > 2) {
    console.log('One of the teams has too many players.');
  }
  return lobby.team_1.length >= 2 && lobby.team_2.length >= 2;
};
