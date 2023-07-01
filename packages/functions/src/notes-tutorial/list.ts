import { Table } from "sst/node/table";
import handler from "@my-texas-42-react-app/core/handler";
import dynamoDB from "@my-texas-42-react-app/core/dynamodb";

export const main = handler(async (event: any) => {
    const params = {
        TableName: Table.Notes.tableName,
        // 'KeyConditionExpression' defines the condition for the query
        // - 'userId = :userId': only return items with matching 'userId'
        // partition key
        KeyConditionExpression: "userId = :userId",
        // 'ExpressionAttributeValues' defines the value in the condition
        // - ':userId': defines 'userId' to be the id of the author
        ExpressionAttributeValues: {
            ":userId": event.requestContext.authorizer.iam.cognitoIdentity.identityId,
        },
    };
    
    const result = await dynamoDB.query(params);

    // Return the matching list of items in response body
    return result.Items;
});