const {SelectionGame} = require('../../environment.js');

let game = null;

beforeEach(() => game = new SelectionGame({
    minimum_bet : 10,
    pool: 0,
    pool_reserve: 0,
    type: 'Boolean',
    bets: [],
}));

describe('Contested', () => {
    test('Is contested', () => {
        game.bets = [{amount: 9}, {amount: 10}];
        expect(game.isContested()).toBeTruthy();
    });
    
    test('Is not contested', () => {
        game.bets = [{amount: 10}, {amount: 10}];
        expect(game.isContested()).toBeFalsy();
    });
});

describe('Winner determination', () => {
    test('Returns winners correctly', () => {
        game.bets = [{side: 'Kyllä'}, {side: 'Ei'}];
        expect(game.getWinners('Kyllä').length).toBe(1);
        game.bets[0].side = 'Ei';
        expect(game.getWinners('Kyllä').length).toBe(0);
    });
});
