describe('Full User Flow: Wallet + Transactions + Deposit Accounts + Settings', () => {
  const userEmailOrPhone = 'testuser@example.com'
  const recipientWallet = 'walletxx001'

  beforeEach(() => {
    // Intercept APIs
    cy.intercept('GET', '/api/fx-rates', {
      statusCode: 200,
      body: { USD: 1, EUR: 0.92, NGN: 460, GBP: 0.75 }
    }).as('getFxRates')

    cy.intercept('POST', '/api/deposit', { statusCode: 200, body: { success: true, newBalance: 1000 } }).as('deposit')
    cy.intercept('POST', '/api/swap', { statusCode: 200, body: { success: true, from: 'USD', to: 'EUR', amount: 500 } }).as('swap')
    cy.intercept('POST', '/api/send', { statusCode: 200, body: { success: true } }).as('send')
    cy.intercept('POST', '/api/deposit-accounts', {
      statusCode: 200,
      body: { success: true, account: { name: 'My Bank Account', number: '1234567890', bank: 'First Bank' } }
    }).as('addAccount')
    cy.intercept('DELETE', '/api/deposit-accounts/*', { statusCode: 200, body: { success: true } }).as('deleteAccount')
    cy.intercept('PATCH', '/api/user-settings', { statusCode: 200, body: { success: true, name: 'Updated User', phone: '08098765432' } }).as('updateSettings')

    // Visit onboarding page
    cy.visit('/onboard')
    cy.get('[data-cy=onboard-button]', { timeout: 10000 }).should('be.visible')
  })

  it('Completes onboarding → create wallet → add deposit account → deposit → swap → send → update settings → delete deposit account', () => {
    // 1️⃣ Onboarding & Create Wallet
    cy.get('[data-cy=email-or-phone-input]').type(userEmailOrPhone)
    cy.get('[data-cy=onboard-button]').click()

    // Wait for redirect to homepage
    cy.url().should('eq', `${Cypress.config().baseUrl}/`)

    // 2️⃣ Create Wallet
    cy.get('[data-cy="create-wallet-button"]').click()
    cy.get('[data-cy="currency-select"]').select('USD')
    cy.get('[data-cy="submit-create-wallet"]').click()
    cy.get('[data-cy="wallet-success"]').should('contain', 'Wallet created successfully')

    // 3️⃣ Add Deposit Account
    cy.get('[data-cy="deposit-accounts-tab"]').click()
    cy.get('[data-cy="add-deposit-account-button"]').click()
    cy.get('[data-cy="account-name-input"]').type('My Bank Account')
    cy.get('[data-cy="account-number-input"]').type('1234567890')
    cy.get('[data-cy="bank-select"]').select('First Bank')
    cy.get('[data-cy="save-account-button"]').click()
    cy.wait('@addAccount')
    cy.get('[data-cy="toast"]').should('contain', 'Deposit account added')
    cy.get('[data-cy="deposit-account-list"]').should('contain', 'My Bank Account')

    // 4️⃣ Deposit
    cy.get('[data-cy="deposit-button"]').click()
    cy.get('[data-cy="wallet-select"]').select('USD Wallet')
    cy.get('[data-cy="deposit-amount-input"]').type('1000')
    cy.get('[data-cy="deposit-account-select"]').select('My Bank Account')
    cy.get('[data-cy="confirm-deposit-button"]').click()
    cy.wait('@deposit')
    cy.get('[data-cy="wallet-balance"]').should('contain', '1000')
    cy.get('[data-cy="toast"]').should('contain', 'Deposit successful')

    // 5️⃣ Swap
    cy.get('[data-cy="swap-button"]').click()
    cy.get('[data-cy="from-wallet-select"]').select('USD Wallet')
    cy.get('[data-cy="to-wallet-select"]').select('EUR Wallet')
    cy.get('[data-cy="swap-amount-input"]').type('500')
    cy.get('[data-cy="confirm-swap-button"]').click()
    cy.wait('@swap')
    cy.get('[data-cy="wallet-balance"]').should('contain', 'EUR')
    cy.get('[data-cy="toast"]').should('contain', 'Swap successful')

    // 6️⃣ Send
    cy.get('[data-cy="send-button"]').click()
    cy.get('[data-cy="send-wallet-select"]').select('USD Wallet')
    cy.get('[data-cy="send-amount-input"]').type('200')
    cy.get('[data-cy="recipient-input"]').type(recipientWallet)
    cy.get('[data-cy="confirm-send-button"]').click()
    cy.wait('@send')
    cy.get('[data-cy="toast"]').should('contain', 'Transaction successful')

    // 7️⃣ Update Settings
    cy.get('[data-cy="settings-tab"]').click()
    cy.get('[data-cy="name-input"]').clear()
    cy.get('[data-cy="name-input"]').type('Updated User')
    cy.get('[data-cy="phone-input"]').clear()
    cy.get('[data-cy="phone-input"]').type('08098765432')
    cy.get('[data-cy="save-settings-button"]').click()
    cy.wait('@updateSettings')
    cy.get('[data-cy="toast"]').should('contain', 'Settings updated')
    cy.get('[data-cy="name-display"]').should('contain', 'Updated User')
    cy.get('[data-cy="phone-display"]').should('contain', '08098765432')

    // 8️⃣ Delete Deposit Account
    cy.get('[data-cy="deposit-accounts-tab"]').click()
    cy.get('[data-cy="delete-account-button"]').click()
    cy.get('[data-cy="confirm-delete-button"]').click()
    cy.wait('@deleteAccount')
    cy.get('[data-cy="toast"]').should('contain', 'Deposit account deleted')
    cy.get('[data-cy="deposit-account-list"]').should('not.contain', 'My Bank Account')
  })
})
