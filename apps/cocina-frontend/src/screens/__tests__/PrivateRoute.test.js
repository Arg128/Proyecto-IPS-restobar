import React from "react";
import { render, cleanup } from "@testing-library/react";
import { Router, Route } from "react-router-dom";
import { createMemoryHistory } from "history";
import PrivateRoute from "../../auth/PrivateRoute";

afterEach(() => {
    cleanup();
    localStorage.clear();
});

const DummyComponent = () => <div>Contenido Protegido</div>;
const LoginPlaceholder = () => <div>Login Page</div>;

describe("PrivateRoute", () => {
    it("renders the component when user is authenticated", () => {
        localStorage.setItem("userInfo", JSON.stringify({ token: "abc" }));
        const history = createMemoryHistory({ initialEntries: ["/"] });

        const { getByText } = render(
            <Router history={history}>
                <PrivateRoute path="/" component={DummyComponent} />
            </Router>
        );

        expect(getByText(/Contenido Protegido/)).toBeInTheDocument();
    });

    it("redirects to /login when user is not authenticated", () => {
        const history = createMemoryHistory({ initialEntries: ["/"] });

        render(
            <Router history={history}>
                <PrivateRoute path="/" component={DummyComponent} />
                <Route path="/login" component={LoginPlaceholder} />
            </Router>
        );

        expect(history.location.pathname).toBe("/login");
    });
});
