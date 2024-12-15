import Json, { JsonList } from '../json';
import { tail, take, takeRight, zip } from 'lodash';

export function Part1({ input }: { input: string }) {
  const re = /Button A: X(.+), Y(.+)[^B]*Button B: X(.*), Y(.*)[^P]*Prize: X=(.*), Y=(.*)/g;
  const parsed = input.matchAll(re);
  const data = [...parsed].map((i) => ({
    a: { x: parseInt(i[1], 10), y: parseInt(i[2], 10) },
    b: { x: parseInt(i[3], 10), y: parseInt(i[4], 10) },
    prize: { x: parseInt(i[5], 10), y: parseInt(i[6], 10) },
  }));
  const aTokens = 3;
  const bTokens = 1;
  const maxPress = 100;
  const maxTokens = maxPress * aTokens + maxPress * bTokens + 1;
  function minTokensNeeded(game: (typeof data)[0]) {
    let minNeeded = maxTokens;
    let x1 = 0;
    let y1 = 0;
    for (let a = 0; a < maxPress; a++) {
      let x2 = x1;
      let y2 = y1;
      for (let b = 0; b < maxPress; b++) {
        if (x2 === game.prize.x && y2 === game.prize.y) {
          const tokens = a * aTokens + b * bTokens;
          if (tokens < minNeeded) {
            minNeeded = tokens;
          }
          break;
        }
        x2 += game.b.x;
        y2 += game.b.y;
        if (x2 > game.prize.x || y2 > game.prize.y) {
          break;
        }
      }

      x1 += game.a.x;
      y1 += game.a.y;
      if (x1 > game.prize.x || y1 > game.prize.y) {
        break;
      }
    }
    return minNeeded;
  }

  const tokensNeeded = data.map(minTokensNeeded);
  const total = tokensNeeded.filter((i) => i < maxTokens).reduce((acc, curr) => acc + curr, 0);

  return (
    <>
      <Json>{total}</Json>
    </>
  );
}
export function Part2({ input }: { input: string }) {
  const re = /Button A: X(.+), Y(.+)[^B]*Button B: X(.*), Y(.*)[^P]*Prize: X=(.*), Y=(.*)/g;
  const parsed = input.matchAll(re);
  const data = [...parsed].map((i) => ({
    a: { x: parseInt(i[1], 10), y: parseInt(i[2], 10) },
    b: { x: parseInt(i[3], 10), y: parseInt(i[4], 10) },
    prize: { x: parseInt(i[5], 10) + 10000000000000, y: parseInt(i[6], 10) + 10000000000000 },
  }));

  // investigate slopes
  // const slopes = data.map((g) => ({
  //   a: g.a.y / g.a.x,
  //   b: g.b.y / g.b.x,
  //   prize: g.prize.y / g.prize.x,
  // }));
  // return (
  //   <>
  //     {/* <JsonList>{slopes.filter((i) => Math.abs(i.a) >= 1 && Math.abs(i.b) >= 1)}</JsonList> */}
  //     <JsonList>{slopes.filter((i) => i.a === i.b)}</JsonList>
  //     <JsonList>{slopes.filter((i) => (i.a > i.prize && i.b > i.prize) || (i.a < i.prize && i.b < i.prize))}</JsonList>
  //   </>
  // );

  // discarded idea:
  // most of the slopes are remotely close to each other - for most, one is > 1 and the other is 0-1.  The few that are both >1 are substantially different (one is ~5 and the other is ~1)
  // ie. I don't think it's ever possible to replace N of one with M of the other, so the cost-optimization is a red herring
  // thinking further - unless the slopes for A and B are the _same_, it's never possible to replace N of one with M of the other
  // and if the slope of the prize is not between the slopes of A and B, it's unwinnable
  // so now, we have to figure out how to calculate the number of each button press required for the possibly-winning ones
  //   1. identify the ideal slope and the slope of A and B
  //   2. get the manhattan distance between the prize and the origin
  //   2. come up with some initial estimate of the number of A and B presses required - ??? how?
  //   3.

  // discarded idea:
  // // for the ones where one is > 1 and the other is 0-1, we could do what I'm calling slope-following:
  // //   1. identify the ideal slope
  // //   2. at each step, if we're under the ideal slope, use the higher-slope button, otherwise use the lower-slope button
  // // However, that doesn't work for the ones where both are > 1 - once we're over the target slope, we can't ever get back on it
  // // In that case, we'd need to do something like:
  // //   1. identify the ideal slope
  // //   2. if the higher slope would go over the ideal line

  // binary search?
  //   1. Assign the buttons to be C and D - C has the higher slope (ie. goes up faster in Y) than the prize, D has the lower slope
  //   2. MinC = 0, MaxC = PrizeY / C.y
  //   3. TrialC = (MinC + MaxC) / 2
  //   4. calculate what X/Y value you'd get to with TrialC presses of C, and how many D presses you'd need to get to the prize's Y value and the resulting X value
  //   5. if the X value is a match, return the presses * tokens
  //   6. if the X value is less than the prize X value, set MaxC = TrialC-1, otherwise set MinC = TrialC+1
  //   7. goto 3

  function minTokensNeeded(game: (typeof data)[0], atokenCost: number, btokenCost: number) {
    const aSlope = game.a.y / game.a.x;
    const bSlope = game.b.y / game.b.x;
    if (bSlope > aSlope) {
      // a should always have the higher slope
      return minTokensNeeded(
        {
          a: game.b,
          b: game.a,
          prize: game.prize,
        },
        btokenCost,
        atokenCost,
      );
    }
    if (!(aSlope > bSlope)) {
      throw new Error('aSlope should be greater than bSlope');
    }
    const prizeSlope = game.prize.y / game.prize.x;
    if (!(aSlope > prizeSlope && prizeSlope > bSlope)) {
      // unwinnable
      return 0;
    }

    let minA = 0;
    let maxA = Math.floor(game.prize.y / game.a.y);
    while (minA <= maxA) {
      const trialA = Math.floor((minA + maxA) / 2);
      let x = trialA * game.a.x;
      let y = trialA * game.a.y;
      const bPresses = Math.ceil((game.prize.y - y) / game.b.y);
      x += bPresses * game.b.x;
      y += bPresses * game.b.y;
      if (x === game.prize.x && y === game.prize.y) {
        return trialA * atokenCost + bPresses * btokenCost;
      }
      const slope = y / x;
      if (slope > prizeSlope) {
        // we are too high - need fewer A presses
        maxA = trialA - 1;
      } else {
        // we are too low - need more A presses
        minA = trialA + 1;
      }
    }

    // unwinnable
    return 0;
  }

  const tokensNeeded = data.map((g) => minTokensNeeded(g, 3, 1));
  const total = tokensNeeded.reduce((acc, curr) => acc + curr, 0);

  return (
    <>
      {/* <JsonList>{tokensNeeded}</JsonList> */}
      <Json>{total}</Json>
    </>
  );
}
