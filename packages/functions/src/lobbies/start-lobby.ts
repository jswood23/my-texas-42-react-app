import { getCurrentUser } from 'src/utils/user-utils';
import { Table } from 'sst/node/table';
import dynamoDB from '@my-texas-42-react-app/core/dynamodb';
import handler from '@my-texas-42-react-app/core/handler';
import * as uuid from "uuid";

const generateString = (length: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i ++) {
    result += characters.charAt(Math.floor(Math.random() * 36));
  }
  return result;
}

export const main = handler(async (event: any) => {
  const data = JSON.parse(event.body);
  const thisUser = await getCurrentUser(event);

  if (!data.matchName) throw new Error('Please specify a match name.');
  if (!data.privacy) throw new Error('Please specify a match privacy level.');
  
  const params = {
    TableName: Table.CurrentMatch.tableName,
    Item: {
      match_id: uuid.v1(),
      match_name: data.matchName,
      match_invite_code: generateString(6),
      match_privacy: data.privacy,
      allowed_players: thisUser.friends,
      rules: data.rules ?? [],
      team_1: [thisUser.username],
      team_2: [],
    },
  };

  await dynamoDB.put(params);

  return { match_invite_code: params.Item.match_invite_code };
});