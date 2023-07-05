import { ApiStack } from "./stacks/ApiStack";
import { AuthStack } from "./stacks/AuthStack";
import { FrontendStack } from "./stacks/FrontendStack";
import { SSTConfig } from "sst";
import { StorageStack } from "./stacks/StorageStack";

export default {
  config(_input) {
    return {
      name: "my-texas-42-react-app",
      region: "us-east-1",
    };
  },

  stacks(app) {
    if (app.stage !== "prod") {
      app.setDefaultRemovalPolicy('destroy');
    }

    app.stack(StorageStack)
      .stack(ApiStack)
      .stack(AuthStack)
      .stack(FrontendStack);
  },
} satisfies SSTConfig;
