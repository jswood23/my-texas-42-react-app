import { Typography } from '@mui/material'
import PageContainer from '../../shared/page-container'
import type { GlobalObj } from '../../types'
import styled from 'styled-components'

interface Props {
  globals: GlobalObj
}

const StyledRoot = styled.div(({ theme }) => ({
  '.main-header': {
    fontSize: theme.spacing(4),
    marginTop: theme.spacing(2)
  },
  '.paragraph': {
    fontSize: theme.spacing(2)
  },
  '.second-header': {
    fontSize: theme.spacing(3),
    marginTop: theme.spacing(1)
  },
  '.one-para': {
    fontSize: theme.spacing(2),
    color: theme.palette.domino.color1,
    display: 'inline-block'
  },
  '.two-para': {
    fontSize: theme.spacing(2),
    color: theme.palette.domino.color2,
    display: 'inline-block'
  },
  '.three-para': {
    fontSize: theme.spacing(2),
    color: theme.palette.domino.color3,
    display: 'inline-block'
  },
  '.four-para': {
    fontSize: theme.spacing(2),
    color: theme.palette.domino.color4,
    display: 'inline-block'
  },
  '.five-para': {
    fontSize: theme.spacing(2),
    color: theme.palette.domino.color5,
    display: 'inline-block'
  },
  '.six-para': {
    fontSize: theme.spacing(2),
    color: theme.palette.domino.color6,
    display: 'inline-block'
  }
}))

