Cypress.on('uncaught:exception', (err, runnable) => {
    if (err.message.includes("Cannot read properties of undefined")) {
      return false;
    }
  });
  
  Cypress.Cookies.debug(true);
  
  describe('Campus Caravan Login and Search Test', () => {
    it('Logs in - searches - adds complaint', () => {
      cy.visit('https://campus-carawan-lums.up.railway.app/login');
  
      // Fill in login credentials
      cy.get('input[placeholder="Username or Email"]').type('abidkarim74');
      cy.get('input[placeholder="Password"]').type('YS2b7kat');
      cy.get('button[type="submit"]').click();
  
      // Wait for redirect and ensure login succeeded
      cy.url().should('eq', 'https://campus-carawan-lums.up.railway.app/');
  
      // Wait for the home page to load
      cy.wait(5000); // Adjust based on actual render speed
  
      // Click on the search icon (FontAwesomeIcon)
      cy.get('svg') // FontAwesome renders icons as <svg>
        .filter(':visible') // Only interact with visible elements
        .eq(5) // May need to fine-tune this depending on the order
        .click();
      cy.wait(2000);
      // Now the SearchBarSmall component should be visible if isSearchOpen = true
      cy.get('a[data-discover="true"]').eq(4).click({ force: true });
      cy.wait(3000);
    //   cy.contains('button', 'Edit Profile').click();
      cy.contains('a', 'Edit Profile').click();
      cy.wait(3000);
      cy.get('input[name="phone"]').type('0331 44998844');
      cy.contains('button', 'Save Changes').click({ force: true });




    });
  });
  
















// Cypress.on('uncaught:exception', (err, runnable) => {
//     // Prevent Cypress from failing the test on known frontend errors
//     if (err.message.includes("Cannot read properties of undefined")) {
//         return false;
//     }
// });

// describe('Campus Caravan Search and Complaint Test', () => {
//     it('Logs in, opens the search, searches for minhaz, and submits a complaint', () => {
//         cy.visit('https://campus-carawan-lums.up.railway.app/login');

//         // Optional: make Cypress print all cookie activity
//         Cypress.Cookies.debug(true);

//         // Fill the login form
//         cy.get('input[placeholder="Username or Email"]').type('abidkarim74');
//         cy.get('input[placeholder="Password"]').type('YS2b7kat');

//         // Click the login button
//         cy.get('button[type="submit"]').click();

//         // Wait for redirect to the dashboard
//         cy.url().should('eq', 'https://campus-carawan-lums.up.railway.app/');

//         cy.wait(8000); 

//         // Click on the magnifying glass icon to open the search bar
//         cy.get('svg[data-icon="magnifying-glass"]') // Select the magnifying glass icon
//           .click(); // Click to open the search bar

//         // Wait for the search bar to be visible and type "minhaz"
//         cy.get('input[placeholder="Search..."]', { timeout: 10000 }) // Correct selector for the search input
//           .should('be.visible') // Ensure the search bar is visible
//           .type('minhaz'); // Type the name "minhaz" into the search bar

//         // Wait for the dropdown to appear and click the first option
//         cy.get('.absolute.mt-1.w-90\\%.rounded-lg.bg-white.border-gray-200.shadow-lg.z-50.overflow-hidden') // Dropdown container
//           .find('a') // Find all <a> tags inside the dropdown
//           .first() // Click the first dropdown item (for "minhaz karim")
//           .click();

//         // Wait for Minhaz's profile to load and click the 'Add Complaint' button
//         cy.get('.add-complaint-button') // Replace with the actual selector for the 'Add Complaint' button
//           .click();

//         // Type a complaint into the textarea
//         cy.get('.complaint-textarea') // Replace with the correct selector for the complaint textarea
//           .type('Drives way too fast');

//         // Submit the complaint
//         cy.get('.submit-complaint-button') // Replace with the correct selector for the submit button
//           .click();

//         // Optionally, check that the complaint was successfully submitted
//         cy.contains('Complaint submitted').should('be.visible');
//     });
// });
