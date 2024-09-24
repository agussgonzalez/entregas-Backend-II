const form = document.getElementById('productForm');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const price = parseFloat(document.getElementById('price').value);
    const category = document.getElementById('category').value;
    const stock = parseInt(document.getElementById('stock').value);
    const thumbnails = document.getElementById('thumbnails').value.split(',');

    const product = {
        title,
        description,
        price,
        category,
        stock,
        thumbnails
    };

    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });

        const responseData = await response.json();

        if (response.ok) {
            alert('Producto agregado exitosamente');
            form.reset();
        } else {
            alert(`Error al agregar el producto: ${responseData.message || 'Error desconocido'}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error en la solicitud');
    }
});
