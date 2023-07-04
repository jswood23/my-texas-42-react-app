import { Table } from "sst/node/table";
import dynamoDB from "@my-texas-42-react-app/core/dynamodb";

export const main = (event: any, context: any) => {
    return new Promise(async function (resolve, reject) {
        const email = event.request.userAttributes.email;
        // check for missing or invalid values
        if (!email) {
            return reject(Error('"missing or invalid email"'));
        }

        // check for existing userInfo
        const getEmailParams = {
            TableName: Table.UserInfo.tableName,
            FilterExpression: 'email = :email',
            // KeyConditionExpression: "email = :email",
            ExpressionAttributeValues: {
                ":email": email,
            },
        };

        const emailResult = await dynamoDB.scan(getEmailParams);

        if (emailResult.Items) {
            if (emailResult.Items.length > 0) {
                return reject(Error('existing_email'));
            }
        }

        return resolve(event);
    });
};