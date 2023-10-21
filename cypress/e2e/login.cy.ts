describe("Login Tests", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.getDataTest("login-link").click();
  });

  it("Blank username and password", () => {
    cy.contains("Must enter a username").should("not.exist");
    cy.getDataTest("login-button").click();
    cy.contains("Must enter a username").should("be.visible");
  });

  it("Blank username", () => {
    cy.getDataTest("login-password-input").type("x");
    cy.contains("Must enter a username").should("not.exist");
    cy.getDataTest("login-button").click();
    cy.contains("Must enter a username").should("be.visible");
  });

  it("Blank password", () => {
    cy.getDataTest("login-username-input").type("x");
    cy.contains("Must enter a password").should("not.exist");
    cy.getDataTest("login-button").click();
    cy.contains("Must enter a password").should("be.visible");
  });

  it("User not found", () => {
    cy.getDataTest("login-username-input").type("x");
    cy.getDataTest("login-password-input").type("x");
    cy.contains("User not found").should("not.exist");
    cy.getDataTest("login-button").click();
    cy.contains("User not found").should("be.visible");
  });

  it("Incorrect password", () => {
    cy.getDataTest("login-username-input").type(Cypress.env("guest").username);
    cy.getDataTest("login-password-input").type("x");
    cy.contains("Incorrect password").should("not.exist");
    cy.getDataTest("login-button").click();
    cy.contains("Incorrect password").should("be.visible");
  });
});
