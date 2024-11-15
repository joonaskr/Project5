describe('Issue details editing', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
      cy.visit(url + '/board');
      cy.contains('This is an issue of type: Task.').click();
    });
  });

  it('Update type, status, assignees, reporter, priority successfully', () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:type"]').click('bottomRight');
      cy.get('[data-testid="select-option:Story"]')
          .trigger('mouseover')
          .trigger('click');
      cy.get('[data-testid="select:type"]').should('contain', 'Story');

      cy.get('[data-testid="select:status"]').click('bottomRight');
      cy.get('[data-testid="select-option:Done"]').click();
      cy.get('[data-testid="select:status"]').should('have.text', 'Done');

      cy.get('[data-testid="select:assignees"]').click('bottomRight');
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
      cy.get('[data-testid="select:assignees"]').click('bottomRight');
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="select:assignees"]').should('contain', 'Baby Yoda');
      cy.get('[data-testid="select:assignees"]').should('contain', 'Lord Gaben');

      cy.get('[data-testid="select:reporter"]').click('bottomRight');
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('[data-testid="select:reporter"]').should('have.text', 'Pickle Rick');

      cy.get('[data-testid="select:priority"]').click('bottomRight');
      cy.get('[data-testid="select-option:Medium"]').click();
      cy.get('[data-testid="select:priority"]').should('have.text', 'Medium');
    });
  });

  it('Update title, description successfully', () => {
    const title = 'TEST_TITLE';
    const description = 'TEST_DESCRIPTION';

    getIssueDetailsModal().within(() => {
      cy.get('textarea[placeholder="Short summary"]')
        .clear()
        .type(title)
        .blur();

      cy.get('.ql-snow')
        .click()
        .should('not.exist');

      cy.get('.ql-editor').clear().type(description);

      cy.contains('button', 'Save')
        .click()
        .should('not.exist');

      cy.get('textarea[placeholder="Short summary"]').should('have.text', title);
      cy.get('.ql-snow').should('have.text', description);
    });
  });

  it('Validate the Priority dropdown values', () => {
    const expectedPriorityValues = ['Highest', 'Medium', 'Low', 'Lowest', 'High'];
  
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:priority"]').click('bottomRight');
      cy.get('[data-testid^="select-option:"]').should('be.visible');
  
      cy.get('[data-testid^="select-option:"]').each(($el, index) => {
        const optionText = $el.text().trim();
        cy.wrap(optionText).should('equal', expectedPriorityValues[index]);
      });
    });
  });

  it('Validate the reporters name contains only characters', () => {
    const reporterSelector = '[data-testid="select:reporter"]'; 
  
    getIssueDetailsModal().within(() => {
      cy.get(reporterSelector).then($el => {
        const reporterName = $el.text().trim(); 
        const regex = /^[A-Za-z\s]+$/;
        expect(reporterName).to.match(regex);
      });
    });
  });  

  const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');
});