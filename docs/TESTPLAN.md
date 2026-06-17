# COBOL App Test Plan

This test plan covers the current business logic and implementation of the COBOL student account system. It is intended for validation with business stakeholders and future use as a basis for unit and integration tests in a Node.js migration.

## Table Headings

1. Test Case ID
2. Test Case Description
3. Pre-conditions
4. Test Steps
5. Expected Result
6. Actual Result
7. Status (Pass/Fail)
8. Comments

## Test Cases

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status (Pass/Fail) | Comments |
|---|---|---|---|---|---|---|---|
| TC-001 | Verify initial balance inquiry | Application is compiled and started; initial balance is set to 1000.00 | 1. Start application
2. Select option 1 (View Balance) | Display "Current balance: 001000.00" | | | Confirms read-only balance retrieval |
| TC-002 | Verify credit operation increases balance | Application started; initial balance is 1000.00 | 1. Select option 2 (Credit Account)
2. Enter a credit amount, e.g. 50.00
3. Return to main menu
4. Select option 1 to view balance | Display "Amount credited. New balance: 001050.00"
Then display updated balance 1050.00 | | | Confirms balance update after credit |
| TC-003 | Verify debit operation decreases balance when sufficient funds exist | Application started; balance is 1000.00 | 1. Select option 3 (Debit Account)
2. Enter a debit amount, e.g. 200.00
3. Return to main menu
4. Select option 1 to view balance | Display "Amount debited. New balance: 000800.00"
Then display updated balance 800.00 | | | Confirms balance update after debit with enough funds |
| TC-004 | Verify debit is rejected when insufficient funds | Application started; balance is 1000.00 | 1. Select option 3 (Debit Account)
2. Enter a debit amount larger than balance, e.g. 1500.00 | Display "Insufficient funds for this debit."
Balance remains unchanged at 1000.00 | | | Confirms no negative balances or overdraft |
| TC-005 | Verify invalid menu selection handling | Application started | 1. Enter a non-menu selection, e.g. 9 or a non-numeric value | Display "Invalid choice, please select 1-4." and continue prompting | | | Confirms menu validation behavior |
| TC-006 | Verify program exit behavior | Application started | 1. Select option 4 (Exit) | Display "Exiting the program. Goodbye!" and terminate application | | | Confirms graceful application shutdown |
| TC-007 | Verify multiple operations persist state within session | Application started; initial balance 1000.00 | 1. Credit 100.00
2. Debit 50.00
3. View balance | Updated balance reflects both operations: 1050.00 after credit, 1000.00 after debit | | | Confirms correct state flow across multiple operations |
