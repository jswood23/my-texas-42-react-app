import { ApiStack } from "./stacks/ApiStack";
import { AuthStack } from "./stacks/AuthStack";
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
    app.stack(StorageStack)
      .stack(ApiStack)
      .stack(AuthStack);
  }
} satisfies SSTConfig;
