const {SideGame} = require('../../environment.js');

let game = null;

beforeEach(() => game = new SideGame({
    minimum_bet : 10,
    pool: 0,
    pool_reserve: 0,
    type: 'Boolean'
}));

test('Is contested', () => {
    game.data.bets = [
        {
            amount: 10
        },
        {
            amount: 9
        }
    ];
    expect(game.isContested()).toBeTruthy();
});

test('Is not contested', () => {
    game.data.bets = [
        {
            amount: 10
        },
        {
            amount: 10
        }
    ];

    expect(game.isContested()).toBeFalsy();
});

test('Returns winners correctly', () => {
    game.data.bets = [
        {
            side: 'Kyllä'
        },
        {
            side: 'Ei'
        }
    ];

    expect(game.getWinners('Kyllä').length).toBe(1);
    game.data.bets[0].side = 'Ei';
    expect(game.getWinners('Kyllä').length).toBe(0);
});