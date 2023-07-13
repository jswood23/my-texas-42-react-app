import { APIGatewayProxyHandler } from "aws-lambda";
import { Table } from "sst/node/table";
import dynamodb from "@my-texas-42-react-app/core/dynamodb";

export const main: APIGatewayProxyHandler = async (event) => {
  console.log(event);

  return { statusCode: 200, body: 'Connected' };
}