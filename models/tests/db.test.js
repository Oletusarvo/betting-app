const { game, bank } = require('../db');

describe('Testing bet validation', () => {

    let bet = null;

    beforeEach(async () => {
        game.game = {
            pool: 0,
            minimum_bet: 10,
            increment: 1,
            expiry_date: '01-01-2023'
        }

        jest.spyOn(bank, 'getAccount').mockImplementation(username => Promise.resolve({
            username, balance: 100
        }));

        bet = {
            username: 'Test',
        };
    });

    describe('No previous bet', () => {
        beforeAll(() => {
            jest.spyOn(game, 'getBet').mockImplementation(username => Promise.resolve(null));
        });

        test('Amount exceedes balance', async () => {
            bet.amount = 1000;
            await expect(game.validateBet(bet)).rejects.toThrow(/balance/);
        }); 

        test('Amount does not exceed balance', async () => {
            bet.amount = 10;
            await expect(game.validateBet(bet)).resolves.not.toThrow();
        });

        test('Exceedes increment', async () => {
            bet.amount = 12;
            await expect(game.validateBet(bet)).rejects.toThrow(/increment/);
        });

        test('Bets placed on an expired game are rejected', async () => {
            bet.amount = 10;
            game.game.expiry_date = '09-20-2022';
            await expect(game.validateBet(bet)).rejects.toThrow(/expired/);
        });

        test('Bet below the minimum bet is rejected', async () => {
            bet.amount = 9;
            await expect(game.validateBet(bet)).rejects.toThrow(/minimum bet/);
        });
    });

    describe('Existing bet', () => {
        beforeAll(() => {
            jest.spyOn(game, 'getBet').mockImplementation(username => Promise.resolve({
                username, amount: 90, side: 'Kyllä'
            }));
        });

        test('Amount exceedes balance', async () => {
            bet.amount = 1000;
            await expect(game.validateBet(bet)).rejects.toThrow(/balance/);
        });

        test('Exceedes increment', async () => {
            bet.amount = 12;
            await expect(game.validateBet(bet)).rejects.toThrow(/increment/);
        });

        test('New bet with different side is rejected', async () => {
            bet.amount = 10;
            bet.side = 'Ei';
            await expect(game.validateBet(bet)).rejects.toThrow(/Side switching/);
        });

        test('A new bet is rejected if a previous bet has been folded', async () => {
            bet.amount = 10;
            jest.spyOn(game, 'getBet').mockImplementation(username => Promise.resolve({
                amount: 90, username, side: 'Kyllä', folded: true
            }));

            await expect(game.validateBet(bet)).rejects.toThrow(/folded/);
        });

        test('A new bet placed before the minimum bet has changed, is rejected', async () => {
            jest.spyOn(game, 'getBet').mockImplementation(username => Promise.resolve({
                amount: game.game.minimum_bet, username, side: 'Kyllä', folded: false
            }));

            bet.amount = 1;
            bet.side = 'Kyllä';
            await expect(game.validateBet(bet)).rejects.toThrow(/Cannot raise/);
        });
    });
});

describe('Testing game contested status', () => {
    test('Game containing bets of different amounts is contested', async () => {
        jest.spyOn(game, 'getAllBets').mockImplementation(() => Promise.resolve([
            {
                amount : 10
            },
            {
                amount: 20,
            }
        ]));

        await expect(game.isContested()).rejects.toThrow(/contested/);
    });

    test('Game containing bets of equal amount is not contested', async () => {
        jest.spyOn(game, 'getAllBets').mockImplementation(() => Promise.resolve([
            {
                amount: 10
            },
            {
                amount: 10
            }
        ]));

        await expect(game.isContested()).resolves.not.toThrow();
    });
});

describe('Testing game pool calculation', () => {

    test('Pool is correctly calculated', async () => {
        game.game.pool_reserve = 0;
        jest.spyOn(game, 'getAllBets').mockImplementation(() => Promise.resolve([
            {
                amount: 10
            },
            {
                amount: 30
            },
            {
                amount: 40
            }
        ]));

        let pool = await game.calculatePool();
        expect(pool).toBe(80);

        game.game.pool_reserve = 80;
        pool = await game.calculatePool();
        expect(pool).toBe(160);
    });
});

describe('Testing game closure', () => {

    beforeAll(() => {
        jest.spyOn(game, 'getAllBets').mockImplementation(() => Promise.resolve([
            {
                amount: 10
            },
            {
                amount: 10
            }
        ]));

        jest.spyOn(game, 'clear').mockImplementation(() => {});

        jest.spyOn(bank, 'deposit').mockImplementation(amount => {});
    });

    test('Game cannot be closed before its expiry date', async () => {
        game.game.expiry_date = '01-01-2023';
        await expect(game.close()).rejects.toThrow(/expiry date/);
    });

    test('Game can be closed if expiry date has been reached', async () => {
        game.game.expiry_date = '09-21-2022';
        await expect(game.close()).resolves.not.toThrow();
    });
});

describe('Testing game creator share calculation', () => {
    test('Calculation returns correct share', () => {
        const numWinners = 2;
        game.game = {
            pool: 7,
            pool_reserve: 0
        }

        expect(game.calculateCreatorShare(numWinners)).toBe(1);

        game.game.pool = 8;
        expect(game.calculateCreatorShare(numWinners)).toBe(0);

        game.game.pool = 9;
        expect(game.calculateCreatorShare(numWinners)).toBe(1);
    });
});

describe('Testing game lottery generation', () => {
    test('GenerateRow returns rows of correct length', () => {
        game.game = {
            row_size: 4
        }
        const row = game.generateRow(20);
        expect(row.length).toBe(4);
    });

    test('GenerateRow returns shuffled rows', () => {
        game.game = {
            row_size: 7
        }

        const row = game.generateRow(20);
        console.log(row);
        expect(row).not.toEqual([1, 2, 3, 4]);
    });
});

describe('Testing game lottery match counting', () => {
    test('CompareRow returns correct number of matches', () => {
        const row1 = [1, 2, 3, 4];
        const row2 = [1, 2, 3, 4];
        const matches = game.compareRow(row1, row2);
        expect(matches).toBe(4);
    });
});

describe('Testing game winner determination', () => {
    test('In lotto games, getWinners returns correct participants', () => {
        const participants = [
            {
                side: "1, 2, 3, 4"
            },
            {
                side: "20, 24, 30, 34"
            }
        ];

        game.game.type = 'Lottery';
        game.game.row_size = 4;

        jest.spyOn(game, "generateRow").mockImplementation(() => [1, 2, 3, 4]);
        const winners = game.getWinners(participants, null);
        expect(winners.length).toBe(1);
        expect(winners[0]).toEqual({side: "1, 2, 3, 4"});
    });
});

