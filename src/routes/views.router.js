import express from "express";
import { Router } from "express";
const router = express.Router();
import { ProductManager } from "../dao/db/product-manager-db.js";
const manager = new ProductManager();
import { CartManager } from "../dao/db/cart-manager-db.js";
const cartManager = new CartManager();

router.get("/products", async (req, res) => {
    try {
        // Obtener parámetros de consulta, proporcionando valores predeterminados si no se especifican
        const limit = parseInt(req.query.limit) || 9; // Número de productos por página
        const page = parseInt(req.query.page) || 1; // Página actual
        const skip = (page - 1) * limit; // Número de productos a omitir
        const sortOrder = req.query.sortOrder || null; // Orden de los productos
        const filter = req.query.filter || {}; // Filtros aplicados

        const username = req.session.username; // Obtén el nombre del usuario
    req.session.username = null; // Limpia la sesión para no mostrar el mensaje de nuevo

        // Obtener los productos con paginación
        const productos = await manager.getProducts({
            limit,
            skip,
            sortOrder,
            filter
        });

        // Contar el total de productos para calcular el número total de páginas
        const totalProducts = await manager.countProducts(filter);
        const totalPages = Math.ceil(totalProducts / limit);

        // Determinar las páginas previa y siguiente
        const prevPage = page > 1 ? page - 1 : null;
        const nextPage = page < totalPages ? page + 1 : null;

        // Renderizar la vista con los datos necesarios
        res.render("home", {
            username,
            productos,
            prevPage,
            nextPage,
            sort: sortOrder,
            page,
            totalPages
        });
    } catch (error) {
        res.status(500).send('Error al obtener productos: ' + error.message);
    }
});


router.get("/products/:pid", async (req, res) => {
    const id = req.params.pid;
    try {
        const producto = await manager.getProductById(id);
        if (!producto) {
            res.status(404).send("Producto no encontrado");
        } else {
            res.render("productDetails", { product: producto });
        }
    } catch (error) {
        res.status(500).send('Error al obtener producto por ID: ' + error.message);
    }
});

router.get("/carts/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartManager.getCartById(cid);
        res.render("cartDetails", { cart, cid });
    } catch (error) {
        res.status(500).send("Error al obtener el carrito");
    }
});

router.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts");
});

router.get('/products/add', (req, res) => {
    res.render('addProduct');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

export { router as viewsRouter };
