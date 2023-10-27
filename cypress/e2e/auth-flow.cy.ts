describe("Auth Flow Tests", () => {
  it("Logged out", () => {
    cy.visit("/projects");
    cy.onHomePage();
    cy.visit("/projects/12");
    cy.onHomePage();
    cy.visit("/premium");
    cy.onHomePage;
    cy.visit("/");
    cy.onHomePage();
    cy.visit("/login");
    cy.url().should("eq", Cypress.config().baseUrl + "/login");
    cy.contains("Login").should("be.visible");
    cy.visit("/signup");
    cy.url().should("eq", Cypress.config().baseUrl + "/signup");
    cy.contains("Sign Up").should("be.visible");
  });

  it("Logged in then logged out", () => {
    const username = Cypress.env("guest").username;

    // Logged in
    cy.loginGuest();
    cy.onProjectsPage(username);
    cy.getDataTest("project-12").click();
    cy.url().should("eq", Cypress.config().baseUrl + "/projects/12");
    cy.contains(`Hi ${username}!`).should("be.visible");
    cy.contains("My First Project").should("be.visible");
    cy.getDataTest("premium-link").click();
    cy.url().should("eq", Cypress.config().baseUrl + "/premium");
    cy.contains(`Hi ${username}!`).should("be.visible");
    cy.contains("Get started with a plan to help track your budgets.").should(
      "be.visible"
    );
    cy.getDataTest("projects-link").click();
    cy.onProjectsPage(username);
    cy.visit("/");
    cy.onProjectsPage(username);
    cy.visit("/login");
    cy.onProjectsPage(username);
    cy.visit("/signup");
    cy.visit("/projects");
    cy.onProjectsPage(username);
    cy.visit("/projects/12");
    cy.url().should("eq", Cypress.config().baseUrl + "/projects/12");
    cy.contains(`Hi ${username}!`).should("be.visible");
    cy.contains("My First Project").should("be.visible");
    cy.visit("/projects/14");
    cy.wait(5000);
    cy.url().should("eq", Cypress.config().baseUrl + "/projects/14");
    cy.contains("You are not authorized to see this project").should(
      "be.visible"
    );
    cy.visit("/premium");
    cy.url().should("eq", Cypress.config().baseUrl + "/premium");
    cy.contains(`Hi ${username}!`).should("be.visible");
    cy.contains("Get started with a plan to help track your budgets.").should(
      "be.visible"
    );

    // Log out
    cy.getDataTest("logout-button").click();
    cy.onHomePage();
    cy.visit("/projects");
    cy.onHomePage();
    cy.visit("/projects/12");
    cy.onHomePage();
    cy.visit("/premium");
    cy.onHomePage();
    cy.getDataTest("login-link").click();
    cy.url().should("eq", Cypress.config().baseUrl + "/login");
    cy.contains("Login").should("be.visible");
    cy.visit("/");
    cy.getDataTest("signup-link").click();
    cy.url().should("eq", Cypress.config().baseUrl + "/signup");
    cy.contains("Sign Up").should("be.visible");
  });
});
