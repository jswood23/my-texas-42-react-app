import { GlobalGameState, getPlayerNumByConnId, getPlayerUsernameByPosition } from "./lobby-utils";

export interface PlayerMove {
  connectionId?: string
  username?: string
  move: string
  moveType: string
}

const MOVE_TYPES = {
  bid: 'bid',
  call: 'call',
  play: 'play'
}

const RULES = {
  NO_FORCED_BID: 'No forced bid',
  FORCED_31_BID: 'Forced 31 bid',
  FORCED_NIL: 'Forced Nil',
  NIL_2_MARK: '2-mark Nil',
  SPLASH_2_MARK: '2-mark Splash',
  PLUNGE_2_MARK: '2-mark Plunge',
  SEVENS_2_MARK: '2-mark Sevens',
  DELVE: 'Delve',
  NIL: 'Nil',
  SPLASH: 'Splash',
  PLUNGE: 'Plunge',
  SEVENS: 'Sevens',
  DOUBLES_HIGH: 'Doubles-high',
  DOUBLES_LOW: 'Doubles-low',
  FOLLOW_ME: 'Follow-me'
}

export interface RoundRules {
  bid: number
  biddingTeam: number
  trump: number
}

export const assignPlayerDominoes = (lobby: GlobalGameState) => {
  // get list of all dominoes
  const allDominoes: string[] = [];
  for (let i = 0; i <= 6; i += 1) {
    for (let j = i; j <= 6; j += 1) {
      allDominoes.push(`${i}-${j}`);
    }
  }

  // shake dominoes
  for (let i = allDominoes.length - 1; i > 0; i -= 1) {
    const randomIndex: number = Math.floor(Math.random() * (i + 1));

    [allDominoes[i], allDominoes[randomIndex]] = [allDominoes[randomIndex], allDominoes[i]];
  }
  
  // assign dominoes
  const p1: string[] = [];
  const p2: string[] = [];
  const p3: string[] = [];
  const p4: string[] = [];
  for (let i = 0; i <= 6; i += 1) {
    p1.push(allDominoes[i]);
    p2.push(allDominoes[i] + 7);
    p3.push(allDominoes[i] + 14);
    p4.push(allDominoes[i] + 21);
  }

  lobby.all_player_dominoes = [p1, p2, p3, p4];

  return lobby;
}

export const getBidNumber = (bidString: string) => {
  try {
    if (bidString.includes('-mark')) {
      return parseInt(bidString.charAt(0)) * 42
    } else {
      return parseInt(bidString);
    }
  } catch {
    return 0;
  }
}

export const getPlayerMove = (moveString: string) => {
  const fields = moveString.split('\\');
  return {
    username: fields[0],
    moveType: fields[1],
    move: fields[2]
  } as PlayerMove;
}

export const getPlayerPosition = (lobby: GlobalGameState) =>
  (lobby.current_player_turn + 4 - lobby.current_starting_bidder) % 4

