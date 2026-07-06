jest.mock("@restobar/database", () => ({
    db: {
        select: jest.fn(() => ({
            from: jest.fn(() => ({
                where: jest.fn(() => ({
                    all: jest.fn(),
                    get: jest.fn(),
                })),
                all: jest.fn(),
            })),
        })),
        insert: jest.fn(() => ({
            values: jest.fn(() => ({
                run: jest.fn(),
            })),
        })),
        delete: jest.fn(() => ({
            where: jest.fn(() => ({
                run: jest.fn(),
            })),
        })),
    },
    recetas: {},
    products: {},
}));

const { db } = require("@restobar/database");
const { guardarReceta } = require("../controllers/coccion-receta");

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe("guardarReceta", () => {
    it("inserta ingredientes y retorna los creados", async () => {
        const fakeIngredientes = [
            { ingrediente: "Sal", cantidad: 10, unidad_medida: "g" },
            { ingrediente: "Pimienta", cantidad: 5, unidad_medida: "g" },
        ];
        const fakeCreados = [
            { id: 1, productId: 5, ingrediente: "Sal", cantidad: 10, unidad_medida: "g", categoria: "C" },
            { id: 2, productId: 5, ingrediente: "Pimienta", cantidad: 5, unidad_medida: "g", categoria: "C" },
        ];

        const req = { params: { productId: "5" }, body: { ingredientes: fakeIngredientes } };
        const res = mockRes();

        const whereMock = jest.fn();
        const fromMock = jest.fn();

        db.select
            .mockReturnValueOnce({
                from: jest.fn(() => ({
                    where: jest.fn(() => ({
                        get: jest.fn().mockReturnValue(null),
                    })),
                })),
            })
            .mockReturnValueOnce({
                from: jest.fn(() => ({
                    where: jest.fn(() => ({
                        all: jest.fn().mockReturnValue(fakeCreados),
                    })),
                })),
            });

        await guardarReceta(req, res);

        expect(db.delete).not.toHaveBeenCalled();
        expect(db.insert).toHaveBeenCalledTimes(2);
        expect(db.insert).toHaveBeenNthCalledWith(1, expect.anything());
        expect(res.json).toHaveBeenCalledWith(fakeCreados);
    });

    it("elimina ingredientes existentes antes de insertar nuevos", async () => {
        const existing = { id: 1, productId: 5, ingrediente: "Sal", cantidad: 10, unidad_medida: "g" };
        const fakeIngredientes = [
            { ingrediente: "Sal", cantidad: 20, unidad_medida: "g" },
        ];
        const fakeCreados = [
            { id: 2, productId: 5, ingrediente: "Sal", cantidad: 20, unidad_medida: "g", categoria: "C" },
        ];

        const req = { params: { productId: "5" }, body: { ingredientes: fakeIngredientes } };
        const res = mockRes();

        db.select
            .mockReturnValueOnce({
                from: jest.fn(() => ({
                    where: jest.fn(() => ({
                        get: jest.fn().mockReturnValue(existing),
                    })),
                })),
            })
            .mockReturnValueOnce({
                from: jest.fn(() => ({
                    where: jest.fn(() => ({
                        all: jest.fn().mockReturnValue(fakeCreados),
                    })),
                })),
            });

        await guardarReceta(req, res);

        expect(db.delete).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(fakeCreados);
    });

    it("retorna array vacio si ingredientes es undefined", async () => {
        const req = { params: { productId: "5" }, body: {} };
        const res = mockRes();

        db.select
            .mockReturnValueOnce({
                from: jest.fn(() => ({
                    where: jest.fn(() => ({
                        get: jest.fn().mockReturnValue(null),
                    })),
                })),
            })
            .mockReturnValueOnce({
                from: jest.fn(() => ({
                    where: jest.fn(() => ({
                        all: jest.fn().mockReturnValue([]),
                    })),
                })),
            });

        await guardarReceta(req, res);

        expect(db.insert).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith([]);
    });
});
