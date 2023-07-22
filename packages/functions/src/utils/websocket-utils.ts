import { ApiGatewayManagementApi } from 'aws-sdk';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { dynamoDB } from '@my-texas-42-react-app/core/aws-helpers';
import { removePlayerFromLobby } from './lobby-utils';
import { Table } from 'sst/node/table';

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

export const sendToConnections = async (event: APIGatewayProxyEvent, match_id: string, messageData: any, conn_ids: string[]) => {
  const { stage, domainName } = event.requestContext;

  if (stage && domainName) {
    const apiG = new ApiGatewayManagementApi({
      endpoint: `${domainName}/${stage}`,
    });

    const messageDataStr = JSON.stringify(messageData);

    await Promise.all(conn_ids.map(async (conn_id) => {
      try {
        await apiG
          .postToConnection({ ConnectionId: conn_id, Data: messageDataStr })
          .promise()
      } catch (e: any) {
        if (e.statusCode === 410) {
          await removePlayerFromLobby(match_id, conn_id);
          await removeConnectionFromTable(conn_id);
        } else {
          console.log('Unknown error encountered:');
          console.log(e);
        }
      }
    }));
  }
};

export const sendToSingleConnection = async (event: APIGatewayProxyEvent, match_id: string, messageData: any, conn_id: string) => {
  const { stage, domainName } = event.requestContext;

  if (stage && domainName) {
    const apiG = new ApiGatewayManagementApi({
      endpoint: `${domainName}/${stage}`,
    });

    const messageDataStr = JSON.stringify(messageData);

    try {
      await apiG
        .postToConnection({ ConnectionId: conn_id, Data: messageDataStr })
        .promise()
    } catch (e: any) {
      if (e.statusCode === 410) {
        await removePlayerFromLobby(match_id, conn_id);
        await removeConnectionFromTable(conn_id);
      } else {
        console.log('Unknown error encountered:');
        console.log(e);
      }
    }
  }
};