export const checkValidity = (lobby: GlobalGameState, playerMove: PlayerMove) => {
  interface ValidityResponse {
    isValid: boolean
    message: string
  }

  const validMoveResponse: ValidityResponse = { isValid: true, message: '' };

  // check if playing out of turn
  if (lobby.current_player_turn !== getPlayerNumByConnId(lobby, playerMove.connectionId ?? '')) {
    return {
      isValid: false,
      message: 'You are playing out of turn.'
    } as ValidityResponse;
  }

  // bidding rules
  if (lobby.current_is_bidding) {
    // check if player is not bidding
    if (playerMove.moveType !== MOVE_TYPES.bid) {
      return {
        isValid: false,
        message: 'You need to make a bid.',
      } as ValidityResponse;
    }

    const playerPosition = getPlayerPosition(lobby); // returns 0 for first player to bid and 3 for last player to bid

    // get highest bid so far
    const previousBidStrings = playerPosition ? [] : lobby.current_round_history.slice(-playerPosition);
    const previousBids = previousBidStrings.map(getPlayerMove);
    let highestBid = 0;
    previousBids.forEach((bid) => {
      const bidNumber = getBidNumber(bid.move);      
      if (bidNumber > highestBid) {
        highestBid = bidNumber;
      }
    })

    // get current bid number
    const thisPlayerBid = getBidNumber(playerMove.move);

    // force last player to bid
    if (playerPosition === 3 && !lobby.rules.includes(RULES.NO_FORCED_BID) && highestBid === 0) {
      if (lobby.rules.includes(RULES.FORCED_31_BID) && thisPlayerBid < 31) {
        return {
          isValid: false,
          message: 'You must bid 31 or higher.',
        } as ValidityResponse;
      }

      if (!lobby.rules.includes(RULES.FORCED_31_BID) && thisPlayerBid < 30) {
        return {
          isValid: false,
          message: 'You must bid 30 or higher.',
        } as ValidityResponse;
      }
    }

    if (thisPlayerBid !== 0 && thisPlayerBid < Math.max(highestBid, 30)) {
      return {
        isValid: false,
        message: 'The minimum bid is 30.',
      } as ValidityResponse;
    }

    if (thisPlayerBid > 42 && thisPlayerBid % 42 !== 0) {
      return {
        isValid: false,
        message: 'Invalid bid amount.',
      } as ValidityResponse;
    }

    if (thisPlayerBid > 84 && thisPlayerBid / 42 !== highestBid / 42 + 1) {
      return {
        isValid: false,
        message: 'You cannot bid more than 1 mark above the current bid.',
      } as ValidityResponse;
    }

    return validMoveResponse;
  }

  const rules: string[] = lobby.current_round_rules.split('\\');

  // calling rules
  if (rules.length === 1) {
    // check if player is not calling
    if (playerMove.moveType !== MOVE_TYPES.call) {
      return {
        isValid: false,
        message: 'You need to call the rules of the round.',
      } as ValidityResponse;
    }

    const move = playerMove.move.split(' ')[0];
    const bid = +rules[1];

    const isForcedNil =
      lobby.rules.includes(RULES.FORCED_NIL) &&
      getPlayerMove(lobby.current_round_history[0]).move === "0" &&
      getPlayerMove(lobby.current_round_history[1]).move === "0" &&
      getPlayerMove(lobby.current_round_history[2]).move === "0" &&
      getPlayerMove(lobby.current_round_history[3]).move === "42";

    // check for 2-mark bids
    const twoMarkBids = [RULES.NIL, RULES.SPLASH, RULES.PLUNGE, RULES.SEVENS];
    if (twoMarkBids.includes(move) && bid < 84 && !(move === RULES.NIL && isForcedNil)) {
      return {
        isValid: false,
        message: `${move} can only be called as a 2-mark bid.`,
      } as ValidityResponse;
    }

    // check nil bids
    if (move === RULES.NIL) {
      const doublesCall = playerMove.move.split(' ')[1];
      if (doublesCall !== RULES.DOUBLES_HIGH && doublesCall !== RULES.DOUBLES_LOW) {
        return {
          isValid: false,
          message: 'You must call doubles high or low for nil.',
        } as ValidityResponse;
      }
    }

    // check everything else
    const trumpCalls = ['0', '1', '2', '3', '4', '5', '6', RULES.FOLLOW_ME];
    if (!twoMarkBids.includes(move) && !trumpCalls.includes(move)) {
      return {
        isValid: false,
        message: 'You must call the trump for the round.',
      } as ValidityResponse;
    }
  }

  // TODO: add more validity checks

  return validMoveResponse;
}

export const getDominoes = (trick: string[]) => {
  // the following returns 4 arrays of 2 numbers each (one for each side of each domino)
  return trick.map((move: string) => move.slice(-3).split('-').map((side) => parseInt(side)));
}

export const getPlayerMoveString = (playerMove: PlayerMove) =>
  `${playerMove.username ?? 'undefined'}\\${playerMove.moveType}\\${playerMove.move}`;

export const getRoundRules = (lobby: GlobalGameState) => 
  JSON.parse(lobby.current_round_rules) as RoundRules;

export const getTrickScore = (lobby: GlobalGameState) => {
  const thisTrick = lobby.current_round_history.slice(-4);
  const dominoes: number[][] = getDominoes(thisTrick);
  let score = 1;
  dominoes.forEach((domino) => {
    if ((domino[0] + domino[1]) % 5 === 0) {
      score += domino[0] + domino[1];
    }
  });
  return score;
}

