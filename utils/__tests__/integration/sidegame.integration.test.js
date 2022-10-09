const {SelectionGame} = require('../../environment.js');

describe('Testing Selection-Game closure', () => {
    let game;

    beforeEach(() => {
        game = new SelectionGame({
            expiry_date: '2022-01-01',
            pool: 10,
            bets: [
                {
                    amount: 10,
                    side: 'Kyllä'
                },
                {
                    amount: 10,
                    side: 'Ei'
                },
                {
                    amount: 10,
                    side: 'Kyllä'
                }
            ]
        });

        jest.spyOn(game, 'accountDeposit').mockImplementation(() => null);
        jest.spyOn(game, 'notify').mockImplementation(() => null);
        //jest.spyOn(game.super, 'close').mockImplementation(() => null);
    });

    test('Closing the game returns correct number of winners with correct reward', () => {
        const winners = game.close('Kyllä');
        expect(winners.length - 1).toBe(2); //The winners plus the creator share.
        expect(winners[0].reward).toBe(5);
    });
})