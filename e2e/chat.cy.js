// Cypress.on('uncaught:exception', () => false);

// describe('Campus Caravan - Messenger Feature', () => {
//   beforeEach(() => {
//     cy.visit('https://campus-carawan-lums.up.railway.app/login');
//     cy.get('input[placeholder="Username or Email"]').type('abidkarim74');
//     cy.get('input[placeholder="Password"]').type('YS2b7kat');
//     cy.get('button[type="submit"]').click();
//     cy.url().should('eq', 'https://campus-carawan-lums.up.railway.app/');
//   });

//   it('Opens messenger when envelope icon is clicked', () => {
//     // Select the envelope icon — it's the second FontAwesomeIcon
//     cy.get('svg[data-icon="envelope"]').first().click();

//     // Messenger panel should appear — look for section element with Messenger styles
//     cy.get('section')
//       .should('have.class', 'flex')
//       .and('exist');
//   });

//   it('Opens a chat when a conversation is clicked', () => {

//     cy.get('svg[data-icon="envelope"]').first().click();
  
//     // Wait for conversation list to render
//     cy.get('.scrollbar-thin', { timeout: 10000 }).should('exist');
  
//     // Click the first conversation (assuming it’s a button or clickable div)
//     cy.get('.scrollbar-thin')
//       .find('button, div[role="button"], div.cursor-pointer')
//       .first()
//       .click({ force: true });
  
//     // Now check if chat area opens — we can look for input box or message area
//     cy.get('textarea, input[placeholder*="Type"], input[type="text"]', { timeout: 10000 })
//       .should('exist');
//   });
  
//   it('Sends a message in an open chat if available', () => {
//     cy.get('svg[data-icon="envelope"]').first().click();
  
//     cy.get('.scrollbar-thin', { timeout: 10000 }).should('exist');
  
//     cy.get('.scrollbar-thin')
//       .find('div.cursor-pointer')
//       .first()
//       .click({ force: true });
  
//     const testMessage = Test message ${Date.now()};
  
//     // Type message
//     cy.get('textarea, input[placeholder*="Type"], input[type="text"]', { timeout: 10000 })
//       .filter(':visible:enabled')
//       .first()
//       .type(testMessage);
  
//     // Click the send button
//     cy.get('button[type="submit"]')
//       .filter(':visible:enabled')
//       .first()
//       .click({ force: true });
  
//     // Confirm the message was sent and visible
//     cy.contains(testMessage, { timeout: 10000 }).should('exist');
//   });
  
  
  
  
// });