import { type Rule } from '../types'

export const RULES: Rule[] = [
  {
    rule_name: 'No forced bid',
    rule_description:
      'If the first three players pass, the fourth player is allowed to pass as well. The dominoes are reshaken.',
    excludes: ['Forced 31 bid', 'Forced Nil'],
    requires: []
  },
  {
    rule_name: 'Forced 31 bid',
    rule_description:
      'If the first three players pass, the fourth player must bid 31 or higher.',
    excludes: ['No forced bid'],
    requires: []
  // },
  // {
  //   rule_name: 'Forced Nil',
  //   rule_description:
  //     'If a player is forced to bid, they have the option to bid 1-mark Nil.',
  //   excludes: ['No forced bid'],
  //   requires: []
  // },
  // {
  //   rule_name: 'Nil',
  //   rule_description:
  //     'A player may bid 2 marks and choose Nil as an option. They may also choose doubles-are-high, doubles-are-low, or doubles-are-their-own-suit.',
  //   excludes: [],
  //   requires: []
  // },
  // {
  //   rule_name: 'Splash',
  //   rule_description:
  //     'A player may bid 2 marks and choose Splash as an option. The player must have at least 3 doubles in their hand.',
  //   excludes: [],
  //   requires: []
  // },
  // {
  //   rule_name: 'Plunge',
  //   rule_description:
  //     'A player may bid 2 marks and choose Plunge as an option. The player must have at least 4 doubles in their hand. Upon choosing plunge, the bid is raised by one mark.',
  //   excludes: [],
  //   requires: ['Splash']
  // },
  // {
  //   rule_name: 'Sevens',
  //   rule_description:
  //     'A player may bid 2 marks and choose Sevens as an option.',
  //   excludes: [],
  //   requires: []
  // },
  // {
  //   rule_name: 'Delve',
  //   rule_description:
  //     'A player may bid delve if they have not yet looked at their hand. Upon bidding delve, the bid is raised to seven marks.',
  //   excludes: [],
  //   requires: []
  }
]
