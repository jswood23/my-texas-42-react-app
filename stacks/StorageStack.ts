import { StackContext, Table } from "sst/constructs";

export function StorageStack({ stack }: StackContext) {
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
        chat_log: 'string', //list
      },
      primaryIndex: { partitionKey: 'match_id' },
      cdk: {
        table: {
          pointInTimeRecovery: false,
        },
      },
    });

    const chatLogTable = new Table(stack, 'ChatLog', {
      fields: {
        match_id: 'string',
        messages: 'string',
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
        team_1_connections: 'string', // list
        team_2: 'string', // list
        team_2_connections: 'string', // list
        current_round: 'number',
        current_starting_bidder: 'number',
        current_is_bidding: 'binary',
        current_player_turn: 'number',
        current_round_rules: 'string', // list
        all_player_dominoes: 'string', // list
        current_team_1_round_score: 'number',
        current_team_2_round_score: 'number',
        current_team_1_total_score: 'number',
        current_team_2_total_score: 'number',
        current_round_history: 'string', // list
        total_round_history: 'string', // list
        chat_log: 'string', // list
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

    const socketConnectionTable = new Table(stack, 'SocketConnection', {
      fields: {
        conn_id: 'string',
        user_id: 'string',
        match_id: 'string',
      },
      primaryIndex: { partitionKey: 'conn_id' },
      cdk: {
        table: {
          pointInTimeRecovery: false,
        },
      },
    });

    return {
      chatLogTable,
      currentMatchTable,
      matchHistoryTable,
      notesTable,
      rulesetTable,
      socketConnectionTable,
      userInfoTable,
    };
}