const {SideGame} = require('../../environment.js');

describe('Testing Side-Game closure', () => {
    let game;

    beforeEach(() => {
        game = new SideGame({
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
    });

    test('Closing the game returns correct number of winners with correct reward', () => {
        const winners = game.close('Kyllä');
        console.log(winners);

        expect(winners.length - 1).toBe(2); //The winners plus the creator share.
        expect(winners[0].reward).toBe(5);
        
    });
})