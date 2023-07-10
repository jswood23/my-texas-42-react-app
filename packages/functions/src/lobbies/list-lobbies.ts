import { Table } from 'sst/node/table';
import handler from '@my-texas-42-react-app/core/handler';
import dynamoDB from '@my-texas-42-react-app/core/dynamodb';


export const main = handler(async (event: any) => {
  const publicLobbies: any[] = [];
  const privateLobbies: any[] = [];
  return {
    inGame: false,
    publicLobbies,
    privateLobbies,
  };
});