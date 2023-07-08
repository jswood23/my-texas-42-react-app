import { getUserById, getUserByUsername } from "src/utils/user-utils";
import handler from "@my-texas-42-react-app/core/handler";
import dynamoDB from "@my-texas-42-react-app/core/dynamodb";
import { Table } from "sst/node/table";

//remove your own name from the recipient's incoming_friend_requests list

export const main = handler(async (event: any) => 
{
    const you = event.pathParameters?.username;

    if (!you) {
        throw new Error("Please specify a username.");
    }
    
    //get recipient of request
    const recipient = await getUserByUsername(you);

    //get yourself as string and user object
    const me_fr_fr = event.requestContext.authorizer.iam.cognitoIdentity.amr[2].slice(-36);
    const canceller = await getUserById(me_fr_fr)

    //error: cancel request when someone has already accepted it
    if (recipient.friends.includes(me_fr_fr))
    {
        throw new Error("The user has already accepted the friend request")
    }

    //creates copy of current incoming_friend_request list
    let new_list = recipient.incoming_friend_requests

    //removes canceller from list by getting the index of name, and splicing list at that value
    const ind = new_list.indexOf(canceller.username)
    const real_list = new_list.splice(ind, 1)

    const params=
    {
        TableName: Table.UserInfo.tableName,
        Key: {
            user_id: canceller.user_id,
        },
        UpdateExpression: "SET incoming_friend_requests = :incoming_friend_requests",
        ExpressionAttributeValues: {
            //make databse request to set incoming_friend_requests equal to real_list
            ":incoming_friend_requests": real_list
        },
        ReturnValues: "ALL_NEW",
    };
    
    await dynamoDB.update(params);
    return {status: true};

})