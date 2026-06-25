const { Product, Table, Order } = require("../models");

exports.stock = async (list) => {
    for (let index = 0; index < list.length; index++) {
        const productSearched = await Product.findByPk(list[index].id);
        if (productSearched.stock < list[index].quantity) {
            return false;
        }
    }
    return true;
};

exports.updateTable = async (id, occupied) => {
    const table = await Table.findByPk(id);
    table.occupied = occupied;
    await table.save();
};

exports.addProductsInOrder = async (order, products) => {
    products.forEach(async (product) => {
        await order.addProduct(product.id, {
            through: { quantity: product.quantity },
        });
    });
};

exports.updateProductsStock = async (products, condition) => {
    await products.forEach(async (product) => {
        const productToUpdate = await Product.findByPk(product.id);

        if (productToUpdate) {
            if (condition >= 1) {
                productToUpdate.stock += product.quantity;
            } else {
                productToUpdate.stock -= product.quantity;
            }
            await productToUpdate.save();
        }
    });
};
