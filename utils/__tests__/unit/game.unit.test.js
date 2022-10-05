const {Game} = require('../../environment.js');

test('Is not expired', () => {
    const game = new Game({
        expiry_date: '2023-01-01'
    });

    expect(game.isExpired()).toBeFalsy();
});

test('Is expired expiry', () => {
    const game = new Game({
        expiry_date: new Date().toDateString(),
    });

    expect(game.isExpired()).toBeTruthy();
});

test('Bets under the minimum amount are rejected', () => {
    const game = new Game({
        minimum_bet: 10,
    });

    expect(game.amountIsValid({amount: 9})).toBeFalsy();
});

test('Bets at the minimum bet are accepted', () => {
    const game = new Game({
        minimum_bet: 10,
    });

    expect(game.amountIsValid({amount: 10})).toBeTruthy();
});

test('Bets incremented are accepted', () => {
    const game = new Game({
        minimum_bet: 10,
        increment: 1,
    });

    expect(game.amountIsValid({amount: 11})).toBeTruthy();
});

test('Bets incremented more than the defined increment are rejected', () => {
    const game = new Game({
        minimum_bet: 10,
        increment: 1
    });

    expect(game.amountIsValid({amount: 12})).toBeFalsy();
});

test('Creator share calculation returns correct share', () => {
    const game = new Game({pool: 100});
    expect(game.calculateCreatorShare(1)).toBe(0);
    expect(game.calculateCreatorShare(3)).toBe(1);
    expect(game.calculateCreatorShare(4)).toBe(0);
});

test('Replacing a bet works as expected', () => {
    const game = new Game({
        bets: [
            {
                amount: 10,
                username: 'TEST'
            }
        ]
    });

    game.updateBet({username: 'TEST', amount: 20});
    const bet = game.data.bets.find(item => item.username === 'TEST');
    expect(bet).toBeDefined();
    expect(bet.amount).toBe(30);
});

test('Reward calculation yields correct amount', () => {
    const game = new Game({
        pool: 10,
        bets: [
            {
                amount: 5
            },
            {
                amount: 5
            }
        ]
    });

    const numWinners = 2;
    const creatorShare = 0;
    expect(game.calculateReward(numWinners, creatorShare)).toBe(5);
});