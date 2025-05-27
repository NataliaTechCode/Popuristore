// app.js
import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// Referencias
const form = document.getElementById("form-producto");
const formCategoria = document.getElementById("form-categoria");
const contenedor = document.getElementById("contenedor-productos");
const buscador = document.getElementById("buscador");
const filtroCategoria = document.getElementById("filtro-categoria");
const selectCategoriaForm = document.getElementById("categoria");

let editandoId = null; // ID del producto en edición

// Enviar formulario de productos
form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const precio = parseFloat(document.getElementById("precio").value);
  const categoria = document.getElementById("categoria").value;
  const imagen = document.getElementById("imagen").value;
  const descripcion = document.getElementById("descripcion").value;

  const productoData = {
    nombre,
    precio,
    categoria,
    imagen,
    descripcion,
    creadoEn: new Date(),
  };

  try {
    if (editandoId) {
      const productoRef = doc(db, "productos", editandoId);
      await updateDoc(productoRef, productoData);
      alert("Producto actualizado ✅");
      editandoId = null;
    } else {
      await addDoc(collection(db, "productos"), productoData);
      alert("Producto guardado ✅");
    }

    form.reset();
  } catch (error) {
    console.error("Error al guardar: ", error);
  }
});

// Enviar formulario de categoría
formCategoria?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombreCategoria = document
    .getElementById("nueva-categoria")
    .value.trim();

  if (!nombreCategoria) return;

  try {
    await addDoc(collection(db, "categorias"), { nombre: nombreCategoria });
    alert("Categoría guardada ✅");
    formCategoria.reset();
  } catch (error) {
    console.error("Error al guardar categoría:", error);
  }
});

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

// Renderizar productos
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
  filtrados.forEach((p) => {
    contenedor.innerHTML += `
      <div class="product-card">
        <img src="${p.imagen}" alt="${p.nombre}" width="150" />
        <h3>${p.nombre}</h3>
        <p>Precio: ${p.precio} Bs</p>
        <p>Categoría: ${p.categoria}</p>
        <p>${p.descripcion || ""}</p>
        <button class="boton" onclick="editarProducto('${p.id}', '${
      p.nombre
    }', ${p.precio}, '${p.categoria}', '${p.imagen}', \`${
      p.descripcion || ""
    }\`)">Editar</button>
        <button class="boton" onclick="eliminarProducto('${
          p.id
        }')">Eliminar</button>
      </div>
    `;
  });
}

// Cargar categorías dinámicamente
function cargarCategorias() {
  const categoriasRef = collection(db, "categorias");

  onSnapshot(categoriasRef, (snapshot) => {
    filtroCategoria.innerHTML = `<option value="todas">Todas las categorías</option>`;
    if (selectCategoriaForm) {
      selectCategoriaForm.innerHTML = `<option value="">Seleccione una categoría</option>`;
    }

    snapshot.forEach((doc) => {
      const nombreCat = doc.data().nombre;

      const optionFiltro = document.createElement("option");
      optionFiltro.value = nombreCat;
      optionFiltro.textContent = nombreCat;
      filtroCategoria.appendChild(optionFiltro);

      if (selectCategoriaForm) {
        const optionForm = document.createElement("option");
        optionForm.value = nombreCat;
        optionForm.textContent = nombreCat;
        selectCategoriaForm.appendChild(optionForm);
      }
    });
  });
}

// Eliminar producto
window.eliminarProducto = async (id) => {
  if (confirm("¿Seguro que quieres eliminar este producto?")) {
    try {
      await deleteDoc(doc(db, "productos", id));
      alert("Producto eliminado ✅");
    } catch (error) {
      console.error("Error al eliminar: ", error);
    }
  }
};

// Editar producto
window.editarProducto = (
  id,
  nombre,
  precio,
  categoria,
  imagen,
  descripcion
) => {
  document.getElementById("nombre").value = nombre;
  document.getElementById("precio").value = precio;
  document.getElementById("categoria").value = categoria;
  document.getElementById("imagen").value = imagen;
  document.getElementById("descripcion").value = descripcion;

  editandoId = id;
  alert("Editando producto. Guarda los cambios para actualizar.");
};

// Escuchar filtros
buscador?.addEventListener("input", mostrarProductos);
filtroCategoria?.addEventListener("change", mostrarProductos);

// Ejecutar funciones al cargar
mostrarProductos();
cargarCategorias();
