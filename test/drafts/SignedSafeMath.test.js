const { BN, constants, shouldFail } = require('openzeppelin-test-helpers');

const SignedSafeMathMock = artifacts.require('SignedSafeMathMock');

contract('SignedSafeMath', function () {
  beforeEach(async function () {
    this.safeMath = await SignedSafeMathMock.new();
  });

  describe('add', function () {
    it('adds correctly if it does not overflow and the result is positve', async function () {
      const a = new BN('1234');
      const b = new BN('5678');

      (await this.safeMath.addUints(a, b)).should.be.bignumber.equal(a.add(b));
    });

    it('adds correctly if it does not overflow and the result is negative', async function () {
      const a = constants.MAX_INT256;
      const b = constants.MIN_INT256;

      const result = await this.safeMath.addInts(a, b);
      result.should.be.bignumber.equal(a.add(b));
    });

    it('reverts on positive addition overflow', async function () {
      const a = constants.MAX_INT256;
      const b = new BN('1');

      await shouldFail.reverting(this.safeMath.addInts(a, b));
    });

    it('reverts on negative addition overflow', async function () {
      const a = constants.MIN_INT256;
      const b = new BN('-1');

      await shouldFail.reverting(this.safeMath.addInts(a, b));
    });
  });

  describe('sub', function () {
    it('subtracts correctly if it does not overflow and the result is positive', async function () {
      const a = new BN('5678');
      const b = new BN('1234');

      const result = await this.safeMath.subInts(a, b);
      result.should.be.bignumber.equal(a.sub(b));
    });

    it('subtracts correctly if it does not overflow and the result is negative', async function () {
      const a = new BN('1234');
      const b = new BN('5678');

      const result = await this.safeMath.subInts(a, b);
      result.should.be.bignumber.equal(a.sub(b));
    });

    it('reverts on positive subtraction overflow', async function () {
      const a = constants.MAX_INT256;
      const b = new BN('-1');

      await shouldFail.reverting(this.safeMath.subInts(a, b));
    });

    it('reverts on negative subtraction overflow', async function () {
      const a = constants.MIN_INT256;
      const b = new BN('1');

      await shouldFail.reverting(this.safeMath.subInts(a, b));
    });
  });

  describe('mul', function () {
    it('multiplies correctly', async function () {
      const a = new BN('5678');
      const b = new BN('-1234');

      const result = await this.safeMath.mulInts(a, b);
      result.should.be.bignumber.equal(a.mul(b));
    });

    it('handles a zero product correctly', async function () {
      const a = new BN('0');
      const b = new BN('5678');

      const result = await this.safeMath.mulInts(a, b);
      result.should.be.bignumber.equal(a.mul(b));
    });

    it('reverts on multiplication overflow, positive operands', async function () {
      const a = constants.MAX_INT256;
      const b = new BN('2');

      await shouldFail.reverting(this.safeMath.mulInts(a, b));
    });

    it('reverts when minimum integer is multiplied by -1', async function () {
      const a = constants.MIN_INT256;
      const b = new BN('-1');

      await shouldFail.reverting(this.safeMath.mulInts(a, b));
    });

    it('reverts when -1 is multiplied by minimum integer', async function () {
      const a = new BN('-1');
      const b = constants.MIN_INT256;

      await shouldFail.reverting(this.safeMath.mulInts(a, b));
    });
  });

  describe('div', function () {
    it('divides correctly', async function () {
      const a = new BN('-5678');
      const b = new BN('5678');

      const result = await this.safeMath.divInts(a, b);
      result.should.be.bignumber.equal(a.div(b));
    });

    it('reverts on zero division', async function () {
      const a = new BN('-5678');
      const b = new BN('0');

      await shouldFail.reverting(this.safeMath.divInts(a, b));
    });

    it('reverts on overflow, negative second', async function () {
      const a = new BN(constants.MIN_INT256);
      const b = new BN('-1');

      await shouldFail.reverting(this.safeMath.divInts(a, b));
    });
  });
});
