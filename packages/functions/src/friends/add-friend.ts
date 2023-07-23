import { getUserById, getUserByUsername } from "src/utils/user-utils";
import { dynamoDB, handler } from '@my-texas-42-react-app/core/aws-helpers';
import { getCurrentUser } from 'src/utils/user-utils';
import { Table } from "sst/node/table";
//every user has list of friends and list of friend requests
//add-friend sends a friend request. it adds your name to the recipient's list of friend requests
//The variable that contains the username of the user sending the request is event.requestContext.authorizer.iam.cognitoIdentity.identityId

export const main = handler(async (event: any) => 
{
    const you = event.pathParameters?.username;

    if (!you) {
        throw new Error("Please specify a username.");
    }
    
    //get recipient of request
    const recipient = await getUserByUsername(you);

    //get sender of request 
    const sender = await getCurrentUser(event)
    const me_fr_fr = sender.username

    if(recipient.friends.includes(me_fr_fr) || sender.friends.includes(you))
    {
        throw new Error("You're already friends with this player");
    }

    if(recipient.incoming_friend_requests.includes(me_fr_fr))
    {
        throw new Error("You've already sent a request to this player");
    }

    if(sender.incoming_friend_requests.includes(you))
    {   
        //I copied and pasted code because I'm scared
        //get lists of both sender and recipient's friends and sender friend requests
        let my_friend_list = sender.friends
        let my_friend_requests = sender.incoming_friend_requests
        let their_friend_list = recipient.friends

        //make them friends, remove the recipient's friend request from sender's incoming friend request list
        my_friend_list.push(recipient.username)
        their_friend_list.push(sender.username)
        const ind = my_friend_requests.indexOf(recipient.username)
        let my_new_friend_requests = my_friend_requests.splice(ind, 1)

        const my_params=
        {
            TableName: Table.UserInfo.tableName,
            Key: {
                user_id: sender.user_id,
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
                user_id: recipient.user_id,
            },
            UpdateExpression: "SET friends = :friends",
            ExpressionAttributeValues: {
                ":friends": their_friend_list,
            },
            ReturnValues: "ALL_NEW",
        }
        await dynamoDB.update(my_params);
        await dynamoDB.update(their_params)
        //stop when its done
        return {status: true};
    }
    
    //add me_fr_fr to recipient incoming_friend_requests
    let recipient_friend_requests = recipient.incoming_friend_requests
    //adds me_fr_fr to end of new_request array. push = append
    recipient_friend_requests.push(sender.username)
    const params = 
    {
        TableName: Table.UserInfo.tableName,
        Key: {
            user_id: recipient.user_id,
        },
        UpdateExpression: "SET incoming_friend_requests = :incoming_friend_requests",
        ExpressionAttributeValues: {
            //make a database request to set incoming_friend_request to new_request
            ":incoming_friend_requests": recipient_friend_requests,
        },
        ReturnValues: "ALL_NEW",
    };

    await dynamoDB.update(params);
    return {status: true};
})