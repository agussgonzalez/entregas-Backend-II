console.log("Esto está funcionando");

const socket = io();

socket.on("productos", (data) => {
    renderProductos(data);
});

const renderProductos = (productos) => {
    console.log("Productos recibidos:", productos);
    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.innerHTML = "";

    productos.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <p>${item._id}</p>
            <img src="${item.thumbnails[0]}" alt="Imagen del producto" class="image"/>
            <p>${item.title}</p>
            <p>$${item.price}</p>
            <button class="button add-to-cart" data-id="${item._id}">Agregar al carrito</button>
            <button class="button delete-product" data-id="${item._id}">❌</button>
            <div class="cart-button">
    <a href="/carts/66c55c66b5969a064c52a69c" class="buttonCard">🛒</a>
</div>
        `;

        contenedorProductos.appendChild(card);

        card.querySelector(".delete-product").addEventListener("click", () => {
            eliminarProducto(item._id);
        });

        card.querySelector(".add-to-cart").addEventListener("click", (event) => {
            const id = event.target.getAttribute("data-id");
            agregarAlCarrito(id);
        });
    });
};

const eliminarProducto = (id) => {
    socket.emit("eliminarProducto", id);
};

const agregarAlCarrito = (id) => {
    if (id) {
        fetch(`/api/carts/66c55c66b5969a064c52a69c/products/${id}`, { method: 'POST' }) // Cambia '1' por el ID del carrito del usuario si es necesario
            .then(response => response.text())
            .then(data => {
                console.log('Producto agregado al carrito:', data);
            })
            .catch(error => {
                console.error('Error al agregar al carrito:', error);
            });
    } else {
        console.error('ID no proporcionado para agregar al carrito');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.getAttribute('data-id');
            const cartId = 'your-cart-id'; // Aquí puedes definir o recuperar dinámicamente el ID del carrito

            try {
                await fetch(`/api/carts/${cartId}/products/${productId}`, {
                    method: 'POST'
                });
                alert('Producto agregado al carrito');
            } catch (error) {
                console.error('Error al agregar producto al carrito:', error);
            }
        });
    });
});


