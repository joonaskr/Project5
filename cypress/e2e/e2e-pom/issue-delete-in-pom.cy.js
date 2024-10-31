import issueModal from '../../pages/IssueModal';

describe("Issue Deletion in POM", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url().should("eq", `${Cypress.env("baseUrl")}project/board`);
    issueModal.openFirstIssue(); // Using POM to open the first issue
  });

  it("Should delete the issue and validate it is no longer visible on the board", () => {
    issueModal.clickDeleteButton(); // Using POM to click delete
    issueModal.confirmDeletion();   // Confirm the deletion
    issueModal.isIssueDeleted();    // Assert the issue is deleted

    cy.reload();
    cy.get('[data-testid="board-list:backlog"]')
      .find('[data-testid="list-issue"]')
      .should("have.length.lessThan", 5);
  });

  it("Should initiate and cancel the issue deletion, ensuring issue remains visible", () => {
    issueModal.clickDeleteButton(); // Using POM to click delete
    issueModal.cancelDeletion();    // Cancel deletion

    cy.reload();
    cy.get('[data-testid="board-list:backlog"]')
      .find('[data-testid="list-issue"]')
      .first()
      .should("be.visible");
  });
});
