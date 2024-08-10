import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import SignupPage from "../pages/SignupPage";
import { createMemoryRouter, RouteObject, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {},
});

describe("회원가입 테스트", () => {
  beforeEach(() => {
    const routes: RouteObject[] = [
      {
        path: "/signup",
        element: <SignupPage />,
      },
    ];

    const router = createMemoryRouter(routes, {
      initialEntries: ["/signup"],
      initialIndex: 0,
    });
    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );
  });
  test("비밀번호와 비밀번호 확인 값이 일치하지 않으면 오류 메시지 출력", async () => {
    // given - 회원가입 페이지 렌더링

    // when - 비밀번호와 비밀번호 확인 값이 일치하지 않음
    const passwordInput = screen.getByLabelText("비밀번호");
    const confirmPasswordInput = screen.getByLabelText("비밀번호 확인");

    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "wrong" } });

    // then - 오류메시지 출력
    const errorMessage = await screen.findByTestId("error-message");
    expect(errorMessage).toBeInTheDocument();
  });

  test("이메일을 입력하고, 비밀번호와 비밀번호 확인 값이 일치하면 회원가입 버튼이 활성화된다.", () => {
    // given - 페이지 렌더링
    const signupButton = screen.getByRole("button", { name: "회원가입" });
    expect(signupButton).toBeDisabled();
    // when - 이메일 입력, 비밀번호와 비밀번호 확인 값이 일치
    const emailInput = screen.getByLabelText("이메일");
    const passwordInput = screen.getByLabelText("비밀번호");
    const confirmPasswordInput = screen.getByLabelText("비밀번호 확인");

    fireEvent.change(emailInput, { target: { value: "wow@naver.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "password" } });

    // then - 회원가입 버튼 활성화
    expect(signupButton).toBeEnabled();
  });
});
