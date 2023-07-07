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

})