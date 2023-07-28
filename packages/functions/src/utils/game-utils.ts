import { GlobalGameState, getPlayerNumByConnId } from "./lobby-utils";

export interface PlayerMove {
  connectionId: string
  move: string
  moveType: string
}

const MOVE_TYPES = {
  bid: 'bid',
  call: 'call',
  play: 'play'
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

export const checkValidity = (lobby: GlobalGameState, playerMove: PlayerMove) => {
  interface ValidityResponse {
    isValid: boolean
    message: string
  }

  const isValidResponse: ValidityResponse = { isValid: true, message: '' };

  // check if playing out of turn
  if (lobby.current_player_turn !== getPlayerNumByConnId(lobby, playerMove.connectionId)) {
    const invalidMoveResponse: ValidityResponse = {
      isValid: false,
      message: 'You are playing out of turn.'
    }
    return invalidMoveResponse;
  }

  // check if player should be bidding and is not
  if (lobby.current_is_bidding && playerMove.moveType !== MOVE_TYPES.bid) {
    const invalidMoveResponse: ValidityResponse = {
      isValid: false,
      message: 'You need to make a bid.'
    }
    return invalidMoveResponse;
  }

  // TODO: add more validity checks

  return isValidResponse;
}

export const getDominoes = (trick: string[]) => {
  // the following returns 4 arrays of 2 numbers each (one for each side of each domino)
  return trick.map((move: string) => move.slice(-3).split('-').map((side) => parseInt(side)));
}

export const getRoundRules = (lobby: GlobalGameState) => {
  const roundRules: RoundRules = JSON.parse(lobby.current_round_rules);
  return roundRules;
};

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