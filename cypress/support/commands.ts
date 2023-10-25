/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

declare namespace Cypress {
  interface Chainable<Subject = any> {
    getDataTest(selector: string): Chainable<void>;
    loginGuest(): Chainable<void>;
    loginPremium(): Chainable<void>;
    onProjectsPage(username: string): Chainable<void>;
    onHomePage(): Chainable<void>;
  }
}

Cypress.Commands.add("getDataTest", (selector) => {
  cy.get(`[data-test="${selector}"]`);
});

Cypress.Commands.add("loginGuest", () => {
  cy.visit("/");
  cy.getDataTest("guest-login").click();
});

Cypress.Commands.add("loginPremium", () => {
  cy.visit("/");
  cy.getDataTest("premium-login.click").click();
  cy.contains(`Hi ${Cypress.env("premium").username}!`).should("be.visible");
  cy.url().should("include", "/projects");
});

Cypress.Commands.add("onProjectsPage", (username) => {
  cy.url().should("eq", Cypress.config().baseUrl + "/projects");
  cy.contains(`Hi ${username}!`).should("be.visible");
  cy.contains("Add A New Project").should("be.visible");
});

Cypress.Commands.add("onHomePage", () => {
  cy.url().should("eq", Cypress.config().baseUrl + "/");
  cy.contains("Budget App").should("be.visible");
  cy.contains("Log In").should("be.visible");
});
