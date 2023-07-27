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
  lobby.current_round_rules = [];
  lobby.current_team_1_round_score = 0;
  lobby.current_team_2_round_score = 0;
  
  lobby = assignPlayerDominoes(lobby);

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

  return isValidResponse;
}