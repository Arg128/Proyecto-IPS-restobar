const mockAll = jest.fn();
const mockGet = jest.fn();
const mockLimit = jest.fn();
const mockOffset = jest.fn();
const mockWhere = jest.fn();
const mockFrom = jest.fn();
const mockRun = jest.fn();
const mockDeleteWhere = jest.fn();

mockWhere.mockReturnValue({ get: mockGet, all: mockAll, run: mockRun });
mockOffset.mockReturnValue({ all: mockAll });
mockLimit.mockReturnValue({ offset: mockOffset });
mockFrom.mockReturnValue({ limit: mockLimit, all: mockAll, where: mockWhere, get: mockGet });
mockDeleteWhere.mockReturnValue({ run: mockRun });

jest.mock("@restobar/database", () => ({
    db: {
        select: jest.fn(() => ({ from: mockFrom })),
        delete: jest.fn(() => ({ where: mockDeleteWhere })),
        insert: jest.fn(() => ({ values: jest.fn(() => ({ run: mockRun, returning: jest.fn(() => ({ get: mockGet })) })) })),
    },
    categories: {},
    products: {},
    now: jest.fn(() => "2026-01-01T00:00:00.000Z"),
}));

const { getCategories, deleteCategory } = require("../controllers/category");

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe("getCategories", () => {
    it("retorna todas las categorias cuando ?all=true", async () => {
        const fakeCategories = [
            { id: 1, name: "Bebidas" },
            { id: 2, name: "Carnes" },
        ];
        mockAll.mockReturnValue(fakeCategories);

        const req = { query: { all: "true" } };
        const res = mockRes();

        await getCategories(req, res);

        expect(res.json).toHaveBeenCalledWith(fakeCategories);
    });

    it("retorna paginado cuando no hay ?all=true", async () => {
        const fakeData = [{ id: 1, name: "Bebidas" }];
        mockAll.mockResolvedValue(fakeData);
        mockGet.mockReturnValue({ total: 1 });

        const req = { query: {} };
        const res = mockRes();

        await getCategories(req, res);

        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ categories: fakeData, page: 1, pages: 1 })
        );
    });
});

describe("deleteCategory", () => {
    beforeEach(() => {
        mockGet.mockReset();
        mockAll.mockReset();
    });

    it("elimina categoria si no tiene productos asociados", async () => {
        mockGet.mockReturnValueOnce({ id: 5, name: "Bebidas" });
        mockAll.mockReturnValueOnce([{ total: 0 }]);

        const req = { params: { id: "5" } };
        const res = mockRes();

        await deleteCategory(req, res);

        expect(res.json).toHaveBeenCalledWith({ message: "Category removed" });
    });

    it("rechaza eliminar si hay productos usando la categoria", async () => {
        mockGet.mockReturnValueOnce({ id: 5, name: "Bebidas" });
        mockAll.mockReturnValueOnce([{ total: 3 }]);

        const req = { params: { id: "5" } };
        const res = mockRes();

        await expect(deleteCategory(req, res)).rejects.toThrow(
            'Cannot delete "Bebidas": 3 product(s) are using this category'
        );
    });

    it("retorna 404 si la categoria no existe", async () => {
        mockGet.mockReturnValueOnce(undefined);

        const req = { params: { id: "999" } };
        const res = mockRes();

        await expect(deleteCategory(req, res)).rejects.toThrow("Category not found");
        expect(res.status).toHaveBeenCalledWith(404);
    });
});
