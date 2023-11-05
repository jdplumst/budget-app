describe("Expense Tests", () => {
  beforeEach(() => {
    cy.loginGuest();
    cy.getDataTest("project-12").click();
    cy.contains("You have spent $325.80 out of your $500 budget").should(
      "be.visible"
    );
  });

  it("Create Expense - Empty Name and Amount", () => {
    cy.contains("Create Expense").should("not.exist");
    cy.getDataTest("add-expense-button").click();
    cy.contains("Create Expense").should("be.visible");
    cy.contains("Expense Name must be non-empty").should("not.exist");
    cy.getDataTest("create-expense-button").click();
    cy.contains("Expense Name must be non-empty").should("be.visible");
  });

  it("Create Expense - Empty Name ", () => {
    cy.contains("Create Expense").should("not.exist");
    cy.getDataTest("add-expense-button").click();
    cy.contains("Create Expense").should("be.visible");
    cy.getDataTest("create-expense-amount-input").type("10");
    cy.contains("Expense Name must be non-empty").should("not.exist");
    cy.getDataTest("create-expense-button").click();
    cy.contains("Expense Name must be non-empty").should("be.visible");
  });

  it("User Expense Workflow", () => {
    // Create Expense API Response
    cy.intercept({
      method: "POST",
      url: Cypress.env("url").server + "/expense"
    }).as("create-response");

    // Create Expense
    cy.contains("Create Expense").should("not.exist");
    cy.getDataTest("add-expense-button").click();
    cy.contains("Create Expense").should("be.visible");
    cy.getDataTest("create-expense-name-input").type("Education Expense");
    cy.getDataTest("create-expense-amount-input").type("100.34");
    cy.getDataTest("create-expense-type-input").select("Education");
    cy.expenseNotExist("Education Expense", "100.33", "Education");
    cy.getDataTest("create-expense-button").click();
    cy.wait("@create-response").then((intercept) => {
      const createResponse = intercept.response?.body;
      cy.expenseIsVisible("Education Expense", "100.34", "Education");
      cy.contains("You have spent $426.14 out of your $500 budget").should(
        "be.visible"
      );
      cy.reload();
      cy.expenseIsVisible("Education Expense", "100.34", "Education");
      cy.contains("You have spent $426.14 out of your $500 budget").should(
        "be.visible"
      );

      // Update Expense
      cy.contains("Update Expense: Education Expense").should("not.exist");
      cy.getDataTest(`update-expense-button-${createResponse.id}`).click();
      cy.contains("Update Expense: Education Expense").should("be.visible");
      cy.getDataTest("update-expense-name-input").clear().type("Food Expense");
      cy.getDataTest("update-expense-amount-input").clear().type("115.88");
      cy.getDataTest("update-expense-type-input").select("Food");
      cy.getDataTest("update-expense-button").click();
      cy.expenseNotExist("Education Expense", "100.33", "Education");
      cy.expenseIsVisible("Food Expense", "115.88", "Food");
      cy.contains("You have spent $441.68 out of your $500 budget").should(
        "be.visible"
      );
      cy.reload();
      cy.expenseNotExist("Education Expense", "100.33", "Education");
      cy.expenseIsVisible("Food Expense", "115.88", "Food");
      cy.contains("You have spent $441.68 out of your $500 budget").should(
        "be.visible"
      );

      // Delete Expense
      cy.contains("Delete Expense: Food Expense").should("not.exist");
      cy.getDataTest(`delete-expense-button-${createResponse.id}`).click();
      cy.contains("Delete Expense: Food Expense").should("be.visible");
      cy.getDataTest("delete-expense-yes-button").click();
      cy.expenseNotExist("Food Expense", "115.88", "Food");
      cy.contains("You have spent $325.80 out of your $500 budget").should(
        "be.visible"
      );
      cy.reload();
      cy.expenseNotExist("Food Expense", "115.88", "Food");
      cy.contains("You have spent $325.80 out of your $500 budget").should(
        "be.visible"
      );
    });
  });
});
