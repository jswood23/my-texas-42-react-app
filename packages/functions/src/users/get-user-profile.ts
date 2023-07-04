import { Table } from "sst/node/table";
import handler from "@my-texas-42-react-app/core/handler";
import dynamoDB from "@my-texas-42-react-app/core/dynamodb";

export const main = handler(async (event: any) => {
    const thisUserId = event.requestContext?.authorizer?.iam?.cognitoIdentity?.identityId || '';
    const username = event.pathParameters?.username;

    if (!username) {
        throw new Error("Please specify a username.");
    }

    const params = {
        TableName: Table.UserInfo.tableName,
        FilterExpression: 'username = :username',
        ExpressionAttributeValues: {
            ":username": username,
        },
    }

    const result = await dynamoDB.scan(params);

    if (result.Items?.length === 0 || !result.Items) {
        throw new Error("User does not exist.");
    }

    const {
        user_id,
        friends,
        incoming_friend_requests,
        is_admin,
        game_history,
        games_played,
        games_won,
        rounds_played,
        rounds_won,
        total_points_as_bidder,
        total_rounds_as_bidder,
        total_points_as_support,
        total_rounds_as_support,
        total_points_as_counter,
        total_rounds_as_counter,
    } = result.Items[0];

    const response = {
        game_history,
        games_played,
        games_won,
        rounds_played,
        rounds_won,
        total_points_as_bidder,
        total_rounds_as_bidder,
        total_points_as_support,
        total_rounds_as_support,
        total_points_as_counter,
        total_rounds_as_counter,
    }

    const isOwnProfile = user_id === thisUserId;

    if (isOwnProfile) {
        // add data to the response if this is the user's own profile
        return {
            ...response,
            friends,
            incoming_friend_requests,
            is_admin,
        };
    }

    return response;
});