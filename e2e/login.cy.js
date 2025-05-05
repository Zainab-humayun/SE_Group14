Cypress.on('uncaught:exception', (err, runnable) => {
    // Prevent Cypress from failing the test on known frontend errors
    if (err.message.includes("Cannot read properties of undefined")) {
      return false;
    }
  });

  Cypress.Cookies.debug(true); 

  describe('Campus Caravan Login Test', () => {
    it('Logs in with valid credentials', () => {
      cy.visit('https://campus-carawan-lums.up.railway.app/login');
  
      // Optional: make Cypress print all cookie activity
      Cypress.Cookies.debug(true);
  
      // Fill the login form
      cy.get('input[placeholder="Username or Email"]').type('abidkarim74');
      cy.get('input[placeholder="Password"]').type('YS2b7kat');
  
      // Click the login button (adjust selector if needed)
      cy.get('button[type="submit"]').click();
  
      // Wait for redirect
      cy.url().should('eq', 'https://campus-carawan-lums.up.railway.app/');
    });
  });
  
  
  
//   describe('Campus Caravan Login Test', () => {
//     it('Logs in with valid credentials', () => {
//       // 🔁 Intercept login API call BEFORE it's triggered
//     //   cy.intercept('POST', 'https://campus-carawan-lums.up.railway.app/login', {
//     //     statusCode: 200,
//     //     body: { accessToken: 'fakeToken' }
//     //   }).as('mockLogin');
      
  
//       cy.visit('https://campus-carawan-lums.up.railway.app/login');
  
//       cy.wait(3000); // Wait for page and animations to settle
  
//       // Fill out login form
//       cy.get('input[placeholder="Username or Email"]').type('abidkarim74');
//       cy.get('input[placeholder="Password"]').type('YS2b7kat');
//       cy.wait(3000);
//       // Click the login button
//       cy.contains('Log In').click();
  
//       // Wait for login API to be called
//     //   cy.wait('@mockLogin');
  
//       // Confirm navigation after login
//       cy.url().should('eq', 'https://campus-carawan-lums.up.railway.app');
//     });
//   });
  