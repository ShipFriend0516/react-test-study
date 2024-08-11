import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, renderHook, screen, waitFor } from "@testing-library/react";
import LoginPage from "../pages/LoginPage";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import useLogin from "../hooks/useLogin";
import * as nock from "nock";

const queryClient = new QueryClient({
  defaultOptions: {},
});

describe("로그인 테스트", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test("로그인에 실패하면 에러메시지가 나타난다", async () => {
    // given
    const routes = [
      {
        path: "/login",
        element: <LoginPage />,
      },
    ];

    const router = createMemoryRouter(routes, {
      initialEntries: ["/login"],
      initialIndex: 0,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );

    // when - 사용자가 로그인에 실패한다.

    // 가짜 서버 응답 설정
    /**
     * 가짜 서버를 사용하면 서버로 요청을 보내지않고 원하는 테스트를 할 수 있음
     */
    nock("https://inflearn.byeongjinkang.com")
      .post("/user/login/", {
        username: "wrong@email.com",
        password: "wrongPassword",
      })
      .reply(400, { id: "123ABC" });

    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const emailInput = screen.getByLabelText("이메일");
    const passwordInput = screen.getByLabelText("비밀번호");

    fireEvent.change(emailInput, { target: { value: "wrong@email.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongPassword" } });

    const loginButton = screen.getByRole("button", { name: "로그인" });
    fireEvent.click(loginButton);

    const { result } = renderHook(() => useLogin(), { wrapper });

    // then
    await waitFor(() => result.current.isError);
    const errorMessage = await screen.findByTestId("error-message");
    expect(errorMessage).toBeInTheDocument();
  });
});
