import { getUserByUsername } from "src/utils/user-utils";
import { dynamoDB, handler } from '@my-texas-42-react-app/core/aws-helpers';
import { getCurrentUser } from 'src/utils/user-utils';
import { Table } from "sst/node/table";

//remove someone from current user's friend list

export const main = handler(async (event: any) => 
{
    const you = event.pathParameters?.username;

    if (!you) {
        throw new Error("Please specify a username.");
    }
    
    //get new friend as user object
    const enemy = await getUserByUsername(you);

    //get yourself as string and user object
    const rejecter = await getCurrentUser(event)
    const me_fr_fr = rejecter.username

    //check if your new enemy is in your friends list
    if (!rejecter.friends.includes(you)) {
        throw new Error("This user is not in your friend list")
    }

    //get rejecter's friends list and splice enemy from that list
    //aparrently splice() is really weird?
    let my_friend_list = rejecter.friends
    const ind = my_friend_list.indexOf(enemy.username)
    let temp = my_friend_list.splice(ind, 1)
    //get enemy's friends list and splice rejecter's name from the list
    let their_friend_list = enemy.friends
    const index = their_friend_list.indexOf(rejecter.username)
    let temp2 = their_friend_list.splice(index,1)
    
    const my_params=
    {
        TableName: Table.UserInfo.tableName,
        Key: {
            user_id: rejecter.user_id,
        },
        UpdateExpression: "SET friends = :friends",
        ExpressionAttributeValues: {
            //make database request to set friends = my_new_friends
            ":friends": my_friend_list,
        },
        ReturnValues: "ALL_NEW",
    };
    const their_params=
    {
        TableName: Table.UserInfo.tableName,
        Key: {
            user_id: enemy.user_id,
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