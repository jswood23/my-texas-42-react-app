import { getUserById, getUserByUsername } from "src/utils/user-utils";
import handler from "@my-texas-42-react-app/core/handler";
import dynamoDB from "@my-texas-42-react-app/core/dynamodb";
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

    const me_fr_fr = event.requestContext.authorizer.iam.cognitoIdentity.amr[2].slice(-36);
    //console.log(me_fr_fr)

    const sender = await getUserById(me_fr_fr)

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
        //make them friends
        
        //stop when its done
        return {status: true};
    }
    
    //add me_fr_fr to recipient incoming_friend_requests
    let new_list = recipient.incoming_friend_requests
    //adds me_fr_fr to end of new_request array. push = append
    new_list.push(sender.username)
    const params = 
    {
        TableName: Table.UserInfo.tableName,
        Key: {
            user_id: recipient.user_id,
        },
        UpdateExpression: "SET incoming_friend_requests = :incoming_friend_requests",
        ExpressionAttributeValues: {
            //make a database request to set incoming_friend_request to new_request
            ":incoming_friend_requests": new_list,
        },
        ReturnValues: "ALL_NEW",
    };

    await dynamoDB.update(params);
    return {status: true};
})