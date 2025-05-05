Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });
  
  describe('Campus Caravan - Ride Posts Page', () => {
  
    beforeEach(() => {
      cy.visit('https://campus-carawan-lums.up.railway.app/login');
  
    cy.get('input[placeholder="Username or Email"]').type('abidkarim74');
    cy.get('input[placeholder="Password"]').type('YS2b7kat');
    
          cy.get('button[type="submit"]').click();
  
          cy.url().should('eq', 'https://campus-carawan-lums.up.railway.app/');
    
    });
  
    it('Displays ride posts or shows fallback message', () => {
        cy.contains('Available ride requests in your area', { timeout: 10000 }).should('exist');
    

        cy.get('body').then(($body) => {
          if ($body.text().includes('No ride requests available')) {
            cy.contains('No ride requests available').should('exist');
          } else {
            cy.get('.rounded-xl').should('have.length.at.least', 1);
    
            cy.get('.rounded-xl').first().within(() => {
              cy.contains(/Pickup/i).should('exist');
              cy.contains(/Dropoff/i).should('exist');
            });
          }
        });
      });
  
      it('Accepts a ride if available', () => {
        cy.contains('Available ride requests in your area', { timeout: 10000 }).should('exist');
    
        cy.get('body').then(($body) => {
          if ($body.text().includes('Accept Ride')) {
            cy.get('button')
              .contains('Accept Ride')
              .first()
              .click({ force: true });
    
            cy.contains('Ride request accepted successfully!').should('exist');
          } else {
            cy.log('No unaccepted rides to test with right now.');
          }
        });
      });
      it('Creates a new ride post successfully', () => {
      
        cy.get('a[href="/make-ride-request"]')
          .should('exist')
          .should('be.visible')
          .click({ force: true });
      
  
        cy.get('input[placeholder="Enter pickup location"]')
          .type('LUMS Masjid, Street 7, DHA Phase V', { delay: 100 });
        cy.get('ul li', { timeout: 10000 }).first().click();
      
        cy.get('input[placeholder="Enter destination"]')
          .type('Jail Road, Lahore Cantonment, Saint John Park', { delay: 100 });
        cy.get('ul li', { timeout: 10000 }).first().click();
      
        cy.contains('button', '2').click();
      
        cy.get('input[type="number"]').type('400');
      
        cy.get('textarea').type('Only with AC please');
        cy.get('input[placeholder="e.g. 3:00"]').type('3:30');
        cy.contains('button', 'PM').click();
        cy.get('button[type="submit"]')
          .should('not.be.disabled')
          .click();

        
        cy.contains('Available ride requests in your area', { timeout: 10000 }).should('exist');
        
      });
      
      
      
      
    });
  
  