export const getWinningPlayerOfTrick = (lobby: GlobalGameState) => {
  const thisTrick = lobby.current_round_history.slice(-4);
  const dominoes: number[][] = getDominoes(thisTrick);
  let startingSuit = Math.max(dominoes[0][0], dominoes[0][1]);
  // if there is a trump
  const trump = getRoundRules(lobby).trump;
  if (trump >= 0) {
    if (dominoes[0][0] === trump || dominoes[0][1] === trump) {
      startingSuit = trump;
    }
  }
  let wd = { index: 0, sides: dominoes[0] }; // winning domino
  for (let i = 1; i < 4; i++) {
    const cd = dominoes[i]; // current domino sides

    // check if there is a trump on the table
    if (wd.sides[0] === trump || wd.sides[1] === trump) {
      // continue if winning domino is the double
      if (wd.sides[0] === wd.sides[1]) {
        continue;
      }

      // continue if current domino is not a trump
      if (!(cd[0] === trump || cd[1] === trump)) {
        continue;
      }

      // get highest side of winning domino
      const winningHighestSide = wd.sides[0] === trump ? wd.sides[1] : wd.sides[0];

      // get current highest side
      const currentHighestSide = cd[0] === trump ? cd[1] : cd[0];

      // check if this domino is better than winning domino
      if (currentHighestSide > winningHighestSide || cd[0] === cd[1]) {
        // set the new winning domino
        wd = { index: i, sides: cd };
        continue;
      }
    } else {
      // check if current domino is a trump
      if (cd[0] === trump || cd[1] === trump) {
        // set the new winning domino
        wd = { index: i, sides: cd };
        continue;
      }

      // continue if winning domino is the double
      if (wd.sides[0] === wd.sides[1]) {
        continue;
      }

      // get highest side of winning domino
      const winningHighestSide = wd.sides[0] === startingSuit ? wd.sides[1] : wd.sides[0];

      // get current highest side
      const currentHighestSide = cd[0] === startingSuit ? cd[1] : cd[0];

      // check if this domino is better than winning domino
      if (currentHighestSide > winningHighestSide || cd[0] === cd[1]) {
        // set the new winning domino
        wd = { index: i, sides: cd };
        continue;
      }
    }
  }

  const playerNum = (lobby.current_starting_player + wd.index) % 4;
  return playerNum;
}

export const processBids = (lobby: GlobalGameState) => {
  const allBids = lobby.current_round_history.slice(-4).map(getPlayerMove);

  let highestBid = 0;
  let bidWinner = 0;
  for (let i = 0; i < allBids.length; i++) {
    const bidNumber = getBidNumber(allBids[i].move);      
    if (bidNumber > highestBid) {
      highestBid = bidNumber;
      bidWinner = i;
    }
  }

  const username = getPlayerUsernameByPosition(lobby, bidWinner);

  const endOfBidMessage = `${username} has won the bid.`;

  lobby.current_round_history.push(endOfBidMessage);
  lobby.current_round_rules = highestBid.toString();
  lobby.current_is_bidding = false;
  lobby.current_player_turn = (lobby.current_starting_bidder + bidWinner) % 4;

  return lobby;
}

export const processRoundWinner = (lobby: GlobalGameState, winningTeam: number) => {
  // TODO: add logic here
  return lobby;
}

export const startNextRound = (lobby: GlobalGameState) => {
  if (lobby.current_round === 0) {
    lobby.current_starting_bidder = Math.floor(Math.random() * 4)
  } else {
    lobby.current_starting_bidder += 1;
    if (lobby.current_starting_bidder >= 4) lobby.current_starting_bidder = 0;
  }

  lobby.current_round += 1;
  lobby.current_is_bidding = true;
  lobby.current_player_turn = lobby.current_starting_bidder;
  lobby.current_round_history = [];
  lobby.current_round_rules = '';
  lobby.current_team_1_round_score = 0;
  lobby.current_team_2_round_score = 0;
  
  lobby = assignPlayerDominoes(lobby);

  return lobby;
}