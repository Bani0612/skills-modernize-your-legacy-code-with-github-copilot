const { expect } = require('chai');
const {
  INITIAL_BALANCE_CENTS,
  formatBalance,
  parseAmount,
  readBalance,
  writeBalance,
  resetBalance,
  creditBalance,
  debitBalance,
  isValidChoice,
  isExitChoice,
} = require('../index');

describe('Accounting App Business Logic', () => {
  beforeEach(() => {
    resetBalance();
  });

  describe('Initial balance inquiry', () => {
    it('should start with 1000.00 balance', () => {
      expect(formatBalance(readBalance())).to.equal('001000.00');
    });
  });

  describe('Credit operation', () => {
    it('should increase the balance when crediting a valid amount', () => {
      const amountCents = parseAmount('50.00');
      expect(amountCents).to.equal(5000);

      const newBalance = creditBalance(amountCents);
      expect(formatBalance(newBalance)).to.equal('001050.00');
      expect(formatBalance(readBalance())).to.equal('001050.00');
    });
  });

  describe('Debit operation with sufficient funds', () => {
    it('should decrease the balance when debiting a valid amount with enough funds', () => {
      const amountCents = parseAmount('200.00');
      expect(amountCents).to.equal(20000);

      const result = debitBalance(amountCents);
      expect(result.success).to.be.true;
      expect(formatBalance(result.balance)).to.equal('000800.00');
      expect(formatBalance(readBalance())).to.equal('000800.00');
    });
  });

  describe('Debit operation with insufficient funds', () => {
    it('should reject debit when the amount exceeds the balance', () => {
      const amountCents = parseAmount('1500.00');
      expect(amountCents).to.equal(150000);

      const result = debitBalance(amountCents);
      expect(result.success).to.be.false;
      expect(formatBalance(result.balance)).to.equal('001000.00');
      expect(formatBalance(readBalance())).to.equal('001000.00');
    });
  });

  describe('Invalid menu selection handling', () => {
    it('should treat invalid choices as invalid', () => {
      expect(isValidChoice('9')).to.be.false;
      expect(isValidChoice('x')).to.be.false;
      expect(isValidChoice('1')).to.be.true;
      expect(isValidChoice('4')).to.be.true;
    });

    it('should recognize the exit choice', () => {
      expect(isExitChoice('4')).to.be.true;
      expect(isExitChoice('1')).to.be.false;
    });
  });

  describe('Multiple operations persist state within session', () => {
    it('should update balance after a credit and debit in sequence', () => {
      const creditCents = parseAmount('100.00');
      const debitCents = parseAmount('50.00');

      const afterCredit = creditBalance(creditCents);
      expect(formatBalance(afterCredit)).to.equal('001100.00');

      const result = debitBalance(debitCents);
      expect(result.success).to.be.true;
      expect(formatBalance(result.balance)).to.equal('001050.00');
      expect(formatBalance(readBalance())).to.equal('001050.00');
    });
  });
});
