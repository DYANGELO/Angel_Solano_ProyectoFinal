const API_URL = "http://localhost:8080/api";

// Login
if (document.getElementById("loginForm")) {
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(`${API_URL}/sessions/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        window.location.href = "/products.html"; // Redirigir a productos
      } else {
        alert(data.message || "Error al iniciar sesión");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión");
    }
  });
}

// Cargar productos
if (document.getElementById("products")) {
  async function loadProducts() {
    try {
      const response = await fetch(`${API_URL}/products`);
      const products = await response.json();
      const productsDiv = document.getElementById("products");
      productsDiv.innerHTML = products.map(p => `
        <div class="product">
          <h3>${p.name}</h3>
          <p>Precio: $${p.price}</p>
          <button onclick="addToCart('${p._id}')">Agregar al Carrito</button>
        </div>
      `).join("");
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  }

  loadProducts();
}

// Agregar producto al carrito
window.addToCart = async (productId) => {
  try {
    const response = await fetch(`${API_URL}/carts/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
      credentials: "include",
    });

    const data = await response.json();
    if (response.ok) {
      alert("Producto agregado al carrito");
    } else {
      alert(data.message || "Error al agregar al carrito");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error de conexión");
  }
};

// Cargar carrito
if (document.getElementById("cart")) {
  async function loadCart() {
    try {
      const response = await fetch(`${API_URL}/carts`, {
        credentials: "include",
      });

      const cart = await response.json();
      const cartDiv = document.getElementById("cart");
      cartDiv.innerHTML = cart.products.map(p => `
        <div class="cart-item">
          <h3>${p.product.name}</h3>
          <p>Cantidad: ${p.quantity}</p>
          <p>Precio: $${p.product.price}</p>
        </div>
      `).join("");
    } catch (error) {
      console.error("Error al cargar carrito:", error);
    }
  }

  loadCart();
}

// Finalizar compra
if (document.getElementById("checkout")) {
  document.getElementById("checkout").addEventListener("click", async () => {
    try {
      const response = await fetch(`${API_URL}/carts/purchase`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        alert(`Compra finalizada. Ticket: ${data.ticket.code}`);
        window.location.href = "/products.html";
      } else {
        alert(data.message || "Error al finalizar compra");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión");
    }
  });
}