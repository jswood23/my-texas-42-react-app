import { Cognito, use, StackContext } from "sst/constructs";
import { StorageStack } from "./StorageStack";
import { ApiStack } from "./ApiStack";

export function AuthStack({ stack, app }: StackContext) {
    const { userInfoTable } = use(StorageStack);
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