const mockFindMany = jest.fn();
const mockAll = jest.fn();
const mockGet = jest.fn();
const mockLimit = jest.fn();
const mockOffset = jest.fn();
const mockWhere = jest.fn();
const mockFrom = jest.fn();

mockWhere.mockReturnValue({ get: mockGet, all: mockAll, run: jest.fn() });
mockOffset.mockReturnValue({ all: mockAll });
mockLimit.mockReturnValue({ offset: mockOffset });
mockFrom.mockReturnValue({ limit: mockLimit, all: mockAll, where: mockWhere, get: mockGet });

jest.mock("@restobar/database", () => ({
    db: {
        query: { products: { findMany: mockFindMany } },
        select: jest.fn(() => ({ from: mockFrom })),
    },
    products: {},
    categories: {},
    now: jest.fn(() => "2026-01-01T00:00:00.000Z"),
}));

const { getProducts } = require("../controllers/product");

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe("getProducts", () => {
    it("retorna todos los productos con categoria cuando ?all=true", async () => {
        const fakeProducts = [
            { id: 1, name: "Lomo", price: 25, stock: 10, categoryId: 2, category: { id: 2, name: "Carnes" } },
            { id: 2, name: "Jugo", price: 8, stock: 20, categoryId: 1, category: { id: 1, name: "Bebidas" } },
        ];
        mockFindMany.mockResolvedValue(fakeProducts);

        const req = { query: { all: "true" } };
        const res = mockRes();

        await getProducts(req, res);

        expect(mockFindMany).toHaveBeenCalledWith({ with: { category: true } });
        expect(res.json).toHaveBeenCalledWith(fakeProducts);
    });

    it("retorna paginado cuando no hay ?all=true", async () => {
        mockAll.mockResolvedValue([{ id: 1, name: "Lomo", price: 25, stock: 10, categoryId: 2 }]);
        mockGet.mockReturnValue({ total: 1 });

        const req = { query: {} };
        const res = mockRes();

        await getProducts(req, res);

        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ page: 1, pages: 1 })
        );
    });

    it("retorna array vacio cuando no hay productos con ?all=true", async () => {
        mockFindMany.mockResolvedValue([]);

        const req = { query: { all: "true" } };
        const res = mockRes();

        await getProducts(req, res);

        expect(res.json).toHaveBeenCalledWith([]);
    });
});
