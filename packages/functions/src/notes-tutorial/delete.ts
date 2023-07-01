import { Table } from "sst/node/table";
import handler from "@my-texas-42-react-app/core/handler";
import dynamoDB from "@my-texas-42-react-app/core/dynamodb";

export const main = handler(async (event: { body: string, pathParameters: { id: string } }) => {
    const params = {
        TableName: Table.Notes.tableName,

        // 'Key' defines the partition key and sort key of the item to be removed
        Key: {
            userId: "123", // The id of the author
            noteId: event.pathParameters.id, // The id of the note from the path
        },
    };

    await dynamoDB.delete(params);
    
    return { status: true };
});