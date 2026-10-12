// CARRUSEL

// Busca todos los carruseles de proyectos (hay uno por tarjeta)
document.querySelectorAll('.proyecto-preview').forEach((carrusel) => {

  // El contador y las imágenes de ESTE carrusel
  const contador = carrusel.querySelector('.proyecto-contador');
  const total = carrusel.querySelectorAll('.carousel-item').length;

  // Convierte 1 en "01", 4 en "04", etc.
  const formato = (numero) => String(numero).padStart(2, '0');

  // Estado inicial: "01 / 04"
  contador.textContent = `${formato(1)} / ${formato(total)}`;

  // Bootstrap dispara este evento cada vez que empieza a cambiar de imagen.
  // evento.to es la posición de la imagen que viene (empieza en 0, por eso + 1)
  carrusel.addEventListener('slide.bs.carousel', (evento) => {
    contador.textContent = `${formato(evento.to + 1)} / ${formato(total)}`;
  });
});

// FORMULARIO DE CONTACTO

// Muestra un mensaje y le pone la clase del tipo: 'enviando', 'exito' o 'error'
function mostrarEstado(texto, tipo) {
  estado.textContent = texto;
  estado.className = 'form-estado ' + tipo;
}

const form = document.getElementById('formContacto');
const estado = document.getElementById('formEstado');
const boton = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (evento) => {
  // Evita que la página se recargue al enviar
  evento.preventDefault();

  // Si el campo trampa tiene algo, es un bot: no se hace nada
  if (form.elements['_gotcha'].value) return;

  // Validaciones del navegador (campos vacíos, email inválido, largos)
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Validación extra: que no sean solo espacios en blanco
  const nombre = form.elements['nombre'].value.trim();
  const mensaje = form.elements['mensaje'].value.trim();
  if (nombre.length < 2 || mensaje.length < 10) {
    mostrarEstado('Revisá el nombre y el mensaje: parecen estar vacíos o muy cortos.', 'error');
    return;
  }

  // Bloquear el botón para que no se envíe dos veces
  boton.disabled = true;
  // Al empezar a enviar
  mostrarEstado('Enviando...', 'enviando');

  try {
    // Enviar los datos a Formspree
    const respuesta = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    });

    if (respuesta.ok) {
      mostrarEstado('¡Mensaje enviado! Te responderé a la brevedad.', 'exito');
      form.reset(); // Limpia los campos
    } else {
      throw new Error('Respuesta con error');
    }
  } catch (error) {
    mostrarEstado('No se pudo enviar el mensaje. Probá de nuevo en unos minutos.', 'error');
  } finally {
    // Pase lo que pase se vuelve a habilitar el botón
    boton.disabled = false;
  }
});