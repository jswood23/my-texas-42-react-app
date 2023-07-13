import { Table } from 'sst/node/table';
import dynamoDB from '@my-texas-42-react-app/core/dynamodb';

export interface WebSocketConnection {
  conn_id: string
  match_id: string
  user_id: string
}

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

  return ( params.Item as WebSocketConnection);
};

export const getConnectionById = async (conn_id: string) => {
  const params = {
    TableName: Table.SocketConnection.tableName,
    Key: {
      conn_id: conn_id,
    },
  };

  const result = await dynamoDB.get(params);

  if (!result.Item) {
    throw new Error('WebSocket connection does not exist.');
  }

  return result.Item as WebSocketConnection;
};

export const getConnectionsByMatchId = async (match_id: string) => {
  const params = {
    TableName: Table.SocketConnection.tableName,
    FilterExpression: 'match_id = :match_id',
    ExpressionAttributeValues: {
      ':match_id': match_id,
    },
  };

  const result = await dynamoDB.scan(params);

  if (!result.Items) {
    throw new Error('There are currently no connected users in the specified lobby.');
  }

  const conn_ids: string[] = [];

  (result.Items as WebSocketConnection[]).forEach((connection: WebSocketConnection) => {
    conn_ids.push(connection.conn_id);
  })

  return conn_ids;
}

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