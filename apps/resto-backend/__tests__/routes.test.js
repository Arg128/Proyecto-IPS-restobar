jest.mock("../controllers/product", () => ({
    getProducts: jest.fn(),
}));

jest.mock("../controllers/category", () => ({
    getCategories: jest.fn(),
}));

const { getProducts } = require("../controllers/product");
const { getCategories } = require("../controllers/category");
const router = require("../routes/products");

describe("routes/products.js", () => {
    it("GET / delega a getProducts con ?all=true", () => {
        const route = router.stack.find(r => r.route?.path === "/" && r.route?.methods?.get);
        expect(route).toBeDefined();

        const middlewares = route.route.stack;
        const handler = middlewares[middlewares.length - 1].handle;

        const req = { query: {} };
        const res = {};
        const next = jest.fn();

        handler(req, res, next);

        expect(req.query.all).toBe("true");
        expect(getProducts).toHaveBeenCalledWith(req, res, next);
    });

    it("GET /categorias delega a getCategories con ?all=true", () => {
        const route = router.stack.find(r => r.route?.path === "/categorias" && r.route?.methods?.get);
        expect(route).toBeDefined();

        const middlewares = route.route.stack;
        const handler = middlewares[middlewares.length - 1].handle;

        const req = { query: {} };
        const res = {};
        const next = jest.fn();

        handler(req, res, next);

        expect(req.query.all).toBe("true");
        expect(getCategories).toHaveBeenCalledWith(req, res, next);
    });
});
