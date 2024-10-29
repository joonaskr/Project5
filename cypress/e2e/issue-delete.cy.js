describe('Issue Deletion', () => {
    beforeEach(() => {
      // Visit the board and open the first issue
      cy.visit('/');
      cy.url()
        .should('eq', `${Cypress.env('baseUrl')}project/board`)
        .then(() => {
          // Click the first issue in the backlog
          cy.get('[data-testid="board-list:backlog"]')
            .first()
            .find('[data-testid="list-issue"]')
            .first()
            .click();
  
          // Assert that the issue detail modal is visible
          cy.get('[data-testid="modal:issue-details"]').should('be.visible');
        });
    });
  
    it('Should delete the issue and validate that it is no longer visible on the board', () => {
      // Delete the issue by clicking the delete button
      cy.get('[data-testid="icon:trash"]').click();
  
      // Confirm the deletion by clicking on the confirmation dialog's delete button
      cy.get('[data-testid="modal:confirm"]').within(() => {
        cy.contains('Delete issue').click();
      });
  
      // Assert that the deletion confirmation dialog is no longer visible
      cy.get('[data-testid="modal:confirm"]').should('not.exist');
  
      // Assert that the issue detail modal is closed
      cy.get('[data-testid="modal:issue-details"]').should('not.exist');
  
      // Reload the page and validate that the deleted issue is no longer visible on the board
      cy.reload();
  
      // Check that the issue is no longer present in the backlog list
      cy.get('[data-testid="board-list:backlog"]')
        .find('[data-testid="list-issue"]')
        .should('have.length.lessThan', 5);  // Assuming there were 5 issues initially
    });

    it('Should initiate and cancel the issue deletion and validate it is still visible on the board', () => {
        // Initiate the issue deletion process by clicking the delete button
        cy.get('[data-testid="icon:trash"]').click();
    
        // Cancel the deletion by clicking on the cancel button in the confirmation dialog
        cy.get('[data-testid="modal:confirm"]').within(() => {
          cy.contains('Cancel').click();  // Clicks the Cancel button in the confirmation pop-up
        });
    
        // Assert that the deletion confirmation dialog is no longer visible
        cy.get('[data-testid="modal:confirm"]').should('not.exist');
    
        // Assert that the issue detail modal is still visible
        cy.get('[data-testid="modal:issue-details"]').should('be.visible');
    
        // Reload the page to ensure the issue is still on the board
        cy.reload();
    
        // Check that the issue is still present in the backlog list
        cy.get('[data-testid="board-list:backlog"]')
          .find('[data-testid="list-issue"]')
          .first()
          .should('be.visible');  // The issue should still be there after canceling deletion
      });
    });
  