import { APIGatewayProxyHandler } from 'aws-lambda';
import { removeConnectionFromTable } from 'src/utils/websocket-utils';
import { Table } from 'sst/node/table';
import dynamodb from '@my-texas-42-react-app/core/dynamodb';

export const main: APIGatewayProxyHandler = async (event) => {
  const conn_id = event.requestContext.connectionId ?? '';

  await removeConnectionFromTable(conn_id);

  return { statusCode: 200, body: 'Disconnected' };
};
