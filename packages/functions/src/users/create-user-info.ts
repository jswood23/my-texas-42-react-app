import { Table } from "sst/node/table";
import handler from "@my-texas-42-react-app/core/handler";
import dynamoDB from "@my-texas-42-react-app/core/dynamodb";

export const main = (event: any, context: any) => {
    return new Promise(async function (resolve, reject) {
        const { userName } = event;
        const { email, sub } = event.request.userAttributes;

        // check for missing or invalid values
        if (!userName || !email) {
            return reject(Error('Missing or invalid user data.'));
        }

        // check for existing userInfo
        const getParams = {
            TableName: Table.UserInfo.tableName,
            KeyConditionExpression: "user_id = :user_id",
            ExpressionAttributeValues: {
                ":user_id": sub,
            },
        };

        const result = await dynamoDB.query(getParams);

        if (result.Items) {
            if (result.Items.length > 0) {
                return reject(Error('A user info entity already exists for this user.'));
            }
        }

        // create new entry
        const putParams = {
          TableName: Table.UserInfo.tableName,
          Item: {
            user_id: sub,
            username: userName,
            email: email,
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
            times_bidding_total: 0,
            times_bidding_by_suit: [0, 0, 0, 0, 0, 0, 0],
            times_bidding_nil: 0,
            times_bidding_splash: 0,
            times_bidding_plunge: 0,
            times_bidding_sevens: 0,
            times_bidding_delve: 0,
          },
        };

        try {
            await dynamoDB.put(putParams);
        } catch (e: any) {
            return reject(Error(e.message || e));
        }

        return resolve(event);
    });
};