export const isLobbyFull = (lobby: any) => {
  if (lobby.team_1.length > 2 || lobby.team_2.length > 2) {
    console.log('One of the teams has too many players.')
  }
  return lobby.team_1.length >= 2 && lobby.team_2.length >= 2;
}