import { Table } from "sst/node/table";
import handler from "@my-texas-42-react-app/core/handler";
import dynamoDB from "@my-texas-42-react-app/core/dynamodb";

export const main = handler(async (event: { body: string, pathParameters: { id: string } }) => {
    const params = {
        TableName: Table.Notes.tableName,
        Key: {
            userId: "123", // The id of the author
            noteId: event.pathParameters.id, // The id of the note from the path
        }
    };

    const result = await dynamoDB.get(params);
    if (!result.Item) {
        throw new Error("Item not  found.");
    }

    // Return the retrieved item
    return result.Item;
});