document.addEventListener("DOMContentLoaded", () => {
  fetch("productos.json")
    .then((response) => response.json())
    .then((products) => {
      const productContainer = document.getElementById("product-container");
      const cartItems = document.getElementById("cart-items");
      const totalPriceElement = document.getElementById("total-price");
      let cart = [];

      function updateCart() {
        cartItems.innerHTML = "";
        let total = 0;

        cart.forEach((item) => {
          const cartItem = document.createElement("div");
          cartItem.classList.add("cart-item");
          cartItem.innerHTML = `
                      <p>${item.name} - $${item.price} x ${item.quantity}</p>
                  `;
          cartItems.appendChild(cartItem);
          total += item.price * item.quantity; // Suma el precio total del producto al total general
        });

        totalPriceElement.textContent = `$${total.toFixed(2)}`; // Actualiza el total en el DOM
      }

      products.forEach((product) => {
        const card = document.createElement("div");
        card.classList.add("product-card", "card", "mb-4", "col-md-4");

        const image = document.createElement("img");
        image.src = product.image;
        image.classList.add("card-img-top");
        card.appendChild(image);

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        const title = document.createElement("h5");
        title.classList.add("card-title");
        title.textContent = product.name;
        cardBody.appendChild(title);

        const price = document.createElement("p");
        price.classList.add("card-text");
        price.textContent = `$${product.price}`;
        cardBody.appendChild(price);

        const quantityLabel = document.createElement("label");
        quantityLabel.textContent = "Cantidad:";
        quantityLabel.setAttribute("for", "quantity-" + product.name);
        cardBody.appendChild(quantityLabel);

        const quantityInput = document.createElement("input");
        quantityInput.type = "number";
        quantityInput.id = "quantity-" + product.name;
        quantityInput.classList.add("form-control", "mb-2");
        quantityInput.value = 1;
        quantityInput.min = 1;
        cardBody.appendChild(quantityInput);

        const addButton = document.createElement("button");
        addButton.textContent = "Agregar al carrito";
        addButton.classList.add("btn", "btn-success", "add-to-cart-btn");
        addButton.onclick = () => {
          const quantity = parseInt(quantityInput.value);
          const existingItem = cart.find((item) => item.name === product.name);
          if (existingItem) {
            existingItem.quantity += quantity;
          } else {
            cart.push({ ...product, quantity: quantity });
          }
          updateCart(); // Aqui actualiza el carrito y el total cuando se agrega un producto
        };
        cardBody.appendChild(addButton);

        card.appendChild(cardBody);
        productContainer.appendChild(card);
      });

      document.getElementById("clear-cart-btn").onclick = () => {
        cart = [];
        updateCart(); // Se vacía el carrito y se actualiza el total
      };

      document.getElementById("pay-btn").onclick = () => {
        const total = parseFloat(
          totalPriceElement.textContent.replace("$", "")
        );
        if (total > 0) {
          window.location.href = `pago.html?total=${total}`;
        } else {
          alert("El carrito está vacío");
        }
      };
    })
    .catch((error) => console.error("Error al cargar los productos:", error));
});
