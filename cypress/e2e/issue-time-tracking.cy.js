describe('Issue Time Tracking: Estimation Functionality', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board');
            cy.contains('This is an issue of type: Task.').click();
        });
    });

    const setOriginalEstimate = (value) => {
        cy.contains('Original Estimate (hours)')
            .parent()
            .find('input')
            .clear()
            .then(($input) => {
                if (value !== '') {
                    cy.wrap($input).type(value);
                }
            });
    };

    const checkOriginalEstimate = (expectedValue) => {
        cy.contains('Original Estimate (hours)')
            .parent()
            .find('input')
            .should('have.value', expectedValue);
    };

    const closeAndReopenModal = () => {
        cy.get('[data-testid="icon:close"]').first().click();
        cy.wait(1000);
        cy.contains('This is an issue of type: Task.').click();
    };

    it('should handle time estimation updates and logging time correctly', () => {
        cy.contains('Original Estimate (hours)')
            .parent()
            .find('input')
            .then(($input) => {
                const currentValue = $input.val();
                const newValue = currentValue && !isNaN(currentValue) ? parseInt(currentValue) + 10 : 10;

                setOriginalEstimate(newValue);
                checkOriginalEstimate(newValue);

                closeAndReopenModal();
                checkOriginalEstimate(newValue);
            });

        setOriginalEstimate(20);
        checkOriginalEstimate(20);

        closeAndReopenModal();
        checkOriginalEstimate(20);

        setOriginalEstimate('');
        checkOriginalEstimate('');

        closeAndReopenModal();
        checkOriginalEstimate('');

        cy.get('[data-testid="icon:stopwatch"]').click();

        cy.contains('Time spent (hours)')
            .parent()
            .find('input')
            .clear()
            .type('2');

        cy.contains('Time remaining (hours)')
            .parent()
            .find('input')
            .clear()
            .type('5');

        cy.get('button').contains('Done').click();

        cy.contains('2h logged').should('be.visible');
        cy.contains('No time logged').should('not.exist');
        cy.contains('5h remaining').should('be.visible');

        cy.get('[data-testid="icon:stopwatch"]').click();
        cy.wait(1000);

        cy.contains('Time spent (hours)').parent().find('input').clear();
        cy.contains('Time remaining (hours)').parent().find('input').clear();

        cy.get('button').contains('Done').click();

        cy.contains('No time logged').should('be.visible');

        cy.contains('Original Estimate (hours)')
            .parent()
            .find('input')
            .should('not.have.value', '');
    });
});