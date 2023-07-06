import { getUserByUsername } from "src/utils/user-utils";
import handler from "@my-texas-42-react-app/core/handler";

export const main = handler(async (event: any) => {
    const username = event.pathParameters?.username;

    if (!username) {
        throw new Error("Please specify a username.");
    }

    const thisUser = await getUserByUsername(username);

    const {
        friends,
        incoming_friend_requests,
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
    } = thisUser;

    const response = {
        friends,
        incoming_friend_requests,
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

    return response;
});