// Variables globales
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let stock = {
    'iPhone 16 Pro Max': 10,
    'Google Pixel 9': 5,
    'Motorola Moto G Power': 0,
    'Samsung Galaxy A16': 8,
    'Apple iPad Air': 12,
    'Samsung Galaxy Tab S10 Plus': 6,
    'TCL TAB 8': 4,
    'Samsung Galaxy Watch 6': 3,
    'Samsung Galaxy Watch 7': 3,
};

// Mapeo de imágenes
const imagenes = {
    'iPhone 16 Pro Max': './img/telefonos/Apple-iPhone-16-Pro-Max-Black-Titanium-frontimage.webp',
    'Google Pixel 9': './img/telefonos/Google-Pixel-9-Obsidian-frontimage.webp',
    'Motorola Moto G Power': './img/telefonos/Motorola-moto-g-power-5G-2025-Slate-Gray-frontimage.webp',
    'Samsung Galaxy A16': './img/telefonos/Samsung-Galaxy-A16-5G-Blue-Black-frontimage.webp',
    'Apple iPad Air': './img/tablets/Apple-iPad-Air-11-inch-M3-Blue-frontimage.webp',
    'Samsung Galaxy Tab S10 Plus': './img/tablets/Samsung-Galaxy-Tab-S10-Plus-Gray-frontimage.webp',
    'TCL TAB 8': './img/tablets/TCL-TAB-8-LE-Shadow-Gray-frontimage.webp',
    'Samsung Galaxy Watch 6': './img/reloj/Samsung-Galaxy-Watch6-44MM-Graphite-frontimage.webp',
    'Samsung Galaxy Watch 7': './img/reloj/Samsung-Galaxy-Watch7-40MM-Green-frontimage.webp',
};

// Función para actualizar el contador del carrito en el header
function actualizarContadorCarrito() {
    const contador = carrito.reduce((total, item) => total + item.cantidad, 0);
    const qtyElement = document.querySelector('.qty');
    qtyElement.textContent = contador > 0 ? contador : ''; // Muestra el contador o vacío si es 0
}

// Función para agregar productos al carrito
function agregarAlCarrito(nombreProducto, precio) {
    // Verificar si hay stock disponible
    if (stock[nombreProducto] > 0) {
        // Buscar si el producto ya está en el carrito
        const productoEnCarrito = carrito.find(item => item.nombre === nombreProducto);
        
        if (productoEnCarrito) {
            // Si ya está en el carrito, aumentar la cantidad
            if (productoEnCarrito.cantidad < stock[nombreProducto]) {
                productoEnCarrito.cantidad++;
                mostrarMensaje(`Se ha añadido una unidad de ${nombreProducto} al carrito.`);
            } else {
                mostrarError(`No puedes añadir más de ${stock[nombreProducto]} unidades de ${nombreProducto}.`);
            }
        } else {
            // Si no está en el carrito, agregarlo
            carrito.push({ nombre: nombreProducto, precio: precio, cantidad: 1 });
            mostrarMensaje(`${nombreProducto} ha sido añadido al carrito.`);
        }
        
        // Reducir el stock
        stock[nombreProducto]--;
        
        // Guardar el carrito en localStorage
        localStorage.setItem('carrito', JSON.stringify(carrito));
    } else {
        mostrarError(`Lo sentimos, ${nombreProducto} está fuera de stock.`);
    }
}

// Función para mostrar mensajes con SweetAlert2
function mostrarMensaje(mensaje) {
    Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: mensaje,
        confirmButtonText: 'Aceptar'
    });
}

// Función para mostrar errores con SweetAlert2
function mostrarError(mensaje) {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: mensaje,
        confirmButtonText: 'Aceptar'
    });
}

// Función para cargar el carrito en carrito.html
function cargarCarrito() {
    const listaCarrito = document.getElementById('lista-carrito');
    listaCarrito.innerHTML = ''; // Limpiar la lista

    if (carrito.length === 0) {
        listaCarrito.innerHTML = '<tr><td colspan="6">No hay productos en el carrito.</td></tr>';
        return;
    }

    let total = 0;

    carrito.forEach(item => {
        const totalItem = item.precio * item.cantidad;
        total += totalItem;

        listaCarrito.innerHTML += `
            <tr>
                <td><img src="${imagenes[item.nombre]}" alt="${item.nombre}"></td>
                <td>${item.nombre}</td>
                <td>$${item.precio.toFixed(2)}</td>
                <td>
                    <button onclick="disminuirCantidad('${item.nombre}')">-</button>
                    ${item.cantidad}
                    <button onclick="aumentarCantidad('${item.nombre}')">+</button>
                </td>
                <td>$${totalItem.toFixed(2)}</td>
                <td><button class="btn btn-danger" onclick="eliminarDelCarrito('${item.nombre}')">Eliminar</button></td>
            </tr>
        `;
    });

    document.getElementById('total-carrito').innerText = total.toFixed(2);
}

