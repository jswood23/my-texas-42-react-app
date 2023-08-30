import { getUserByUsername } from "src/utils/user-utils";
import { dynamoDB, handler } from '@my-texas-42-react-app/core/aws-helpers';
import { getCurrentUser } from 'src/utils/user-utils';
import { Table } from "sst/node/table";

//adds someone else's name to your list of friends

export const main = handler(async (event: any) => 
{
    const you = event.pathParameters?.username;

    if (!you) {
        throw new Error("Please specify a username.");
    }
    
    //get new friend as user object
    const new_friend = await getUserByUsername(you);

    //get yourself as string and user object
    const accepter = await getCurrentUser(event)
    const me_fr_fr = accepter.username

    //creates copy of current friend list and incoming_friend_requests, and new_friends friend list
    let my_friend_list = accepter.friends
    let my_friend_requests = accepter.incoming_friend_requests
    let their_friend_list = new_friend.friends

    //check if new friend's username is in current user's incoming friend requests.
    if (!accepter.incoming_friend_requests.includes(you)) {
        throw new Error("This person has not sent you a friend request");
    }

    //adds new_friend username to that list and removes friend request
    my_friend_list.push(new_friend.username)
    their_friend_list.push(accepter.username)
    const ind = my_friend_requests.indexOf(new_friend.username)
    let my_new_friend_requests = my_friend_requests.splice(ind, 1)

    const my_params=
    {
        TableName: Table.UserInfo.tableName,
        Key: {
            user_id: accepter.user_id,
        },
        UpdateExpression: "SET friends = :friends, incoming_friend_requests = :incoming_friend_requests",
        ExpressionAttributeValues: {
            ":friends": my_friend_list,
            ":incoming_friend_requests": my_friend_requests,
        },
        ReturnValues: "ALL_NEW",
    };

    const their_params=
    {
        TableName: Table.UserInfo.tableName,
        Key: {
            user_id: new_friend.user_id,
        },
        UpdateExpression: "SET friends = :friends",
        ExpressionAttributeValues: {
            ":friends": their_friend_list,
        },
        ReturnValues: "ALL_NEW",
    };
    
    await dynamoDB.update(my_params);
    await dynamoDB.update(their_params);
    return {status: true};
})