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
});
