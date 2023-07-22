import AWS from 'aws-sdk';

const client = new AWS.DynamoDB.DocumentClient();

export const dynamoDB = {
    get: (params: any) => client.get(params).promise(),
    put: (params: any) => client.put(params).promise(),
    query: (params: any) => client.query(params).promise(),
    update: (params: any) => client.update(params).promise(),
    delete: (params: any) => client.delete(params).promise(),
    scan: (params: any) => client.scan(params).promise(),
};

export function handler(lambda: any) {
    return async function (event: any, context: any) {
        let body, statusCode;
        
        try {
            // Run the Lambda
            body = await lambda(event, context);
            statusCode = 200;
        } catch (e: any) {
            console.error(e);
            body = { error: e.message };
            statusCode = 500;
        }

        // Return HTTP response
        return {
            statusCode,
            body: JSON.stringify(body),
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
        };
    };
}    