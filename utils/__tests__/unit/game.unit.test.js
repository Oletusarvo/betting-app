const {Game} = require('../../environment.js');

let game;
beforeEach(() => {
    game = new Game({
        expiry_date: '2023-01-01',
        bets: [],
    });
});

describe('Expiry', () => {
    test('Is not expired', () => {
        game.data.expiry_date = '2023-01-01';
        expect(game.isExpired()).toBeFalsy();
    });
    
    test('Is expired', () => {
        game.data.expiry_date = new Date().toDateString();
        expect(game.isExpired()).toBeTruthy();
    });
});


describe('Minimum bet', () => {
    beforeEach(() => {
        game.data.minimum_bet = 10;
    });

    test('Bets under the minimum amount are rejected', () => {
        expect(game.amountIsValid(9)).toBeFalsy();
    });
    
    test('Bets at the minimum bet are accepted', () => {
        expect(game.amountIsValid(10)).toBeTruthy();
    });

    describe('Incrementing', () => {
        beforeEach(() => {
            game.data.increment = 1;
        });

        test('Bets incremented within the rules are accepted', () => {
            expect(game.amountIsValid(11)).toBeTruthy();
        });
    
        test('Bets incremented more than the defined increment are rejected', () => {
            expect(game.amountIsValid(12)).toBeFalsy();
        });
    });
});

describe('Creator share', () => {
    beforeEach(() => {
        game.data.pool = 100;
        game.data.pool_reserve = 0;
    });

    test('Creator share calculation returns correct share', () => {
        expect(game.calculateCreatorShare(1)).toBe(0);
        expect(game.calculateCreatorShare(3)).toBe(1);
        expect(game.calculateCreatorShare(4)).toBe(0);
    });
});

describe('Bet placement', () => {
    beforeEach(() => {
        game.data.pool = 10;
        game.data.pool_reserve = 0;
    });

    test('Replacing a bet works as expected', () => {
        game.bets = [{amount: 10, username: 'TEST'}];
        game.updateBet({username: 'TEST', amount: 20});
        const bet = game.bets.find(item => item.username === 'TEST');
        expect(bet).toBeDefined();
        expect(bet.amount).toBe(30);
    });

    test('Reward calculation yields correct amount', () => {
        game.bets = [{amount: 5}, {amount: 5}];
        const numWinners = 2;
        const creatorShare = 0;
        expect(game.calculateReward(numWinners, creatorShare)).toBe(5);
    });
});


