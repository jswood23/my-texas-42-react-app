import { getUserById, getUserByUsername } from "src/utils/user-utils";
import handler from "@my-texas-42-react-app/core/handler";
import dynamoDB from "@my-texas-42-react-app/core/dynamodb";
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
    const me_fr_fr = event.requestContext.authorizer.iam.cognitoIdentity.amr[2].slice(-36);
    const accepter = await getUserById(me_fr_fr)

    //creates copy of current friend list and incoming_friend_requests
    let new_list = accepter.friends
    let new_list2 = accepter.incoming_friend_requests

    //adds new_friend username to that list and removes friend request
    new_list.push(new_friend.username)
    const ind = new_list.indexOf(new_friend.username)
    const real_list = new_list.splice(ind, 1)

    const params=
    {
        TableName: Table.UserInfo.tableName,
        Key: {
            user_id: accepter.user_id,
        },
        UpdateExpression: "SET friends = :friends, incoming_friend_requests = :incoming_friend_requests",
        ExpressionAttributeValues: {
            //make databse request to set friends equal to new_list
            ":friends": new_list,
            ":incoming_friend_requests": real_list,
        },
        ReturnValues: "ALL_NEW",
    };
    
    await dynamoDB.update(params);
    return {status: true};
})