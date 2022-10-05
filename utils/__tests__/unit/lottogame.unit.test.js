const {LottoGame} = require('../../environment.js');

test('Shuffles master numbers', () => {
    const game = new LottoGame({
        draw_size: 7,
    });
    game.shuffle(20);
    expect(game.numbers.slice(0, 4)).not.toEqual([1, 2, 3, 4]); //Will fail occasionally if lucky enough.
});

test('Generates rows of correct length', () => {
    const game = new LottoGame({draw_size: 7});
    expect(game.generateRow(20).length).toBe(game.data.draw_size);
}); 

test('Row comparison returns correct number of matches', () => {
    const game = new LottoGame({draw_size: 7});
    const row1 = [1, 2, 3, 4];
    const row2 = [1, 2, 3, 4];
    expect(game.compareRows(row1, row2)).toBe(4);
    row1[0] = 12;
    expect(game.compareRows(row1, row2)).toBe(3);
});