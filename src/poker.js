var poker = {
  // Returns the name of the input hand.
  // See the specs for the required formats.
  labelHand: function(handStr) {

    var rankKeys = 'A23456789TJQK'.split('');
    var suitKeys = 'HDCS'.split('');
    var numericalRanks = {
      'A': 14,
      'K': 13,
      'Q': 12,
      'J': 11,
      'T': 10
    };

    // format hand
    // [{rank: 'A', suit: 'H', numericalRank: 14}, ...]
    var hand = handStr
      .split(' ')
      .map(function (card) {
        var rank = card[0];
        return {
          rank: rank,
          suit: card[1],
          numericalRank: numericalRanks[rank] || rank
        };
      })
      .sort(function (a, b) {
        return a.numericalRank > b.numericalRank;
      });

    // create buckets
    // { A: 0, 1: 0, 2: 0, etc... }
    // { H: 0, D: 0, C: 0, S: 0 }
    var ranks = {};
    var suits = {};

    rankKeys.map(function (rank) {
      ranks[rank] = 0;
    });

    suitKeys.map(function (suit) {
      suits[suit] = 0;
    });

    // fill buckets
    // { A: 1, 1: 2, 2: 3, etc... } <- full house
    // { H: 5, D: 0, C: 0, S: 0 } <- oooo flush
    hand.map(function (card) {
      ranks[card.rank]++;
      suits[card.suit]++;
    });

    // evaluate hand
    function getFlush() {
      return suitKeys.filter(function (key) {
        return suits[key] > 4;
      });
    }

    function getPairs() {
      return rankKeys.filter(function (key) {
        return ranks[key] > 1;
      });
    }

    function getThreeOfKind() {
      return rankKeys.filter(function (key) {
        return ranks[key] > 2;
      });
    }

    function getFourOfKind() {
      return rankKeys.filter(function (key) {
        return ranks[key] > 3;
      });
    }

    function getFullHouse() {
      var threes = getThreeOfKind();
      var twos = getPairs();
      if (threes.length && twos.length > 1) {
        return threes.concat(twos);
      }
      return false;
    }

    function getStraightResult(){
      var low = hand[0];
      var nextHighest = hand[3];
      var high = hand[4];
      if (high.numericalRank - low.numericalRank === 4) {
        return 'Straight up to ' + high.rank;
      }
      // Special case where A is 1.
      else if (high.rank === 'A' && low.rank === '2' && nextHighest.rank === '5') {
        return 'Straight up to 5';
      }
    }

    function getStraightFlushResult() {
      if (getFlush().length && getStraightResult()) {
        return getStraightResult().replace('Straight', 'Straight flush');
      }
      return false;
    }

    function getRoyalFlushResult() {
      if (getStraightFlushResult() && hand[0].rank==='T' ){
        return 'Royal flush'
      }
    }

    // the kicker
    function getHighCard() {
      return hand[4].rank;
    }

    console.log(ranks);
    console.log(suits);

    // check strongest classification first
    if (getRoyalFlushResult()) {
      return getRoyalFlushResult();
    }
    else if (getStraightFlushResult()) {
      return getStraightFlushResult();
    }
    else if (getStraightResult()) {
      return getStraightResult();
    }
    else if (getFlush().length) {
      return "Flush with high card " + getHighCard();
    }
    else if (getFourOfKind().length) {
      return "Four of a kind of " + getFourOfKind()[0];
    }
    else if(getFullHouse().length) {
      return "Full house of " + getThreeOfKind()[0];
    }
    else if (getThreeOfKind().length) {
      return "Three of a kind of " + getThreeOfKind()[0];
    }
    else if (getPairs().length) {
      if (getPairs().length > 1) {
        return "Two pair of " + getPairs()[0] + ' and ' + getPairs()[1];
      }
      return "Pair of " + getPairs()[0];
    }
    else {
      return getHighCard() + " High";
    }
  }
};
