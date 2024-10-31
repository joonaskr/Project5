describe('Issue Deletion', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url()
      .should('eq', `${Cypress.env('baseUrl')}project/board`)
      .then(() => {
        cy.get('[data-testid="board-list:backlog"]')
          .first()
          .find('[data-testid="list-issue"]')
          .first()
          .click();
        cy.get('[data-testid="modal:issue-details"]').should('be.visible');
      });
  });

  it('Delete the issue and validate that it is no longer visible on the board', () => {
    cy.get('[data-testid="icon:trash"]').click();
    cy.get('[data-testid="modal:confirm"]').within(() => {
      cy.contains('Delete issue').click();
    });
    cy.get('[data-testid="modal:confirm"]').should('not.exist');
    cy.get('[data-testid="modal:issue-details"]').should('not.exist');
    cy.reload();
    cy.get('[data-testid="board-list:backlog"]')
      .find('[data-testid="list-issue"]')
      .should('have.length.lessThan', 5);
  });

  it('Initiate and cancel the issue deletion and validate it is still visible on the board', () => {
    cy.get('[data-testid="icon:trash"]').click();
    cy.get('[data-testid="modal:confirm"]').within(() => {
      cy.contains('Cancel').click();
    });
    cy.get('[data-testid="modal:confirm"]').should('not.exist');
    cy.get('[data-testid="modal:issue-details"]').should('be.visible');
    cy.reload();
    cy.get('[data-testid="board-list:backlog"]')
      .find('[data-testid="list-issue"]')
      .first()
      .should('be.visible');
  });
});
