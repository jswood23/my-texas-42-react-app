import { getUserById, getUserByUsername } from "src/utils/user-utils";
import { dynamoDB, handler } from '@my-texas-42-react-app/core/aws-helpers';
import { getCurrentUser } from 'src/utils/user-utils';
import { Table } from "sst/node/table";

//removes someone else's name from your incoming friend requests

export const main = handler(async (event: any) => 
{
    const you = event.pathParameters?.username;

    if (!you) {
        throw new Error("Please specify a username.");
    }
    
    //get new friend as user object
    const requester = await getUserByUsername(you);

    //get yourself as string and user object
    const rejecter = await getCurrentUser(event)
    const me_fr_fr = rejecter.username

    //check if requester has sent a friend request
    if (!rejecter.incoming_friend_requests.includes(you)) {
        throw new Error("This user has not sent you a friend request")
    }

    //creates copy of current incoming_friend_requests
    let my_friend_requests = rejecter.incoming_friend_requests
    
    //removes friend request from rejecters list
    const ind = my_friend_requests.indexOf(requester.username)
    let my_new_friend_requests = my_friend_requests.splice(ind, 1)

    const params=
    {
        TableName: Table.UserInfo.tableName,
        Key: {
            user_id: rejecter.user_id,
        },
        UpdateExpression: "SET incoming_friend_requests = :incoming_friend_requests",
        ExpressionAttributeValues: {
            //make database request to set incoming_friend_requests = my_new_friend_requests
            ":incoming_friend_requests": my_new_friend_requests,
        },
        ReturnValues: "ALL_NEW",
    };
    
    console.log('here')

    await dynamoDB.update(params);
    return {status: true};
})