import { Table } from "sst/node/table";
import handler from "@my-texas-42-react-app/core/handler";
import dynamoDB from "@my-texas-42-react-app/core/dynamodb";

export const main = handler(async (event: any) => {
    const data = JSON.parse(event.body);

    const user_id = event.requestContext.authorizer.iam.cognitoIdentity.identityId;

    // check for missing or invalid values
    if (!data.username || !data.email) {
        throw new Error('Missing or invalid user data.');
    }

    // check for existing userInfo
    const getParams = {
        TableName: Table.UserInfo.tableName,
        KeyConditionExpression: "user_id = :user_id",
        ExpressionAttributeValues: {
            ":user_id": user_id,
        },
    };

    const result = await dynamoDB.query(getParams);

    if (result.Items) {
        if (result.Items.length > 0) {
            throw new Error('A user info entity already exists for this user.');
        }
    }

    // create new entry
    const putParams = {
        TableName: Table.UserInfo.tableName,
        Item: {
            user_id,
            username: data.username,
            email: data.email,
            is_admin: false,
            friends: [],
            incoming_friend_requests: [],
            game_history: [],
            games_played: 0,
            games_won: 0,
            rounds_played: 0,
            rounds_won: 0,
            total_points_as_bidder: 0,
            total_rounds_as_bidder: 0,
            total_points_as_support: 0,
            total_rounds_as_support: 0,
            total_points_as_counter: 0,
            total_rounds_as_counter: 0,
        },
    };

    await dynamoDB.put(putParams);

    return putParams.Item;
});