import { Table } from 'sst/node/table';
import dynamoDB from '@my-texas-42-react-app/core/dynamodb';

export const getCurrentUser = async (event: any) => {
  const id = event.requestContext.authorizer.iam.cognitoIdentity.amr[2].slice(-36);
  
  const params = {
    TableName: Table.UserInfo.tableName,
    Key: {
      user_id: id,
    },
  };

  const result = await dynamoDB.get(params);

  if (!result.Item) {
    throw new Error('User does not exist.');
  }

  return result.Item as any;
}

export const getUserByUsername = async (username: string) => {
  const params = {
    TableName: Table.UserInfo.tableName,
    FilterExpression: 'username = :username',
    ExpressionAttributeValues: {
      ':username': username,
    },
  };

  const result = await dynamoDB.scan(params);

  if (result.Items?.length === 0 || !result.Items) {
    throw new Error('User does not exist.');
  }

  return result.Items[0];
}
