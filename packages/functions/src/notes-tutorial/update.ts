import { Table } from "sst/node/table";
import handler from "@my-texas-42-react-app/core/handler";
import dynamoDB from "@my-texas-42-react-app/core/dynamodb";

export const main = handler(async (event: { body: string, pathParameters: { id: string } }) => {
    // Request body is passed in as a JSON encoded string in 'event.body'
    const data = JSON.parse(event.body);

    const params = {
        TableName: Table.Notes.tableName,
        Key: {
            userId: "123", // The id of the author
            noteId: event.pathParameters.id, // The id of the note from the path
        },
        UpdateExpression: "SET content = :content, attachment = :attachment",
        ExpressionAttributeValues: {
            ":attachment": data.attachment || null,
            ":content": data.content || null,
        },
        ReturnValues: "ALL_NEW",
    };

    await dynamoDB.update(params);

    return { status: true };
});