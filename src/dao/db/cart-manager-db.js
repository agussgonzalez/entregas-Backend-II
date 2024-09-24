import mongoose from 'mongoose';
import CartModel from "../models/cart.model.js";
import ProductModel from "../models/product.model.js";

export class CartManager {

    // Obtener todos los carritos
    getCarts = async () => {
        try {
            const carts = await CartModel.find();
            return carts;
        } catch (error) {
            console.error('Error al obtener los carritos:', error);
            throw new Error('Error al obtener los carritos: ' + error.message);
        }
    }

    // Obtener productos de un carrito específico por ID
    getCartProducts = async (cartId) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(cartId)) {
                throw new Error('ID de carrito no válido');
            }

            const cart = await CartModel.findById(cartId).populate('products.product');
            if (cart) {
                return cart.products;
            } else {
                throw new Error('Carrito no encontrado');
            }
        } catch (error) {
            console.error('Error al obtener productos del carrito:', error);
            throw new Error('Error al obtener productos del carrito: ' + error.message);
        }
    }

    // Crear un nuevo carrito
    newCart = async () => {
        try {
            const newCart = new CartModel({ products: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            console.error('Error al crear el carrito:', error);
            throw new Error('Error al crear el carrito: ' + error.message);
        }
    }

    // Obtener un carrito por ID
    getCartById = async (cartId) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(cartId)) {
                throw new Error('ID de carrito no válido');
            }

            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error("No existe un carrito con ese ID");
            }
            return cart;
        } catch (error) {
            console.error('Error al obtener el carrito por ID:', error);
            throw new Error('Error al obtener el carrito por ID: ' + error.message);
        }
    }

    // Agregar un producto al carrito
    // _addProductToCart = async (cartId, productId) => {
    //     try {
    //         if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) {
    //             throw new Error('ID de carrito o producto no válido');
    //         }

    //         const cart = await CartModel.findById(cartId);
    //         if (!cart) {
    //             throw new Error("Carrito no encontrado");
    //         }

    //         const product = await ProductModel.findById(productId);
    //         if (!product) {
    //             throw new Error("Producto no encontrado");
    //         }

    //         if (!Array.isArray(cart.products)) {
    //             throw new Error("El carrito tiene una estructura inesperada");
    //         }

    //         const existingProductIndex = cart.products.findIndex(product => product.toString() === productId.toString());
    //         if (existingProductIndex !== -1) {
    //             // Si el producto ya existe, incrementa la cantidad
    //             cart.products[existingProductIndex].quantity += 1;
    //         } else {
    //             // Si el producto no existe, agrégalo con cantidad 1
    //             cart.products.push({ product: productId, quantity: 1 });
    //         }
    //         console.log('Carrito antes de guardar:', cart);

    //         await cart.save(); // Guarda el carrito actualizado en la base de datos
    //         console.log("Producto agregado con éxito");
    //     } catch (error) {
    //         console.error('Error al intentar agregar producto al carrito:', error);
    //         throw new Error('Error al intentar agregar producto al carrito: ' + error.message);
    //     }
    // }

    _addProductToCart = async (cartId, productId) => {
        try {
            // Validar los IDs del carrito y del producto
            if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) {
                throw new Error('ID de carrito o producto no válido');
            }
    
            // Buscar el carrito
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }
    
            // Buscar el producto
            const product = await ProductModel.findById(productId);
            if (!product) {
                throw new Error("Producto no encontrado");
            }
    
            // Buscar si el producto ya está en el carrito
            const existingProductIndex = cart.products.findIndex(p => p.product.toString() === productId.toString());
    
            if (existingProductIndex !== -1) {
                // Si el producto ya está en el carrito, actualizar la cantidad
                cart.products[existingProductIndex].quantity += 1;
            } else {
                // Si el producto no está en el carrito, agregarlo con cantidad inicial de 1
                cart.products.push({ product: productId, quantity: 1 });
            }
    
            // Guardar los cambios en el carrito
            await cart.save();
            console.log("Producto agregado con éxito");
        } catch (error) {
            console.error('Error al intentar agregar producto al carrito:', error);
            // Lanzar error para que la capa superior lo maneje
            throw new Error('Error al intentar agregar producto al carrito: ' + error.message);
        }
    };
    
    

    // Eliminar un producto del carrito
    removeProductFromCart = async (cartId, productId) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) {
                throw new Error('ID de carrito o producto no válido');
            }

            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }

            const productIndex = cart.products.findIndex(product => product.product.toString() === productId.toString());
            if (productIndex !== -1) {
                cart.products.splice(productIndex, 1); // Elimina el producto del carrito
                await cart.save(); // Guarda el carrito actualizado en la base de datos
                console.log("Producto eliminado con éxito");
            } else {
                throw new Error("Producto no encontrado en el carrito");
            }
        } catch (error) {
            console.error('Error al intentar eliminar producto del carrito:', error);
            throw new Error('Error al intentar eliminar producto del carrito: ' + error.message);
        }
    }
}
