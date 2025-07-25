
    const seleccionados = [];

    function agregarProducto(nombre, precio) {
      const existente = seleccionados.find(p => p.nombre === nombre);
      if (existente) {
        existente.cantidad += 1;
      } else {
        seleccionados.push({ nombre, precio, cantidad: 1 });
      }
      actualizarLista();
    }

    function eliminarProducto(index) {
      seleccionados.splice(index, 1);
      actualizarLista();
    }

    function restarProducto(index) {
      if (seleccionados[index].cantidad > 1) {
        seleccionados[index].cantidad -= 1;
      } else {
        seleccionados.splice(index, 1);
      }
      actualizarLista();
    }

    function sumarProducto(index) {
      seleccionados[index].cantidad += 1;
      actualizarLista();
    }

    function actualizarLista() {
      const ul = document.getElementById("listaSeleccionados");
      const totalEl = document.getElementById("totalGeneral");
      ul.innerHTML = "";

      let total = 0;

      seleccionados.forEach((prod, index) => {
        const subtotal = prod.precio * prod.cantidad;
        total += subtotal;

        const li = document.createElement("li");
        li.innerHTML = `
          ${prod.nombre} x${prod.cantidad} - $${subtotal}
          <button onclick="restarProducto(${index})">−</button>
          <button onclick="sumarProducto(${index})" id="suma">+</button>
          <button onclick="eliminarProducto(${index})">Quitar</button>
        `;
        ul.appendChild(li);
      });

      totalEl.textContent = `Total: $${total}`;
      actualizarLinkWhatsapp();
    }

    function actualizarLinkWhatsapp() {
      let mensaje = "¡Hola, me gustaría realizar el siguiente encargue!%0A";
      let total = 0;

      seleccionados.forEach(prod => {
        const subtotal = prod.precio * prod.cantidad;
        total += subtotal;
        mensaje += `${prod.nombre} x${prod.cantidad} - $${subtotal}%0A`;
      });

      let totalConDescuento = total;
      if (descuento > 0) {
        totalConDescuento = Math.round(total * (1 - descuento));
        mensaje += `%0ADescuento aplicado (${Math.round(descuento * 100)}%): $-${total - totalConDescuento}%0A`;
        mensaje += `Total final: $${totalConDescuento}`;
      } else {
        mensaje += `%0ATotal: $${total}`;
      }
      const whatsappLink = document.getElementById("whatsappLink");
      whatsappLink.href = `https://wa.me/542323354483?text=${mensaje}`;

/*       const lista = seleccionados.map((p, i) => `%0A${i + 1}. ${p.nombre} x${p.cantidad} - $${p.precio * p.cantidad}`).join("");
      const total = seleccionados.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
      const mensaje = mensajeBase + lista + `%0A%0AMuchas gracias!`;
      const numero = "542323354483";
      const url = `https://wa.me/${numero}?text=${mensaje}`;
      document.getElementById("whatsappLink").href = url; */
    }
    
    let descuento = 0;

    function aplicarDescuento() {
    const codigo = document.getElementById('codigoDescuento').value.trim().toLowerCase();
    const mensaje = document.getElementById('mensajeDescuento');
    if (codigo === '40minutos' || codigo === 'patergym') {
      descuento = 0.10;
      mensaje.textContent = '¡Descuento aplicado!';
      mensaje.style.color = 'green';
    } else {
      descuento = 0;
      mensaje.textContent = 'Código inválido';
      mensaje.style.color = 'red';
    }
    actualizarLista();
  }

  function actualizarLista() {
    const ul = document.getElementById("listaSeleccionados");
    const totalEl = document.getElementById("totalGeneral");
    ul.innerHTML = "";

    let total = 0;

    seleccionados.forEach((prod, index) => {
      const subtotal = prod.precio * prod.cantidad;
      total += subtotal;

      const li = document.createElement("li");
      li.innerHTML = `
        ${prod.nombre} x${prod.cantidad} - $${subtotal}
        <button onclick="restarProducto(${index})">−</button>
        <button onclick="sumarProducto(${index})" id="suma">+</button>
        <button onclick="eliminarProducto(${index})">Quitar</button>
      `;
      ul.appendChild(li);
    });

    let totalConDescuento = total;
    if (descuento > 0) {
      totalConDescuento = Math.round(total * (1 - descuento));
      totalEl.textContent = `Total: $${totalConDescuento} (descuento aplicado)`;
    } else {
      totalEl.textContent = `Total: $${total}`;
    }
    actualizarLinkWhatsapp();
  }