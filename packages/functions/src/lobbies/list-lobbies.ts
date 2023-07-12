import { Table } from 'sst/node/table';
import handler from '@my-texas-42-react-app/core/handler';
import dynamoDB from '@my-texas-42-react-app/core/dynamodb';
import { getCurrentUser } from 'src/utils/user-utils';

export interface LobbyInfo {
  match_id: string;
  match_name: string;
  match_invite_code: string;
  match_privacy: number;
  rules: string[];
  team_1: string[];
  team_2: string[];
}

export const main = handler(async (event: any) => {
  const params = {
    TableName: Table.CurrentMatch.tableName,
  };

  const result = await dynamoDB.scan(params);

  const publicLobbies: any[] = [];
  const privateLobbies: any[] = [];

  if (result.Items) {
    const lobbyCount: number = result.Items.length
    for (let i = 0; i < lobbyCount; i++) {
      const lobby = result.Items[i];
      switch (lobby.match_privacy) {
        // 1: public, 2: friends only, 3: invite only (don't show)
        case 1: {
          publicLobbies.push(lobby);
        }
        case 2: {
          const thisUser = await getCurrentUser(event);
          if (lobby.allowed_players.includes(thisUser.username)) {
            privateLobbies.push(lobby);
          }
        }
        default: {
          break;
        }
      }
    }
  }

  return {
    inGame: false,
    publicLobbies,
    privateLobbies,
  };
});