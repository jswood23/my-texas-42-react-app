import { dynamoDB } from '@my-texas-42-react-app/core/aws-helpers';
import { Table } from "sst/node/table";

export const main = (event: any, context: any) => {
    return new Promise(async function (resolve, reject) {
        const email = event.request.userAttributes.email;
        // check for missing or invalid values
        if (!email) {
            return reject(Error('missing_email'));
        }

        // check for existing userInfo
        const getEmailParams = {
            TableName: Table.UserInfo.tableName,
            FilterExpression: 'email = :email',
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