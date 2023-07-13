import { APIGatewayProxyHandler } from "aws-lambda";

export const main: APIGatewayProxyHandler = async (event) => {
  const messageData = JSON.parse((event.body as string)).data;
  const { stage, domainName } = event.requestContext;

  console.log(event);

  return { statusCode: 200, body: "Message sent"};
}