const Rulespage = ({ globals }: Props) => (
  <PageContainer globals={globals} title="Rules">
    <StyledRoot>
      <Typography className="main-header">About</Typography>
      <Typography className="paragraph">
        Texas 42, or 42, is a table-top game played with a set of double-six dominoes.
        Two teams of two people each face off, with the goal of winning 7 marks. The first team to reach 7 marks wins the game.

        Texas 42 was reported invented in Garner, Texas over 100 years ago. It has since become a popular game across the entire state, and even the nation.
        The game is especially beloved by the student body at Texas A&M, being the game of choice of the Singing Cadets, Student Bonfire, and the Corps of Cadets.
        However, all these groups play the game by their own unique rules. Indeed, 42 has many different variants that can make learning how to play the game intimidating for newcomers.
        This guide was created with the goal of teaching beginners the basics, as well as a reference for seasoned players who want to learn the different variants.

        Feel free to jump between sections and refer to the Terminology section as needed. The rules may be difficult to grasp at first, but with a little practice you will discover an in-depth game of counting, strategy, risk, and even bluffing.
      </Typography>
      <Typography className="main-header">Terminology</Typography>
      <Typography className="paragraph"><ul>
        <li><b>Mark</b>: A point earned by winning a normal round. The first team to reach 7 marks wins the game.</li>
        <li><b>Trick</b>: A set of four dominoes, each played by a different player.</li>
        <li><b>Double</b>: A domino with the same number of dots on the top and bottom of the domino.</li>
        <li><b>Count</b>: A domino that has dots equal to a multiple of 5 on its surface. Count dominoes alter the amount of points a trick is worth.</li>
        <li><b>Suit</b>: A set of dots on either the upper or lower part of the domino. The highest suit on the first domino played in a trick is the “suit” for the round.</li>
        <li><b>Trump</b>: The suit that is set as the highest suit in the round.</li>
        <li><b>Hand</b>: The set of seven dominoes that is picked up by each player at the beginning of the round. Can also refer to a “round” of dominoes.</li>
        <li><b>Table Talk</b>: Communication about bidding or hands between teammates. Giving information about your hand to your teammate is illegal.</li>
        <li><b>Off</b>: A domino that is not guaranteed to win a trick.</li></ul>
      </Typography>
      <Typography className="main-header">Getting Started</Typography>
      <Typography className="paragraph">
      In a traditional environment, the players sit around a flat table with teammates sitting across from each other. Each player then flips a domino.
      The player that has the highest domino <span>based on its suit</span> shakes first. Once the dominoes are shaken, the two players on the opposing team of the shaker draw their dominoes first, then the shaker’s teammate draws,
      then the shaker takes the dominoes that are left. Each player takes 7 dominoes. They can be held in one’s hands or balanced on their sides, facing away from the other players.
      The other players are not allowed to know what dominoes you have, including your partner. Virtually, all of this is done automatically.
      </Typography>
      <Typography className="main-header">Playing a Regular Mark Hand</Typography>
      <Typography className="paragraph">
        If a player wins a bid, the next step is for the winner to decide what the trump is and start the first trick of the round. The “trump” is a special dominant suit in the round and is decided by whoever wins the bid.
        Once the trump is declared, the first domino is laid on the table from the player who won the bid. Some variants allow for no trump to be declared, which is declared by the bidder saying “follow me”.
        The goal of the team that won the bid is to earn the number of points required to make their bid. For example, if a player bids 32, they must earn 32 out of the 42 possible points one can win in a bid. The goal of the opposing team is to prevent the bid-winning team from making their bid.
        Each “trick”, or set of four dominoes played by each player, is worth 1 point plus the amount of count. Whichever player places the highest domino wins the trick.
        Players place their dominoes in clockwise order, and after the first trick the player that won the previous trick plays first. If a team “makes their bid” or earns greater than or equal to the points they bid, there is no need to continue the mark.
        In this case the bidding team earns one mark, and the dominoes are shaken by the player to the left of the previous player who shook. Similarly, if the opposing team earns enough points to make it impossible for the bidding team to make their bid, the opposing team earns the mark.
        Tricks are won by playing the highest domino, but bids are won by winning count. More details about how to play a regular mark hand follow below.
      </Typography>
      <ul><Typography className="second-header"><li>Suits</li></Typography></ul>
      <Typography className="paragraph">
        It is essential to understand how suits work. There are seven basic suits, <Typography className="six-para">sixes</Typography>, <Typography className="five-para">fives</Typography>, <Typography className="four-para">fours</Typography>, <Typography className="three-para">threes</Typography>, <Typography className="two-para">twos</Typography>, <Typography className="one-para">ones</Typography>, and blanks. The no suit call is “follow me”, and there is also a “doubles are a suit of their own” call.
        The suit of a domino/trick is set when the first domino is played. By default, the suit is the higher of the two numbers on the domino. So, a <Typography className="four-para">four</Typography>-<Typography className="two-para">two</Typography> would be a <Typography className="four-para">four</Typography>, and the suit of the trick is also a <Typography className="four-para">four</Typography>. So, for this trick, any domino with a <Typography className="four-para">four</Typography> on it <span>except trump</span> becomes a <Typography className="four-para">four</Typography>, no matter the other number on it.
        This is important for a few reasons. To win the trick, one must have the highest value domino on the table. The wrinkle is that one cannot necessarily play whatever they want. For starters, if one possesses a domino of the same suit as what was led, then they must play it.
        If one has multiples of the same suit as the lead domino, then they can choose which one they would like to play amongst those in suit. If one has nothing in-suit, then they can play whatever they choose, but the domino is worthless to win the trick it is played in.
        This is where one would want to play count if their partner led or withhold it otherwise. The hierarchy of dominoes in a suit is by the numerical value of the secondary set of dots EXCEPT FOR THE DOUBLE. The double is the highest in every suit.
        Otherwise, the higher the secondary number, the higher the domino’s value in the suit. The exception to all of this is trumps.
      </Typography>
      <Typography className="paragraph">
        For example, if the suit in a trick is <Typography className="five-para">fives</Typography>, no players play trump, one player plays the <Typography className="five-para">5</Typography>-<Typography className="six-para">6</Typography>, and another plays the <Typography className="five-para">5</Typography>-<Typography className="five-para">5</Typography>, the player that played the <Typography className="five-para">5</Typography>-<Typography className="five-para">5</Typography> will win the trick because the <Typography className="five-para">5</Typography>-<Typography className="five-para">5</Typography> is the double of the <Typography className="five-para">5s</Typography>. Despite the <Typography className="five-para">5</Typography>-<Typography className="five-para">5</Typography> being numerically being less than the <Typography className="five-para">5</Typography>-<Typography className="six-para">6</Typography>, the <Typography className="five-para">5</Typography>-<Typography className="five-para">5</Typography> still wins because it is a double and the suit is <Typography className="five-para">fives</Typography>.
      </Typography>
      <ul><Typography className="second-header"><li>Trumps</li></Typography></ul>
      <Typography className="paragraph">
        The game gets more interesting when trumps are considered. As said earlier, trumps are a special dominant suit. Trump can be any of the seven suits, and the trump can also be doubles if the bidder makes a call called “doubles are a suit of their own”.
        Designating the trump has two effects on the suit chosen. First, any domino with the chosen number on it is always that suit, no matter what is led. So, for example, if <Typography className="two-para">twos</Typography> are trumps and someone leads with the <Typography className="four-para">4</Typography>-<Typography className="four-para">4</Typography> and Jordan has the <Typography className="two-para">2</Typography>-<Typography className="four-para">4</Typography>, Jordan wouldn’t be required to play it because even if it were his only domino with a <Typography className="four-para">four</Typography> on it, it is not a <Typography className="four-para">four</Typography>, it is a <Typography className="two-para">two</Typography>.
        Second, unlike any other dominos, when played out of suit, a trump becomes the highest domino in the trick. This is referred to as “trumping in”. Ideally you should only trump in when you know you will get count. It is often advantageous to intentionally lose a trick you might have been able to trump into if all you’d lose is one point.
        Otherwise trumps work like any other suit. If a trump is led, other players must play a trump. If multiple players play a trump, the highest trump will win the trick.
      </Typography>
      <ul><Typography className="second-header"><li>Count</li></Typography></ul>
      <Typography className="paragraph">
        Another important aspect to consider is count. Count dominos are identified as any domino whose total number of pips adds up to ten or five. The five count dominoes are the <Typography className="six-para">6</Typography>-<Typography className="four-para">4</Typography>, <Typography className="five-para">5</Typography>-<Typography className="five-para">5</Typography>, <Typography className="three-para">3</Typography>-<Typography className="two-para">2</Typography>, <Typography className="five-para">5</Typography>-0, and <Typography className="four-para">4</Typography>-<Typography className="one-para">1</Typography>. When a count domino is played in a trick the value of that trick is 1 plus the value of the count domino.
        So, a trick where the <Typography className="four-para">4</Typography>-<Typography className="four-para">4</Typography>, <Typography className="four-para">4</Typography>-<Typography className="six-para">6</Typography>, <Typography className="four-para">4</Typography>-0, and <Typography className="four-para">4</Typography>-<Typography className="one-para">1</Typography> are played is worth 1 + 10 + 5, or 16 total points. Where the 1 point is the value of the whole trick, and the 10 and 5 are the values of each count domino added to that.
      </Typography>
      <Typography className="main-header">Example Hand</Typography>
      <Typography className="paragraph">
        Let’s say that Josh wins a 31 bid and calls <Typography className="four-para">fours</Typography> as the trump. Because he won his bid, he plays first, and he decides to play the <Typography className="four-para">4</Typography>-<Typography className="four-para">4</Typography>. The other players must play dominoes with <Typography className="four-para">fours</Typography> on it because the first domino is a <Typography className="four-para">four</Typography>. The other players play (beginning with the player to Josh’s left and moving clockwise, ending at the player at Josh’s right) a <Typography className="four-para">4</Typography>-<Typography className="one-para">1</Typography>, <Typography className="four-para">4</Typography>-<Typography className="five-para">5</Typography>, and a <Typography className="four-para">4</Typography>-<Typography className="three-para">3</Typography> respectively. Josh wins the bid because he played the double <Typography className="four-para">4</Typography>, the highest domino in the suit.
        By winning this trick, Josh earned 6 points towards making his bid. He earned one point because he won the trick, and an additional 5 points because of the <Typography className="four-para">4</Typography>-<Typography className="one-para">1</Typography>, which is count.
      </Typography>
      <Typography className="paragraph">
        Next, Josh plays the <Typography className="six-para">6</Typography>-<Typography className="four-para">4</Typography>. If <Typography className="four-para">fours</Typography> were not the trump, the suit for the trick would be <Typography className="six-para">sixes</Typography>. However, because <Typography className="four-para">fours</Typography> are the trump, the <Typography className="six-para">6</Typography>-<Typography className="four-para">4</Typography> is a <Typography className="four-para">four</Typography>, NOT a <Typography className="six-para">six</Typography>. Therefore, the suit is <Typography className="four-para">four</Typography> and every player must play a <Typography className="four-para">four</Typography> if they have it. Josh’s partner, Owen, has the <Typography className="three-para">3</Typography>-<Typography className="two-para">2</Typography> domino, which is a 5-count.
        Owen wants to give Josh count, however Owen has to play in suit. So he plays the <Typography className="four-para">4</Typography>-0. Aidan plays the <Typography className="two-para">2</Typography>-<Typography className="one-para">1</Typography>, and Roman plays the <Typography className="one-para">1</Typography>-0. Aidan and Roman do not have to play in suit because they do not have a four, so they can play whatever they want. Because Josh played the highest <Typography className="four-para">4</Typography>, he wins the trick worth 11 points due to the <Typography className="six-para">6</Typography>-<Typography className="four-para">4</Typography> being a 10-count.
        This brings the total amount of points that Owen and Josh have won to 11+6 = 17 points.
      </Typography>
      <Typography className="paragraph">
        Josh decides to play the <Typography className="five-para">5</Typography>-0 next. Because <Typography className="five-para">5</Typography> is the highest suit on the domino, the suit is <Typography className="five-para">fives</Typography>. Roman sees a chance to take the trick and plays the <Typography className="five-para">5</Typography>-<Typography className="five-para">5</Typography> domino. Owen plays the <Typography className="four-para">4</Typography>-<Typography className="two-para">2</Typography>, and Aidan plays the <Typography className="three-para">3</Typography>-0.
        The <Typography className="five-para">5</Typography>-<Typography className="five-para">5</Typography> is the highest <Typography className="five-para">5</Typography>, so if no trumps were played Roman would have won the trick, however Owen played the <Typography className="four-para">4</Typography>-<Typography className="two-para">2</Typography>, which is a trump. If Owen had a <Typography className="five-para">five</Typography>, he would be forced to play it, however because he doesn’t have a <Typography className="five-para">five</Typography> he can play whatever he wants, and uses this opportunity to secure the trick for his team.
        Owen wins the trick, which is worth 1+5+10= 16 points. This brings Owen’s team points up to 17+16 = 33 points. Because Josh bid 31 points and his team has secured 33 points, Josh and Owen have made their bid and win the mark.
      </Typography>
      <Typography className="main-header">Variants</Typography>
      <Typography className="paragraph">
        As said earlier, there are many different variant rules used by different communities. This is a list of the most common variant game modes and rules in the state, however it is by no means a comprehensive list of every single 42 variant.
      </Typography>
      <ul><Typography className="second-header"><li>Forced Bid Limits</li></Typography>
        <Typography className="paragraph">
        The most common 42 variant rule is the forced bid rule. The forced bid rule states that when the bid is passed by everyone at the table, the person who shakes (i.e., the person who bids last) must bid a minimum of a certain amount. Generally, this value is 30, however in some variants, such as the one played by the Texas A&M Singing Cadets, the minimum bid is 31.
        </Typography>
      <ul><Typography className="second-header"><li>One Mark</li></Typography>
        <Typography className="paragraph">
          The One Mark variant allows for one-mark bids to be made if and only if the bidder is being forced to bid. One-mark calls are similar to two-mark calls in that the bidding team must win every trick in the hand. Special variants such as nil and splash can be played with one-mark bids.
        </Typography></ul></ul>
      <ul><Typography className="second-header"><li>Two Mark</li></Typography>
        <Typography className="paragraph">
          The two-mark bid is a bid that indicates the bidder wants to bid two marks on their hand. The catch is that the bidder must win every trick in the hand, and if they lose even one trick the opposing team wins two marks.
          A two-mark bid beats any one-mark bid below it <span>30, 31, 32, 42, etc.</span>. A player can also bid more than two marks ONLY if another player has bid a number of marks one below the marks you would like to bid. For example, if I bid two marks and you’re bidding after me, you are able to bid three marks. My teammate after you can bid four marks only if you decide to bid three marks.
        </Typography>
        <Typography className="paragraph">
          There are many unique game modes that require at least a two-mark bid to be able to do, however normal hands are possible with two-mark bids as well. The special game modes that you can play with multi-mark bids are outlined below.
        </Typography>
      <ul><Typography className="second-header"><li>Nil</li></Typography>
        <Typography className="paragraph">
          Nil, also known as nello or nillo, is the most one of the most complicated alternate game modes in 42, however it is also one of the most common. Nil has three important characteristics:
        </Typography>
          <ol>
            <Typography className="paragraph"><li>There are no trumps.</li></Typography>
            <Typography className="paragraph"><li>The teammate of the bidder does not play</li></Typography>
            <Typography className="paragraph"><li>The bidder is trying to LOSE every hand rather than win every hand.</li></Typography>
          </ol>
        <Typography className="paragraph">
          Besides these, the game is played as a normal mark hand. The bidder plays the first domino, dominoes are played clockwise, and the winner of the trick plays the next domino.
          Because it is a multi-mark bid, the dominoes stay in the middle of the table rather than be pulled to the side of whoever wins the trick. New dominoes are stacked on top of the old ones. If the bidding team loses every trick in the hand, they win the marks they bid.
          If the opposing team forces the bidder to win a trick, the opposing team wins the marks. The reason nil is so difficult to learn is because it requires players to invert their thinking.
          Good dominoes suddenly become trash dominoes that you want to get rid of as soon as possible, and bad dominoes become good. The game gets even more complicated when “Doubles Low” and “Doubles are a Suit” calls are made.
        </Typography>
      <ul><Typography className="second-header"><li>Doubles are low</li></Typography>
          <Typography className="paragraph">
            “Doubles are low” is a call that is made only in nil hands. When this call is made, doubles become the LOWEST dominoes in their suit rather than the highest in their suit, as they normally are. For example, the hierarchy from lowest to highest of the <Typography className="five-para">5s</Typography> suit when doubles are low is: <Typography className="five-para">5</Typography>-<Typography className="five-para">5</Typography>, <Typography className="five-para">5</Typography>-0, <Typography className="five-para">5</Typography>-1, <Typography className="five-para">5</Typography>-<Typography className="two-para">2</Typography>, <Typography className="five-para">5</Typography>-<Typography className="three-para">3</Typography>, <Typography className="five-para">5</Typography>-4, <Typography className="five-para">5</Typography>-<Typography className="six-para">6</Typography>.
          </Typography></ul>
      <ul><Typography className="second-header"><li>Doubles Are a Suit of Their Own</li></Typography>
          <Typography className="paragraph">
            “Doubles are a suit of their own” is said during nil, as well as in normal mark bids, when the bidder desires doubles to be their own suit. Like “doubles are low”, the doubles in each suit cease to be the highest in their suit.
            However, instead of becoming the lowest in their suit, doubles are REMOVED from their respective suits and become their OWN suit. The number on the double determines its order in the hierarchy, similar to other suits. In this call, the <Typography className="three-para">3</Typography>-<Typography className="three-para">3</Typography> is no longer a <Typography className="three-para">3</Typography> at all. It is a double. It cannot be played in suit if the suit is <Typography className="three-para">threes</Typography>.
          </Typography></ul></ul>
      <Typography className="second-header"><li>Splash</li></Typography>
        <Typography className="paragraph">
          Splash calls are played the same as a normal mark hand, with the exception that the bidder’s partner decides what the trump is. To make a “splash” call, the bidder must have at least three doubles in their hand. In a way, splash and plunge calls are a legal method of table talk. Some house rules allow for the bidder’s partner to call sevens or nil.
        </Typography>
      <ul><Typography className="second-header"><li>Plunge</li></Typography>
        <Typography className="paragraph">
          Plunge operates the same as Splash, except for two important distinctions:
        </Typography>
            <ol>
              <Typography className="paragraph"><li>A player must have at least four doubles to make a plunge call.</li></Typography>
              <Typography className="paragraph"><li>The number of marks bid raises by one.</li></Typography>
            </ol>
        <Typography className="paragraph">
          For example, if one bids two mark and calls plunge, the bid raises to three-mark. Other than these two distinctions, plunge operates the same as splash.
        </Typography></ul>
      <Typography className="second-header"><li>Sevens</li></Typography>
        <Typography className="paragraph">
          When sevens is called, all players flip their hands up. Next, the bidder signs a contract with the Devil. Once this is done, each trick everyone plays their domino which is the closest to the number seven. The caller wins so long as either of their team’s dominos are tied with or closer than either of the opposing team’s dominos.
        </Typography>
      <Typography className="second-header"><li>Delve</li></Typography>
        <Typography className="paragraph">
          Delving is a joke call, reserved for casual play and, especially, blowout games. To delve, a player must bid seven marks without having looked at their hand. From there they can call whatever they wish. This is the only time a player can bid multiple marks out of sequential order.
        </Typography></ul>
      <Typography className="main-header">Tips</Typography>
        <ul><Typography className="paragraph"><li>The best thought process for bidding is to think to yourself, “what count can I guarantee?” If you know that, no matter what, your hand allows you to get the <Typography className="five-para">five</Typography>-<Typography className="five-para">five</Typography> and the <Typography className="five-para">five</Typography>-blank. You know that you can get at least 17 points. Add to that some estimations about what you can or cannot draw out (pull), then you have a bid!
          Inversely, consider your offs. Offs are any domino in hand that you will not be able to walk. Some are riskier than others, always consider what count dominos might end up being played when you play an off, or what dominos you might be forced to play if you lose control of the hand.
          </li></Typography>
          <Typography className="paragraph"><li>Before you even think about bidding, make sure you have no less than three of a given suit. If you only have three in a suit, make sure you at least have the two highest of the suit. Ideally, you should have at least four of a suit so that, no matter the distribution of the dominos, you’re guaranteed to be the last one with a trump.
          Past that, look at any domino in your hand that will walk, such as doubles or things where you have a run of the highest in its suit. Walking is when a domino that is led is certain to win the trick.
          </li></Typography>
          <Typography className="paragraph"><li>Doubles as a suit of their own is a nuanced call and it is hard to say exactly when one should call it. The thing to really consider here is coverage. This usually occurs when you have what would otherwise be a good nil doubles high hand but also have a low and a high double.
          So now your blanks are the lowest of their suits and your low double(s) cover for your high double(s).
          </li></Typography>
          <Typography className="paragraph"><li>In multi-mark hands, pay close attention to the dominoes played. Because the dominoes are stacked, you will not be able to check what has been played previously.
          Hands can be won and lost on a single domino, so it’s important to know what dominoes have power and which ones don’t.
          </li></Typography>
        </ul>
      <Typography className="main-header">Written by Aidan Hill and Owen Dunston, Class of 2023</Typography>
    </StyledRoot>
  </PageContainer>
)

export default Rulespage