// Función para aumentar la cantidad de un producto
function aumentarCantidad(nombreProducto) {
    const productoEnCarrito = carrito.find(item => item.nombre === nombreProducto);
    if (productoEnCarrito && productoEnCarrito.cantidad < stock[nombreProducto]) {
        productoEnCarrito.cantidad++;
        stock[nombreProducto]--;
        localStorage.setItem('carrito', JSON.stringify(carrito));
        cargarCarrito(); // Recargar el carrito
    } else {
        mostrarError(`No puedes añadir más de ${stock[nombreProducto]} unidades de ${nombreProducto}.`);
    }
}

// Función para disminuir la cantidad de un producto
function disminuirCantidad(nombreProducto) {
    const productoEnCarrito = carrito.find(item => item.nombre === nombreProducto);
    if (productoEnCarrito && productoEnCarrito.cantidad > 1) {
        productoEnCarrito.cantidad--;
        stock[nombreProducto]++;
        localStorage.setItem('carrito', JSON.stringify(carrito));
        cargarCarrito(); // Recargar el carrito
    } else if (productoEnCarrito && productoEnCarrito.cantidad === 1) {
        eliminarDelCarrito(nombreProducto); // Eliminar si la cantidad es 1
    }
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(nombreProducto) {
    carrito = carrito.filter(item => item.nombre !== nombreProducto);
    mostrarMensaje(`${nombreProducto} ha sido eliminado del carrito.`);
    localStorage.setItem('carrito', JSON.stringify(carrito)); // Actualizar localStorage
    cargarCarrito(); // Recargar el carrito
}

// Función para finalizar la compra
function finalizarCompra() {
    if (carrito.length === 0) {
        mostrarError('No hay productos en el carrito para finalizar la compra.');
        return;
    }

    // Calcular el total
    let total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

    // Mostrar el total en una ventana emergente
    Swal.fire({
        icon: 'success',
        title: 'Compra Finalizada',
        text: `Gracias por tu compra. El total a pagar es: $${total.toFixed(2)}`,
        confirmButtonText: 'Aceptar'
    });

    // Limpiar el carrito y el localStorage
    carrito = [];
    localStorage.setItem('carrito', JSON.stringify(carrito));
    cargarCarrito(); // Recargar el carrito
}

// Cargar el carrito al iniciar la página
document.addEventListener('DOMContentLoaded', cargarCarrito);



document.addEventListener('DOMContentLoaded', function () {
    const registroForm = document.getElementById('registroForm');

    if (registroForm) {
        registroForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Evita que la página se recargue

            const usuario = document.getElementById('usuario').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const repeatPassword = document.getElementById('repeat_password').value;

            // Expresión regular para validar la contraseña (mínimo 8 caracteres, al menos 1 mayúscula y 1 número)
            const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

            // Validaciones
            if (usuario === "" || email === "" || password === "" || repeatPassword === "") {
                Swal.fire('Error', 'Todos los campos son obligatorios.', 'error');
                return;
            }

            if (!passwordRegex.test(password)) {
                Swal.fire('Error', 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un número.', 'error');
                return;
            }

            if (password !== repeatPassword) {
                Swal.fire('Error', 'Las contraseñas no coinciden.', 'error');
                return;
            }

            // Guardar los datos en localStorage
            const userData = { usuario, email, password };
            localStorage.setItem('userData', JSON.stringify(userData));

            Swal.fire({
                title: 'Registro exitoso',
                text: 'Tu cuenta ha sido creada correctamente.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                window.location.href = 'login.html'; // Redirigir al login después del registro
            });
        });
    }
});



document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Evita que la página se recargue

            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;

            // Obtener los datos del usuario desde localStorage
            const userData = JSON.parse(localStorage.getItem('userData'));

            if (!userData) {
                Swal.fire('Error', 'No hay cuentas registradas. Crea una cuenta primero.', 'error');
                return;
            }

            // Verificar si el email y contraseña coinciden
            if (userData.email !== email || userData.password !== password) {
                Swal.fire('Error', 'Correo o contraseña incorrectos.', 'error');
                return;
            }

            // Guardar estado de sesión en localStorage
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', userData.email);

            Swal.fire({
                title: 'Inicio de sesión exitoso',
                text: 'Bienvenido a TechSmart',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                window.location.href = 'index.html'; // Redirigir al inicio
            });
        });
    }
});
