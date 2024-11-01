import issueModal from '../../pages/IssueModal';

describe("Issue Deletion in POM", () => {
  let issueCount;
  beforeEach(() => {
    cy.visit("/");
    cy.url().should("eq", `${Cypress.env("baseUrl")}project/board`);
    issueModal.getBacklogIssueCount().then(count => { issueCount = count; });
    issueModal.openFirstIssue();
  });

  it("Should delete the issue and validate it is no longer visible on the board", () => {
    issueModal.clickDeleteButton();
    issueModal.confirmDeletion();
    issueModal.isIssueDeleted();
    issueModal.verifyIssueCount(issueCount-1);
  });

  it("Should initiate and cancel the issue deletion, ensuring issue remains visible", () => {
    issueModal.clickDeleteButton();
    issueModal.cancelDeletion();
    issueModal.verifyIssueCount(issueCount);
  });
});