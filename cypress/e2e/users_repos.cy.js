before(() => {
  cy.intercept('/users/dcstone09/repos', { fixture: 'repos' });
  cy.visit('/')
});

describe('Search for usesr\'s repositories', () => {
  it('should search for a user', () => {
    cy.get('[data-cy="user-search"]').type('dcstone09');

    cy.get('li').contains('dcstone09').click();
  })
});

