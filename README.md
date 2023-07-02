# MyTexas42 Website

Production url: https://www.mytexas42.com/

[![Seed Status](https://api.seed.run/jswood23/my-texas-42-react-app/stages/prod/build_badge)](https://console.seed.run/jswood23/my-texas-42-react-app)

## Installation

If you follow these instructions, you should be running `my-texas-42` in no time at all! If you have any trouble, please refer to the [installation discord channel](https://discord.com/channels/1117123045895716944/1117123046571003946).

1. Install the [Github CLI](https://github.com/cli/cli#installation).
1. Connect your GitHub account to your local machine.
   - Run `gh auth login` and follow instructions to connect to your GitHub account. Make sure not to clone or download any code yet.
1. Download and install GitHub Desktop: https://desktop.github.com/.
1. Install the latest LTS version of [NPM](https://nodejs.org/en/download).
1. Run `npm install -g yarn` to install the latest version of [Yarn](https://yarnpkg.com).
1. Create your own fork of the **my-texas-42** GitHub directory. You can do this by clicking the "Fork" button at the top right of this page.
1. Download (Clone) your my-texas-42 fork to your local machine.

   #### CLI

   1. `git clone [forked-repo-url]` in desired directory.

   #### GitHub Desktop

   1. On your computer, open the GitHub Desktop application and log into your GitHub account if needed.
   1. In the upper left corner, click on the “+” button (or "Current Repository"->"Add").
   1. Find your fork of my-texas-42 in the list. It should have a little Git fork symbol next to it. If you don’t see it, wait a bit for GitHub Desktop to sync with your account. Don’t pick jswood23/my-texas-42 from the list.
   1. Click on "Clone Repository.""
   1. Pick a directory where the clone will live and click on "Clone.""
   1. Watch as the cloned project is downloaded to your machine.

1. Install the AWS CLI: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
1. Message Josh and ask for AWS credentials. Run `aws configure` and enter in the credentials you get when prompted. Just press enter on everything else, this will set those values to the defaults.
1. Open the repository in your terminal and run the following commands:
   - `yarn update`
   - `yarn start`
   1. On Windows: If `yarn update` brings up an error about the execution policy, then open Powershell as an administrator and run the command `Set-ExecutionPolicy AllSigned` and restart your computer to allow yarn to run the installation scripts.
1. Congrats! `my-texas-42-react-app` should now be running locally on your machine!

## Helpful Links

Just like in most websites, we have a frontend and a backend. You can learn about what these terms mean and how they interact here: https://academind.com/tutorials/frontend-vs-backend

The main language we use for the frontend is Javascript with React. You can learn more about development with React here: https://www.hostinger.com/tutorials/what-is-react

We use a library called Material UI to make all of the elements on the page look nice. You can find an exhaustive list of MUI components and how to use them here: https://mui.com/components/

The backend of our website uses DynamoDB, a NoSQL database provided by Amazon Web Services. It interacts with the frontend using an API (Application Program Interface) called GraphQL. The main language in the backend is still Javascript, though. You can learn about these services here:

- NoSQL: https://www.couchbase.com/resources/why-nosql/
- DynamoDB: https://aws.amazon.com/dynamodb/features/
- GraphQL: https://graphql.org/learn/
 
## SST Commands:

Install packages:
```
yarn update
```

Start the web application:
```
yarn start
```

Start the dev console:
```
yarn sst dev
```