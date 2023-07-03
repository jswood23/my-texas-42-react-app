import { Bucket, StackContext, Table } from "sst/constructs";

export function StorageStack({ stack, app }: StackContext) {
    // Create an S3 bucket
    const bucket = new Bucket(stack, "Uploads", {
        cors: [
            {
                maxAge: "1 day",
                allowedOrigins: ["*"],
                allowedHeaders: ["*"],
                allowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
            },
        ],
    });

    // Create the DynamoDB tables
    const notesTable = new Table(stack, 'Notes', {
      fields: {
        userId: 'string',
        noteId: 'string',
      },
      primaryIndex: { partitionKey: 'userId', sortKey: 'noteId' },
      cdk: {
        table: {
          pointInTimeRecovery: false,
        },
      },
    });

    const userInfoTable = new Table(stack, 'UserInfo', {
      fields: {
        user_id: 'string',
        username: 'string',
        email: 'string',
        is_admin: 'binary',
        friends: 'string', // list
        incoming_friend_requests: 'string', // list
        game_history: 'string', // list
        games_played: 'number',
        games_won: 'number',
        rounds_played: 'number',
        rounds_won: 'number',
        total_points_as_bidder: 'number',
        total_rounds_as_bidder: 'number',
        total_points_as_support: 'number',
        total_rounds_as_support: 'number',
        total_points_as_counter: 'number',
        total_rounds_as_counter: 'number',
      },
      primaryIndex: { partitionKey: 'user_id' },
      cdk: {
        table: {
          pointInTimeRecovery: false,
        },
      },
    });

    return {
      bucket,
      notesTable,
      userInfoTable,
    };
}