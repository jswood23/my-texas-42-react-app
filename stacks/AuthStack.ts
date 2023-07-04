import * as iam from "aws-cdk-lib/aws-iam";
import { Cognito, use, StackContext, Api } from "sst/constructs";
import { StorageStack } from "./StorageStack";
import { ApiStack } from "./ApiStack";

export function AuthStack({ stack, app }: StackContext) {
    const { bucket, userInfoTable } = use(StorageStack);
    const { api } = use(ApiStack);

    const auth = new Cognito(stack, "Auth", {
        login: ["email", "username"],
        triggers: {
            preSignUp: "packages/functions/src/users/check-existing-email.main",
            postConfirmation: "packages/functions/src/users/create-user-info.main"
        }
    });

    auth.attachPermissionsForAuthUsers(stack, [
        // Allow access to the API
        api,

        // Policy granting access to a specific folder in the bucket
        new iam.PolicyStatement({
            actions: ["s3:*"],
            effect: iam.Effect.ALLOW,
            resources: [
                bucket.bucketArn + "/private/${cognito-identity.amazonaws.com:sub}/*",
            ],
        }),
    ]);

    auth.bindForTriggers([userInfoTable]);

    // Show the auth resources in the output
    stack.addOutputs({
        Region: app.region,
        UserPoolId: auth.userPoolId,
        IdentityPoolId: auth.cognitoIdentityPoolId,
        UserPoolClientId: auth.userPoolClientId,
    });

    // Return the auth resource
    return {
        auth,
    };
};