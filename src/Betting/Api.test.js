const {getBettingState} = require('./Api.js');

describe('Testing the betting api...', () => {
    test('getBettingState returns correct value.', () => {
        let bet = {
            amount : 1,
        }

        let state = api.getBettingState(undefined, 1);
        expect(state).toEqual('entry');

        state = api.getBettingState(bet, 1);
        expect(state).toEqual('set');

        state = api.getBettingState(bet, 2);
        expect(state).toEqual('call');
    });
});