const Color = artifacts.require('./Color.sol');
require('chai').use(require('chai-as-promised')).should();

contract('Color', function (accounts) {

    let color;
    beforeEach(async function () {
        color = await Color.deployed();
    });

    describe('deployment', function () {
        it('deploys successfully', async function () {
            contract = await Color.deployed();
            const address = contract.address;
            assert.notEqual(address, 0x0);
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        });

        it('has a name', async function () {
            const name = await contract.name();
            assert.equal(name, 'Color');
        });

        it('has a symbol', async function () {
            const symbol = await contract.symbol();
            assert.equal(symbol, 'COLORZ');
        });
    });

    describe('minting', function () {
        it('creates a new token', async function () {
            const res = await contract.mint('#ffffff');
            const colorCount = await contract.totalSupply();
            assert.equal(colorCount, 1);

            
        });
        it('tries to create bad tokens', async function () {
            const bad = await contract.mint('#fffffff').should.be.rejected;
            const bad2 = await contract.mint('#ffffff').should.be.rejected;
        });
    });

    describe('indexing', function () {
        it('list colors', async function () {
            await contract.mint('#aaaaaa');
            await contract.mint('#000000');
            const totalSupply = await contract.totalSupply();
            let result = [];
            for (let i = 0; i < totalSupply; i++) {
                result.push(await contract.colors(i));
            }

            let expected = ['#ffffff','#aaaaaa', '#000000'];
            assert.equal(result.join(','), expected.join(','));
        });
    });
});
