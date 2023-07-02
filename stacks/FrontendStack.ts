import { StackContext, StaticSite, use } from "sst/constructs";
import { ApiStack } from "./ApiStack";
import { AuthStack } from "./AuthStack";
import { StorageStack } from "./StorageStack";

export function FrontendStack({ stack, app }: StackContext) {
    const { api } = use(ApiStack);
    const { auth } = use(AuthStack);
    const { bucket } = use(StorageStack);

    // Define our React app
    const site = new StaticSite(stack, "ReactSite", {
        customDomain:
            app.stage === "prod"
                ? {
                    domainName: "mytexas42.com",
                    domainAlias: "www.mytexas42.com",
                }
                : undefined,
        path: "frontend",
        buildOutput: "build",
        buildCommand: "yarn build",
        environment: {
            REACT_APP_API_URL: api.customDomainUrl || api.url,
            REACT_APP_REGION: app.region,
            REACT_APP_BUCKET: bucket.bucketName,
            REACT_APP_USER_POOL_ID: auth.userPoolId,
            REACT_APP_IDENTITY_POOL_ID: (auth.cognitoIdentityPoolId as string),
            REACT_APP_USER_POOL_CLIENT_ID: auth.userPoolClientId,
        },
    });

    // Show the url in the output
    stack.addOutputs({
        SiteUrl: site.customDomainUrl || site.url || "http://localhost:3000",
    });
};
