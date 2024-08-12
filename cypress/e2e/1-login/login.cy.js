describe("로그인 화면", () => {
  it("사용자는 아이디와 비밀번호를 사용해서 로그인한다.", () => {
    // given - 로그인 페이지에 접근
    cy.visit("/login");
    cy.get("[data-cy=emailInput]").as("emailInput");
    cy.get("[data-cy=passwordInput]").as("passwordInput");

    // when - 아이디 비밀번호 입력 로그인버튼 클릭
    const email = "test@email.com";
    const password = "password";
    cy.get("@emailInput").type(email);
    cy.get("@passwordInput").type(password);

    // 값이 제대로 들어갔는지 확인
    cy.get("@emailInput").invoke("val").should("eq", email);
    cy.get("@passwordInput").invoke("val").should("eq", password);

    cy.intercept(
      {
        method: "POST",
        url: "/user/login",
      },
      {
        token: "AUTH_TOKEN",
      }
    ).as("login");

    cy.get("[data-cy=loginButton]").should("exist").click();

    // then - 로그인에 성공 메인화면으로 이동

    cy.url().should("eq", "http://localhost:5173/");
  });
});
