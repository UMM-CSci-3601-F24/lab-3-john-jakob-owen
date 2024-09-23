import { TodoListPage } from '../support/todo-list.po';

const page = new TodoListPage();

describe('Todo list', () => {
  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct page title', () => {
    page.getPageTitle().should('eq', 'Todos');
  });

  it('Should have the correct title', () => {
    page.getTodoTitle().should('have.text', 'Todos');
  });

  it('Should type something in the owner filter and check that it returned correct elements', () => {
    // Filter for owner 'Barry'
    cy.get('[data-test=todoOwnerInput]').type('Barry');

    // All of the user cards should have the name we are filtering by
    page.getTodoPanels().each($panel => {
      cy.wrap($panel).find('.todo-owner').contains('Barry');
    });

    // (We check this two ways to show multiple ways to check this)
    // page
    //   .getTodoPanels()
    //   .find('.todo-owner')
    //   .each($name => expect($name.text()).to.equal('Barry'));
  });

  it('Should type something in the category filter and check that it returned correct elements', () => {
    // Filter for company 'OHMNET'
    cy.get('[data-test=todoCategoryInput]').type('video games');

    page.getTodoPanels().should('have.lengthOf.above', 0);

    // All of the user cards should have the company we are filtering by
    page
      .getTodoPanels()
      .find('mat-panel-description')
      .each($panel => {
        cy.wrap($panel).contains('video games');
      });
  });

  it('Should type something in the limit filter and check that it returned correct elements', () => {
    // Filter for company 'OHMNET'
    cy.get('[data-test=todoLimitInput]').type('7');

    page.getTodoPanels().should('have.lengthOf.above', 0);

    // All of the user cards should have the company we are filtering by
    page
    .getTodoPanels().should('have.lengthOf', 7);
  });


  it('Should type something in the status neither filter and check that it returned correct elements', () => {
    // Filter for company 'OHMNET'
    cy.get('#statusNeither').click();

    page.getTodoPanels().should('have.lengthOf.above', 0);

    // All of the user cards should have the company we are filtering by
    page
    .getTodoPanels()
    .find('mat-panel-title')
    .each($panel => {
      cy.wrap($panel).contains(/(in)?omplete/);
    });

  });

  it('Should type something in the status true filter and check that it returned correct elements', () => {
    // Filter for company 'OHMNET'
    cy.get('#statusTrue').click();

    page.getTodoPanels().should('have.lengthOf.above', 0);

    // All of the user cards should have the company we are filtering by
    page
    .getTodoPanels()
    .find('mat-panel-title')
    .each($panel => {
      cy.wrap($panel).contains('Complete');
    });

  });

  it('Should type something in the status false filter and check that it returned correct elements', () => {
    // Filter for company 'OHMNET'
    cy.get('#statusFalse').click();

    page.getTodoPanels().should('have.lengthOf.above', 0);

    // All of the user cards should have the company we are filtering by
    page
    .getTodoPanels()
    .find('mat-panel-title')
    .each($panel => {
      cy.wrap($panel).contains('Incomplete');
    });

  });

  it('Should type something partial in the category filter and check that it returned correct elements', () => {
    // Filter for companies that contain 'ti'
    cy.get('[data-test=todoCategoryInput]').type('es');

    page.getTodoPanels().should('have.lengthOf', 221);

    // Each user card's company name should include the text we are filtering by
    page.getTodoPanels().each(e => {
      cy.wrap(e).find('mat-panel-description').contains('es');
    });
  });

  it('Should type something in the body filter and check that it returned correct elements', () => {
    // Filter for company 'OHMNET'
    cy.get('[data-test=todoBodyInput]').type('quis');

    page.getTodoPanels().should('have.lengthOf.above', 0);

    // All of the user cards should have the company we are filtering by
    page
      .getTodoPanels()
      .find('.todo-body')
      .each($panel => {
        cy.wrap($panel).contains('Body');
      });
  });
  });
