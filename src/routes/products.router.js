import { Router } from 'express';
import { ProductManager } from '../dao/db/product-manager-db.js';

const productsRouter = Router();
const manager = new ProductManager();

// Obtener productos con paginación, filtrado y ordenamiento
productsRouter.get('/', async (req, res) => {
    const { limit = 30, page = 1, sort = null, query = '{}' } = req.query;

    const limitNumber = parseInt(limit);
    const pageNumber = parseInt(page);
    const skip = (pageNumber - 1) * limitNumber;
    let sortOrder = null;

    // Convertir el parámetro de query a un objeto
    let filter = {};
    try {
        filter = JSON.parse(query);
    } catch (error) {
        return res.status(400).json({ error: "El parámetro 'query' no es válido JSON" });
    }

    // Establecer el orden de clasificación basado en el parámetro de consulta
    if (sort === 'asc' || sort === 'desc') {
        sortOrder = { price: sort === 'asc' ? 1 : -1 };
    }

    try {
        const productos = await manager.getProducts({
            limit: limitNumber,
            skip: skip,
            sortOrder: sortOrder,
            filter: filter
        });

        const totalProducts = await manager.countProducts(filter);
        const totalPages = Math.ceil(totalProducts / limitNumber);

        res.json({
            productos,
            totalPages,
            currentPage: pageNumber,
            limit: limitNumber
        });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener productos", details: error.message });
    }
});

// Obtener un producto por PID
productsRouter.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const producto = await manager.getProductById(pid);
        if (!producto) {
            res.status(404).json({ message: "Producto no encontrado" });
        } else {
            res.json(producto);
        }
    } catch (error) {
        res.status(500).json({ error: "Error al buscar el producto por ID", details: error.message });
    }
});

// Crear un nuevo producto
productsRouter.post('/', async (req, res) => {
    const nuevoProducto = req.body;
    console.log("Datos recibidos para agregar un producto:", nuevoProducto); // Logging para depuración
    try {
        // Validación básica
        if (!nuevoProducto.title || !nuevoProducto.description || !nuevoProducto.price || !nuevoProducto.code || !nuevoProducto.stock || !nuevoProducto.category) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        const producto = await manager.addProduct(nuevoProducto);
        res.status(201).json(producto); // Devuelve el producto creado
    } catch (error) {
        console.error("Error al agregar producto:", error); // Logging del error
        res.status(500).json({ error: "Error interno del servidor", details: error.message });
    }
});

// Actualizar un producto por PID
productsRouter.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const productoActualizado = req.body;
    try {
        const producto = await manager.updateProduct(pid, productoActualizado);
        if (!producto) {
            res.status(404).json({ message: "Producto no encontrado" });
        } else {
            res.json({ message: "Producto actualizado correctamente", producto });
        }
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor", details: error.message });
    }
});

// Eliminar un producto por PID
productsRouter.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const resultado = await manager.deleteProduct(pid);
        if (!resultado) {
            res.status(404).json({ message: "Producto no encontrado" });
        } else {
            res.json({ message: "Producto eliminado correctamente" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor", details: error.message });
    }
});

export { productsRouter };
