import ProductModel from "../models/product.model.js";

export class ProductManager {

    // Agregar un producto
    addProduct = async ({ title, description, price, code, stock, status, category, thumbnails }) => {
        try {
            if (!title || !description || !price || !code || !stock || !category) {
                throw new Error("Todos los campos son obligatorios");
            }

            const newProduct = new ProductModel({
                title,
                description,
                price,
                code,
                stock,
                status,
                category,
                thumbnails
            });

            await newProduct.save();
            return newProduct;
        } catch (error) {
            throw new Error("Error al agregar el producto: " + error.message);
        }
    }

    // Obtener todos los productos
    getProducts = async (params = {}) => {
        try {
            // Asegúrate de que params tenga valores por defecto
            const { limit = 10, skip = 10, sortOrder = null, filter = {} } = params;

            // Validar y ajustar el valor de sortOrder
            let sort = {};
            if (sortOrder === 'asc') {
                sort = { price: 1 };
            } else if (sortOrder === 'desc') {
                sort = { price: -1 };
            }

            const products = await ProductModel.find(filter)
                .sort(sort) // Ordenar por precio
                .skip(skip) // Omitir productos
                .limit(limit) // Limitar número de productos
                .exec(); // Ejecutar consulta

            return products;
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw new Error('Error al obtener productos: ' + error.message);
        }
    }

    // Obtener un producto por ID
    getProductById = async (id) => {
        try {
            const product = await ProductModel.findById(id);
            if (!product) {
                throw new Error("Producto no encontrado");
            }
            return product;
        } catch (error) {
            throw new Error('Error al obtener producto por ID: ' + error.message);
        }
    }

    // Actualizar un producto
    updateProduct = async (id, updateData) => {
        try {
            const updatedProduct = await ProductModel.findByIdAndUpdate(id, updateData, { new: true });
            if (!updatedProduct) {
                throw new Error("Producto no encontrado");
            }
            return updatedProduct;
        } catch (error) {
            throw new Error('Error al actualizar producto: ' + error.message);
        }
    }

    // Eliminar un producto
    deleteProduct = async (id) => {
        try {
            const result = await ProductModel.findByIdAndDelete(id);
            if (!result) {
                throw new Error("Producto no encontrado con id: " + id);
            }
            return true;
        } catch (error) {
            throw new Error('Error al eliminar el producto: ' + error.message);
        }
    }

    // Contar productos
    countProducts = async (filter = {}) => {
        try {
            const count = await ProductModel.countDocuments(filter).exec();
            return count;
        } catch (error) {
            throw new Error('Error al contar productos: ' + error.message);
        }
    }
}
