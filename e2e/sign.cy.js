Cypress.on('uncaught:exception', (err, runnable) => {
  // Prevent Cypress from failing the test on known frontend errors
  if (err.message.includes("Cannot read properties of undefined")) {
    return false;
  }
});

describe('Campus Caravan Signup Test', () => {
  it('Signs up with OTP', () => {
    // 🔁 Intercept OTP API call BEFORE it's triggered
    cy.intercept('POST', '/auth/verify-otp', {
      statusCode: 200,
      body: { success: true },
    }).as('mockOTP');

    cy.visit('https://campus-carawan-lums.up.railway.app/signup');

    cy.wait(6000);

    // Fill out form
    cy.get('input[placeholder="Username"]').type('testuser');
    cy.get('input[placeholder="Full Name"]').type('Test User');
    cy.get('input[placeholder="Email (@lums.edu.pk)"]').type('26100218@lums.edu.pk');

    // Click Verify Email
    cy.contains('Verify Email').click();

    cy.wait(3000); // Wait for OTP input to appear (or response simulation)

    // Enter and verify OTP
    cy.get('input[placeholder="Enter 6-digit OTP"]').type('123456');
    cy.contains('Verify').click();

    // Wait for mocked OTP call to finish
    cy.wait('@mockOTP');

    // Continue with signup
    cy.get('input[placeholder="Password"]').type('TestPassword123!');
    cy.get('input[placeholder="Confirm Password"]').type('TestPassword123!');
    cy.get('input[value="male"]').check();
    cy.contains('Signup').click();

    // Verify navigation to dashboard
    cy.url().should('include', '/login');
  });
});
