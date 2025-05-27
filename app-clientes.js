// app-clientes.js
import { db } from "./firebase-config.js";
import {
  collection,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// Referencias
const contenedor = document.getElementById("contenedor-productos");
const buscador = document.getElementById("buscador");
const filtroCategoria = document.getElementById("filtro-categoria");

// Mostrar productos
function mostrarProductos() {
  const productosRef = collection(db, "productos");

  onSnapshot(productosRef, (snapshot) => {
    const productos = [];
    snapshot.forEach((doc) => {
      productos.push({ ...doc.data(), id: doc.id });
    });

    renderizarProductos(productos);
  });
}

// Renderizar productos (solo visualización) - MEJORADO
function renderizarProductos(productos) {
  const textoBuscado = buscador?.value.toLowerCase() || "";
  const categoriaSeleccionada = filtroCategoria?.value || "todas";

  const filtrados = productos.filter((p) => {
    const coincideNombre = p.nombre.toLowerCase().includes(textoBuscado);
    const coincideCategoria =
      categoriaSeleccionada === "todas" ||
      p.categoria === categoriaSeleccionada;
    return coincideNombre && coincideCategoria;
  });

  contenedor.innerHTML = "";

  if (filtrados.length === 0) {
    contenedor.innerHTML = `
      <div class="empty-state">
        <span class="icon">🛍️</span>
        <p>No se encontraron productos</p>
      </div>
    `;
    return;
  }

  filtrados.forEach((p) => {
    contenedor.innerHTML += `
      <div class="product-card">
        <div class="product-image-container">
          <img src="${
            p.imagen || "https://via.placeholder.com/300x200?text=Sin+Imagen"
          }" 
               alt="${p.nombre}" 
               onerror="this.src='https://via.placeholder.com/300x200?text=Sin+Imagen'" />
        </div>
        <h3 class="product-name">${p.nombre}</h3>
        <p class="product-price">${p.precio} Bs</p>
        <div class="product-category">${p.categoria}</div>
        <p class="product-description">${
          p.descripcion || "Sin descripción disponible"
        }</p>
      </div>
    `;
  });
}

// Cargar categorías dinámicamente
function cargarCategorias() {
  const categoriasRef = collection(db, "categorias");

  onSnapshot(categoriasRef, (snapshot) => {
    filtroCategoria.innerHTML = `<option value="todas">Todas las categorías</option>`;

    snapshot.forEach((doc) => {
      const nombreCat = doc.data().nombre;

      const optionFiltro = document.createElement("option");
      optionFiltro.value = nombreCat;
      optionFiltro.textContent = nombreCat;
      filtroCategoria.appendChild(optionFiltro);
    });
  });
}

// Escuchar cambios
buscador?.addEventListener("input", mostrarProductos);
filtroCategoria?.addEventListener("change", mostrarProductos);

// Ejecutar
mostrarProductos();
cargarCategorias();
