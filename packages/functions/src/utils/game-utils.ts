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
  DOUBLES_OWN_SUIT: 'Doubles-own-suit',
  DOUBLES_TRUMP: 'Doubles-trump',
  FOLLOW_ME: 'Follow-me',
  UNDECIDED: 'Undecided'
}

export interface RoundRules {
  bid: number
  biddingTeam: number
  trump: string
  variant: string
}

export const assignPlayerDominoes = (lobby: GlobalGameState) => {
  // get list of all dominoes
  const allDominoes: string[] = [];
  for (let i = 0; i <= 6; i += 1) {
    for (let j = i; j <= 6; j += 1) {
      allDominoes.push(`${j}-${i}`);
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
    p2.push(allDominoes[i + 7]);
    p3.push(allDominoes[i + 14]);
    p4.push(allDominoes[i + 21]);
  }

  lobby.all_player_dominoes = [p1, p2, p3, p4];

  return lobby;
}

export const getIsCalling = (lobby: GlobalGameState) =>
  !lobby.current_is_bidding &&
  getRoundRules(lobby).trump === RULES.UNDECIDED;

export const getIsPlaying = (lobby: GlobalGameState) =>
  !lobby.current_is_bidding &&
  getRoundRules(lobby).trump !== RULES.UNDECIDED;

export const getPlayerMove = (moveString: string) => {
  const fields = moveString.split('\\');
  return {
    username: fields[0],
    moveType: fields[1],
    move: fields[2]
  } as PlayerMove;
}

export const getPlayerPosition = (lobby: GlobalGameState) =>
  (lobby.current_player_turn + 4 - lobby.current_starting_player) % 4

export const checkValidity = (lobby: GlobalGameState, playerMove: PlayerMove) => {
  interface ValidityResponse {
    isValid: boolean;
    message: string;
  }

  const validMoveResponse: ValidityResponse = { isValid: true, message: '' };

  // check if playing out of turn
  if (
    lobby.current_player_turn !==
    getPlayerNumByConnId(lobby, playerMove.connectionId ?? '')
  ) {
    return {
      isValid: false,
      message: 'You are playing out of turn.',
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
    const previousBidStrings = playerPosition
      ? lobby.current_round_history.slice(-playerPosition)
      : [];
    const previousBids = previousBidStrings.map(getPlayerMove);
    let highestBid = 0;
    previousBids.forEach((bid) => {
      const bidNumber = parseInt(bid.move);
      if (bidNumber > highestBid) {
        highestBid = bidNumber;
      }
    });

    // get current bid number
    const thisPlayerBid = parseInt(playerMove.move);

    if (isNaN(thisPlayerBid)) {
      return {
        isValid: false,
        message: 'Invalid bid input.',
      } as ValidityResponse;
    }

    if (thisPlayerBid !== 0 && thisPlayerBid < 30) {
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

    if (thisPlayerBid !== 0 && thisPlayerBid <= highestBid) {
      return {
        isValid: false,
        message: `You must either bid higher than the current highest bid (${highestBid}) or pass.`,
      } as ValidityResponse;
    }

    // force last player to bid
    if (
      playerPosition === 3 &&
      !lobby.rules.includes(RULES.NO_FORCED_BID) &&
      highestBid === 0
    ) {
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

    return validMoveResponse;
  }

  const rules: RoundRules = getRoundRules(lobby);

  const isCalling = getIsCalling(lobby);

  // calling rules
  if (isCalling) {
    // check if player is not calling
    if (playerMove.moveType !== MOVE_TYPES.call) {
      return {
        isValid: false,
        message: 'You need to call the rules of the round.',
      } as ValidityResponse;
    }

    const move = playerMove.move.split(' ')[0];

    const isForcedNil =
      lobby.rules.includes(RULES.FORCED_NIL) &&
      getPlayerMove(lobby.current_round_history[0]).move === '0' &&
      getPlayerMove(lobby.current_round_history[1]).move === '0' &&
      getPlayerMove(lobby.current_round_history[2]).move === '0' &&
      getPlayerMove(lobby.current_round_history[3]).move === '42';

    // check for 2-mark bids
    const twoMarkBids = [RULES.NIL, RULES.SPLASH, RULES.PLUNGE, RULES.SEVENS];
    if (
      twoMarkBids.includes(move) &&
      rules.bid < 84 &&
      !(move === RULES.NIL && isForcedNil)
    ) {
      return {
        isValid: false,
        message: `${move} can only be called as a 2-mark bid.`,
      } as ValidityResponse;
    }

    // don't allow 2-mark bids if the variant is splash or plunge
    // this applies when the teammate of the splashing player is choosing a trump
    const splashBids = [RULES.SPLASH, RULES.PLUNGE];
    if (twoMarkBids.includes(move) && splashBids.includes(rules.variant)) {
      return {
        isValid: false,
        message:
          'You cannot make this call for splash or plunge. Please choose a trump.',
      } as ValidityResponse;
    }

    // only allow splash if player has 3+ doubles and plunge if 4+
    if (splashBids.includes(move)) {
      // count doubles in player's hand
      let doublesInHand = 0;
      const playerDominoes =
        lobby.all_player_dominoes[lobby.current_player_turn];
      playerDominoes.forEach((domino) => {
        const sides = domino.split('-');
        if (sides[0] === sides[1]) doublesInHand += 1;
      });

      if (move === RULES.SPLASH && doublesInHand < 3) {
        return {
          isValid: false,
          message: 'You must have 3 or more doubles to bid splash.',
        } as ValidityResponse;
      }

      if (move === RULES.PLUNGE && doublesInHand < 4) {
        return {
          isValid: false,
          message: 'You must have 4 or more doubles to bid plunge.',
        } as ValidityResponse;
      }
    }

    if (move === RULES.NIL) {
      // check nil bids
      const doublesCall = playerMove.move.split(' ')[1];
      if (
        doublesCall !== RULES.DOUBLES_HIGH &&
        doublesCall !== RULES.DOUBLES_LOW
      ) {
        return {
          isValid: false,
          message: 'You must call doubles high or low for nil.',
        } as ValidityResponse;
      }
    }

    // check everything else
    const trumpCalls = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      RULES.FOLLOW_ME,
      RULES.DOUBLES_TRUMP,
    ];
    if (!twoMarkBids.includes(move) && !trumpCalls.includes(move)) {
      return {
        isValid: false,
        message: 'You must call the trump for the round.',
      } as ValidityResponse;
    }

    return validMoveResponse;
  }

  // verify that the player is playing a correctly formatted domino
  if (!lobby.current_is_bidding && !isCalling) {
    const invalidDominoResponse = {
      isValid: false,
      message: 'Invalid domino input.',
    } as ValidityResponse;
    const dom = playerMove.move;
    if (dom.length !== 3) return invalidDominoResponse;
    if (dom.charAt(1) !== '-') return invalidDominoResponse;

    const side1 = parseInt(dom[0]);
    const side2 = parseInt(dom[2]);

    if (isNaN(side1)) return invalidDominoResponse;
    if (side1 < 0 || side1 > 6) return invalidDominoResponse;
    if (isNaN(side2)) return invalidDominoResponse;
    if (side2 < 0 || side2 > 6) return invalidDominoResponse;
  }

  // check if player is not playing
  if (playerMove.moveType !== MOVE_TYPES.play) {
    return {
      isValid: false,
      message: 'You need to play a domino.',
    } as ValidityResponse;
  }

  // make sure player has this domino
  if (
    !lobby.all_player_dominoes[lobby.current_player_turn].includes(
      playerMove.move
    )
  ) {
    return {
      isValid: false,
      message: 'You do not have this domino.',
    } as ValidityResponse;
  }

  // sevens rules
  if (rules.variant === RULES.SEVENS) {
    const playerDominoes = lobby.all_player_dominoes[lobby.current_player_turn];
    const thisDomino = playerMove.move;
    const thisDominoIndex = playerDominoes.indexOf(thisDomino);

    const differencesFromSeven: number[] = [];
    playerDominoes.forEach((domino) => {
      const sideSum = parseInt(domino[0]) + parseInt(domino[2]);
      const differenceFromSeven = Math.abs(7 - sideSum);
      differencesFromSeven.push(differenceFromSeven);
    });

    const smallestDifference = Math.min(...differencesFromSeven);

    if (differencesFromSeven[thisDominoIndex] > smallestDifference) {
      // the player has a domino that is closer to seven that they can play
      return {
        isValid: false,
        message:
          'You must play the domino in your hand that is closest to seven.',
      } as ValidityResponse;
    }

    return validMoveResponse;
  }

  // make sure starting suit matches if this is not the first player
  const playerPosition = getPlayerPosition(lobby); // returns 0 for first player to bid and 3 for last player to bid
  if (playerPosition) {
    const roundRules = getRoundRules(lobby);
    const previousMoves = lobby.current_round_history
      .slice(-playerPosition)
      .map(getPlayerMove);
    const trump = roundRules.trump;
    const isDoublesTrump = trump === RULES.DOUBLES_TRUMP;
    const firstDominoSides = previousMoves[0].move.split('-');
    const thisDominoSides = playerMove.move.split('-');
    const isStartingDominoDouble = firstDominoSides[0] === firstDominoSides[1];

    // set starting suit to either trump or higher suit on starting domino
    let startingSuit = trump;
    let isDominoNotStartingSuit = false;
    if (isDoublesTrump && isStartingDominoDouble) {
      isDominoNotStartingSuit = thisDominoSides[0] !== thisDominoSides[1];
    } else {
      if (!firstDominoSides.includes(trump)) {
        startingSuit = firstDominoSides[0]; // this works before the larger number is always first
      }
      isDominoNotStartingSuit =
        !thisDominoSides.includes(startingSuit) ||
        (startingSuit !== trump &&
          thisDominoSides.includes(startingSuit) &&
          thisDominoSides.includes(trump));
    }

    if (isDominoNotStartingSuit) {
      // the player's domino must match the starting suit unless the player has no viable dominoes
      const playerDominoes =
        lobby.all_player_dominoes[lobby.current_player_turn];
      let playerHasViableDominoes = false;
      for (let i = 0; i < playerDominoes.length; i++) {
        const playerDominoSides = playerDominoes[i].split('-');
        const playerHasNormalStartingSuit =
          !isDoublesTrump &&
          playerDominoSides.includes(startingSuit) &&
          !(
            startingSuit !== trump &&
            playerDominoSides.includes(startingSuit) &&
            playerDominoSides.includes(trump)
          );
        const playerHasStartingSuitDouble =
          isDoublesTrump &&
          isStartingDominoDouble &&
          playerDominoSides[0] === playerDominoSides[1];
        if (playerHasNormalStartingSuit || playerHasStartingSuitDouble) {
          playerHasViableDominoes = true;
          break;
        }
      }
      if (playerHasViableDominoes) {
        return {
          isValid: false,
          message: 'You need to play a domino that matches the starting suit.',
        } as ValidityResponse;
      }
    }
  }

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
  const rules = getRoundRules(lobby)
  const thisTrick = lobby.current_round_history.slice(-4);
  const dominoes: number[][] = getDominoes(thisTrick);
  let startingSuit = Math.max(dominoes[0][0], dominoes[0][1]);
  if (rules.variant === RULES.SEVENS) {
    const differencesFromSeven = dominoes.map((domino) => Math.abs(7 - (domino[0] + domino[1])));
    const smallestDifference = Math.min(...differencesFromSeven);
    const isSmallestDifference = differencesFromSeven.map((x) => x === smallestDifference);
    const isBiddingTeamWinning = isSmallestDifference[0] || isSmallestDifference[2];
    const winner = isBiddingTeamWinning ? 0 : 1;
    
    const playerNum = (lobby.current_starting_player + winner) % 4;
    return playerNum;
  } else if (!isNaN(parseInt(rules.trump))) {
    // the trump is a number
    const trump = +rules.trump;
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
  } else if (rules.trump === RULES.FOLLOW_ME) {
    let wd = { index: 0, sides: dominoes[0] }; // winning domino
    for (let i = 1; i < 4; i++) {
      const cd = dominoes[i]; // current domino sides

      // continue if winning domino is the double
      if (wd.sides[0] === wd.sides[1]) {
        continue;
      }

      // get highest side of winning domino
      const winningHighestSide =
        wd.sides[0] === startingSuit ? wd.sides[1] : wd.sides[0];

      // get current highest side
      const currentHighestSide = cd[0] === startingSuit ? cd[1] : cd[0];

      // check if this domino is better than winning domino
      if (currentHighestSide > winningHighestSide || cd[0] === cd[1]) {
        // set the new winning domino
        wd = { index: i, sides: cd };
      }
    }

    const playerNum = (lobby.current_starting_player + wd.index) % 4;
    return playerNum;
  } else if (rules.trump === RULES.DOUBLES_TRUMP) {
    let isStartingSuitTrump = false;
    if (dominoes[0][0] === dominoes[0][1]) {
      isStartingSuitTrump = true;
    }
    let wd = { index: 0, sides: dominoes[0] }; // winning domino
    for (let i = 1; i < 4; i++) {
      const cd = dominoes[i]; // current domino sides

      // check if there is a trump on the table
      if (wd.sides[0] === wd.sides[1]) {
        // continue if winning domino is the double six
        if (wd.sides[0] === 6) {
          continue;
        }

        // continue if current domino is not a double
        if (!(cd[0] === cd[1])) {
          continue;
        }

        // get highest side of winning domino (in this case, the number on the double)
        const winningHighestSide = wd.sides[0];

        // get current highest side (in this case, both are fine so we take the first)
        const currentHighestSide = cd[0];

        // check if this domino is better than winning domino
        if (currentHighestSide > winningHighestSide) {
          // set the new winning domino
          wd = { index: i, sides: cd };
          continue;
        }
      } else {
        // check if current domino is a trump (in this case, a double)
        if (cd[0] === cd[1]) {
          // set the new winning domino
          wd = { index: i, sides: cd };
          continue;
        }

        // get higher side of winning domino
        const winningHighestSide =
          wd.sides[0] === startingSuit ? wd.sides[1] : wd.sides[0];

        // get current highest side
        const currentHighestSide = cd[0] === startingSuit ? cd[1] : cd[0];

        // check if this domino is better than winning domino
        if (currentHighestSide > winningHighestSide) {
          // set the new winning domino
          wd = { index: i, sides: cd };
          continue;
        }
      }
    }

    const playerNum = (lobby.current_starting_player + wd.index) % 4;
    return playerNum;
  }

  return -1;
}

export const playDomino = (lobby: GlobalGameState, playerMove: PlayerMove) => {
  const dominoIndex = lobby.all_player_dominoes[lobby.current_player_turn].indexOf(playerMove.move);
  if (dominoIndex > -1) {
    lobby.all_player_dominoes[lobby.current_player_turn].splice(dominoIndex, 1);
  } else {
    const username = getPlayerUsernameByPosition(lobby, lobby.current_player_turn);
    console.log(`Player ${username} does not have domino ${playerMove.move}.`)
  }
  return lobby;
}

export const processBids = (lobby: GlobalGameState) => {
  const allBids = lobby.current_round_history.slice(-4).map(getPlayerMove);

  let highestBid = 0;
  let bidWinner = 0;
  for (let i = 0; i < allBids.length; i++) {
    const bidNumber = parseInt(allBids[i].move);      
    if (bidNumber > highestBid) {
      highestBid = bidNumber;
      bidWinner = (lobby.current_starting_bidder + i) % 4;
    }
  }

  const username = getPlayerUsernameByPosition(lobby, bidWinner);

  const endOfBidMessage = `${username} has won the bid.`;

  lobby.current_round_history.push(endOfBidMessage);
  const roundRules: RoundRules = {
    bid: highestBid,
    biddingTeam: bidWinner % 2 === 0 ? 1 : 2,
    trump: RULES.UNDECIDED,
    variant: ''
  };
  lobby.current_round_rules = JSON.stringify(roundRules);
  lobby.current_is_bidding = false;
  lobby.current_starting_player = bidWinner;
  lobby.current_player_turn = bidWinner;

  return lobby;
}

export const processRoundWinner = (lobby: GlobalGameState, winningTeam: number) => {
  const roundRules = getRoundRules(lobby);
  const roundMarks = Math.ceil((+roundRules.bid) / 42);

  if (winningTeam === 1) {
    lobby.current_team_1_total_score += roundMarks;
  } else {
    lobby.current_team_2_total_score += roundMarks;
  }

  const endOfRoundMessage = `Team ${winningTeam} wins round worth ${roundMarks} marks.`;
  lobby.current_round_history.push(endOfRoundMessage);
  lobby.total_round_history.push(lobby.current_round_history);
  return lobby;
}

export const setRoundRules = (lobby: GlobalGameState, playerMove: PlayerMove) => {
  let currentRules = getRoundRules(lobby);

  if (!isNaN(parseInt(playerMove.move))) {
    currentRules.trump = playerMove.move;
  } else {
    const splashBids = [RULES.SPLASH, RULES.PLUNGE];
    if (splashBids.includes(playerMove.move)) {
      currentRules.variant = playerMove.move;

      if (playerMove.move === RULES.PLUNGE) {
        // add a mark to the bid for plunge
        currentRules.bid += 42;
      }

      lobby.current_round_rules = JSON.stringify(currentRules);
      // set the new calling/starting player to the current calling player's teammate
      lobby.current_starting_player = (lobby.current_starting_player + 2) % 4;
      lobby.current_player_turn = lobby.current_starting_player;

      return lobby;
    }
    
    if (playerMove.move === RULES.SEVENS) {
      currentRules.variant = RULES.SEVENS;
      currentRules.trump = '';
    }
    
    if (playerMove.move.includes(RULES.NIL)) {
      currentRules.variant = RULES.NIL;
      currentRules.trump = playerMove.move.split(' ')[1];
    }
    
    const otherTrumps = [RULES.FOLLOW_ME, RULES.DOUBLES_TRUMP];
    otherTrumps.forEach((otherTrump) => {
      if (playerMove.move.includes(otherTrump)) {
        currentRules.trump = otherTrump;
      }
    });
  }

  lobby.current_round_rules = JSON.stringify(currentRules);
  lobby.current_player_turn = lobby.current_starting_player;

  return lobby;
}

export const startNextRound = (lobby: GlobalGameState) => {
  const new_starting_player =
    lobby.current_round === 0
      ? Math.floor(Math.random() * 4)
      : (lobby.current_starting_bidder + 1) % 4;

  lobby.current_starting_bidder = new_starting_player;

  const roundRules: RoundRules = {
    bid: 0,
    biddingTeam: 0,
    trump: RULES.UNDECIDED,
    variant: ''
  }

  lobby.current_round += 1;
  lobby.current_is_bidding = true;
  lobby.current_player_turn = new_starting_player;
  lobby.current_starting_player = new_starting_player;
  lobby.current_round_history = [];
  lobby.current_round_rules = JSON.stringify(roundRules);
  lobby.current_team_1_round_score = 0;
  lobby.current_team_2_round_score = 0;
  
  lobby = assignPlayerDominoes(lobby);

  return lobby;
}

export const processEndOfTrick = (lobby: GlobalGameState) => {
  // end of trick or bidding phase
  if (lobby.current_is_bidding) {
    lobby = processBids(lobby);
  } else {
    const roundRules = getRoundRules(lobby);

    // decide who won this trick and how many points they won
    const winningPlayerOfTrick = getWinningPlayerOfTrick(lobby);
    const winningTeamOfTrick = winningPlayerOfTrick % 2 === 0 ? 1 : 2;
    const trickScore = getTrickScore(lobby);

    // update lobby
    let isEndOfRound = false;
    const endOfTrickMessage = `Team ${winningTeamOfTrick} wins trick worth ${trickScore} points.`;
    lobby.current_round_history.push(endOfTrickMessage);
    if (winningTeamOfTrick === 1) {
      lobby.current_team_1_round_score += trickScore;
      if (
        (roundRules.biddingTeam === 1 &&
          lobby.current_team_1_round_score >= roundRules.bid) ||
        (roundRules.biddingTeam === 2 &&
          lobby.current_team_1_round_score >= 42 - roundRules.bid)
      ) {
        isEndOfRound = true;
        lobby = processRoundWinner(lobby, 1);
        lobby = startNextRound(lobby);
      }
    } else {
      lobby.current_team_2_round_score += trickScore;
      if (
        (roundRules.biddingTeam === 2 &&
          lobby.current_team_2_round_score >= roundRules.bid) ||
        (roundRules.biddingTeam === 1 &&
          lobby.current_team_2_round_score >= 42 - roundRules.bid)
      ) {
        isEndOfRound = true;
        lobby = processRoundWinner(lobby, 2);
        lobby = startNextRound(lobby);
      }
    }

    if (!isEndOfRound) {
      // start next trick if round is not over
      lobby.current_starting_player = winningPlayerOfTrick;
      lobby.current_player_turn = winningPlayerOfTrick;
    }
  }

  return lobby;
}