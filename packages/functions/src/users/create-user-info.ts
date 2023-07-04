import { Table } from "sst/node/table";
import handler from "@my-texas-42-react-app/core/handler";
import dynamoDB from "@my-texas-42-react-app/core/dynamodb";

export const main = handler(async (event: any) => {
    const data = JSON.parse(event.body);

    const params = {
        TableName: Table.UserInfo.tableName,
        Item: {
            user_id: data.user_id,
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

    await dynamoDB.put(params);

    return params.Item;
});