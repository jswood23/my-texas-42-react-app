import { Table } from 'sst/node/table';
import dynamoDB from '@my-texas-42-react-app/core/dynamodb';

export const addConnectionToTable = async (conn_id: string, match_id: string, user_id: string) => {
  const params = {
    TableName: Table.SocketConnection.tableName,
    Item: {
      conn_id,
      match_id,
      user_id
    }
  };

  await dynamoDB.put(params);

  return params.Item;
};

export const removeConnectionFromTable = async (conn_id: string) => {
  const params = {
    TableName: Table.SocketConnection.tableName,
    Key: {
      conn_id,
    },
  };

  await dynamoDB.delete(params);

  return { status: true };
};