const readline = require('readline');

const INITIAL_BALANCE_CENTS = 100000; // 1000.00
let storedBalanceCents = INITIAL_BALANCE_CENTS;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function formatBalance(cents) {
  const formatted = (cents / 100).toFixed(2);
  return formatted.padStart(9, '0');
}

function parseAmount(input) {
  const normalized = input.trim();
  if (!/^[0-9]+(\.[0-9]{1,2})?$/.test(normalized)) {
    return null;
  }

  const [dollars, decimals = '00'] = normalized.split('.');
  const cents = parseInt(dollars, 10) * 100 + parseInt(decimals.padEnd(2, '0').slice(0, 2), 10);
  return cents;
}

function readBalance() {
  return storedBalanceCents;
}

function writeBalance(newBalanceCents) {
  storedBalanceCents = newBalanceCents;
}

function resetBalance() {
  storedBalanceCents = INITIAL_BALANCE_CENTS;
}

function creditBalance(amountCents) {
  const balance = readBalance();
  const updated = balance + amountCents;
  writeBalance(updated);
  return updated;
}

function debitBalance(amountCents) {
  const balance = readBalance();
  if (balance >= amountCents) {
    const updated = balance - amountCents;
    writeBalance(updated);
    return { success: true, balance: updated };
  }
  return { success: false, balance };
}

function isValidChoice(choice) {
  return ['1', '2', '3', '4'].includes(choice);
}

function isExitChoice(choice) {
  return choice === '4';
}

function displayMenu() {
  console.log('--------------------------------');
  console.log('Account Management System');
  console.log('1. View Balance');
  console.log('2. Credit Account');
  console.log('3. Debit Account');
  console.log('4. Exit');
  console.log('--------------------------------');
}

function prompt(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function handleViewBalance() {
  const balance = readBalance();
  console.log(`Current balance: ${formatBalance(balance)}`);
}

async function handleCreditAccount() {
  const amountText = await prompt('Enter credit amount: ');
  const amountCents = parseAmount(amountText);

  if (amountCents === null) {
    console.log('Invalid amount. Please enter a positive number with up to two decimals.');
    return;
  }

  const updated = creditBalance(amountCents);
  console.log(`Amount credited. New balance: ${formatBalance(updated)}`);
}

async function handleDebitAccount() {
  const amountText = await prompt('Enter debit amount: ');
  const amountCents = parseAmount(amountText);

  if (amountCents === null) {
    console.log('Invalid amount. Please enter a positive number with up to two decimals.');
    return;
  }

  const result = debitBalance(amountCents);
  if (result.success) {
    console.log(`Amount debited. New balance: ${formatBalance(result.balance)}`);
  } else {
    console.log('Insufficient funds for this debit.');
  }
}

async function runApp() {
  while (true) {
    displayMenu();
    const choice = (await prompt('Enter your choice (1-4): ')).trim();

    switch (choice) {
      case '1':
        await handleViewBalance();
        break;
      case '2':
        await handleCreditAccount();
        break;
      case '3':
        await handleDebitAccount();
        break;
      case '4':
        console.log('Exiting the program. Goodbye!');
        rl.close();
        return;
      default:
        console.log('Invalid choice, please select 1-4.');
        break;
    }

    console.log();
  }
}

if (require.main === module) {
  runApp().catch((error) => {
    console.error('An unexpected error occurred:', error);
    rl.close();
    process.exit(1);
  });
}

module.exports = {
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
};
