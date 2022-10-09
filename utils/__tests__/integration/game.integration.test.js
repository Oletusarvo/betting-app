const {Game} = require('../../environment.js');

describe('Placing bets', () => {
    let game = null;

    beforeEach(() => {
        game = new Game({
            bets: [],
            expiry_date: '2023-02-02',
            minimum_bet: 10,
            increment: 1,
            pool: 10
        });

        jest.spyOn(game, 'accountDeposit').mockImplementation(() => null);
        jest.spyOn(game, 'notify').mockImplementation(() => null);
        jest.spyOn(game, 'update').mockImplementation(() => null);
    });

    test('Bets accepted are included', async () => {
        const bet = {
            username: 'TEST',
            amount: 10,
        }
        await game.placeBet(bet);
        expect(game.bets.includes(bet)).toBeTruthy();
    });

    test('Bets rejected are not included', async () => {
        const bet = {
            username: 'TEST',
            amount: 9,
        }
        await expect(game.placeBet(bet)).rejects.toThrow();
        expect(game.bets.includes(bet)).toBeFalsy();
    });

    test('Bets with insufficent amount are rejected', async () => {
        game.data.expiry_date = '2023-01-01';
        const bet = {
            username: 'TEST',
            amount: 9,
        }
        await expect(game.placeBet(bet)).rejects.toThrow(/amount must be/);
    });

    test('Bets meeting the minimum bet are accepted', async () => {
        const bet = {
            username: 'TEST',
            amount: game.data.minimum_bet,
        }
        await expect(game.placeBet(bet)).resolves.not.toThrow();
    });

    test('Bets incremented within the rules are accepted', async () => {
        const bet = {
            username: 'TEST',
            amount: game.data.minimum_bet + game.data.increment,
        }
        await expect(game.placeBet(bet)).resolves.not.toThrow();
    });

    test('Bets illegally incremented are rejected', async () => {
        const bet = {
            username: 'TEST',
            amount: game.data.minimum_bet + game.data.increment + 1,
        }
        await expect(game.placeBet(bet)).rejects.toThrow(/increment/);
    });

    test('Bets meeting requirements, placed on an expired bet, are rejected', async () => {
        game.data.expiry_date = '2022-01-01';
        const bet = {
            username: 'TEST',
            amount: 10,
        }
        await expect(game.placeBet(bet)).rejects.toThrow(/expired/);
        bet.amount += game.data.increment;
        await expect(game.placeBet(bet)).rejects.toThrow(/expired/);
    });

    test('Placing a bet exceeding the minimum bet, increases the minimum bet to equal the bet', async () => {
        game.data.minimum_bet = 10;
        const bet = {
            username: 'TEST',
            amount: 11
        }
        await game.placeBet(bet);
        expect(game.data.minimum_bet).toBe(11);
    });
})