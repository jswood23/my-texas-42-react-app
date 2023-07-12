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
        times_bidding_total: 'number',
        times_bidding_by_suit: 'number',
        times_bidding_nil: 'number',
        times_bidding_splash: 'number',
        times_bidding_plunge: 'number',
        times_bidding_sevens: 'number',
        times_bidding_delve: 'number',
      },
      primaryIndex: { partitionKey: 'user_id' },
      cdk: {
        table: {
          pointInTimeRecovery: false,
        },
      },
    });

    const matchHistoryTable = new Table(stack, 'MatchHistory', {
      fields: {
        match_id: 'string',
        match_name: 'string',
        match_privacy: 'number',
        rules: 'string',
        team_1: 'string', // list
        team_2: 'string', // list
        winners: 'number',
        total_score: 'string',
        total_rounds: 'number',
        round_type: 'string', // list
        round_bidder: 'string', // list
        round_winner: 'string', // list
        round_score: 'string', // list
      },
      primaryIndex: { partitionKey: 'match_id' },
      cdk: {
        table: {
          pointInTimeRecovery: false,
        },
      },
    });

    const currentMatchTable = new Table(stack, 'CurrentMatch', {
      fields: {
        match_id: 'string',
        match_name: 'string',
        match_invite_code: 'string',
        match_privacy: 'number',
        allowed_players: 'string', // list
        rules: 'string', // list
        team_1: 'string', // list
        team_2: 'string' // list
      },
      primaryIndex: { partitionKey: 'match_id' },
      cdk: {
        table: {
          pointInTimeRecovery: false,
        },
      },
    });

    const rulesetTable = new Table(stack, 'Ruleset', {
      fields: {
        ruleset_id: 'string',
        ruleset_name: 'string',
        ruleset_description: 'string',
        rules: 'string', // list
      },
      primaryIndex: { partitionKey: 'ruleset_id' },
      cdk: {
        table: {
          pointInTimeRecovery: false,
        },
      },
    });

    return {
      bucket,
      currentMatchTable,
      matchHistoryTable,
      notesTable,
      rulesetTable,
      userInfoTable,
    };
}