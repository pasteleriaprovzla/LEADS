// 1. Configuración del cliente de Supabase
const SUPABASE_URL = 'https://lzeulzoztkpljvqjdxak.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6ZXVsem96dGtwbGp2cWpkeGFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMzMwODIsImV4cCI6MjA3ODcwOTA4Mn0.y_6SZFMPiOBqzxa_jgrhBDMyfQbEELdwnqd0QKJjA6M';

// 2. Inicializar el cliente
const { createClient } = window.supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 3. Obtener la referencia al cuerpo de la tabla en el HTML
const tableBody = document.getElementById('leads-table-body');

// 4. Función asíncrona para obtener y mostrar los datos
async function fetchLeads() {
    try {
        // Consultamos la tabla 'leads' y seleccionamos 'nombre' y 'telefono'
        const { data, error } = await _supabase
            .from('leads')
            .select('nombre, telefono');

        if (error) {
            console.error('Error al obtener los datos:', error);
            // Actualizamos colspan a 3
            tableBody.innerHTML = `<tr><td colspan="3">Error: ${error.message}</td></tr>`;
            return;
        }

        if (data && data.length > 0) {
            // Limpiamos el mensaje de "Cargando..."
            tableBody.innerHTML = '';

            // Recorremos los datos y creamos una fila (tr) por cada lead
            data.forEach(lead => {
                
                // Usamos `|| ''` para evitar errores si un campo está vacío
                const nombreLead = lead.nombre || 'Interesado(a)'; 
                const telefonoLead = (lead.telefono || '').replace(/[\s()-]/g, ''); // Limpia el teléfono

                // --- LÓGICA DEL MENSAJE DE WHATSAPP (BOTÓN 1) ---

                // 1. Definimos la plantilla del mensaje.
                const mensajeTemplate = `*Lo prometido es deuda..*

¡Hola ${nombreLead}! 👋😊✨
( _Has dejado tus datos de contacto en un formulario en facebook o Instagram ya que es necesario para enviarte la guía que te ayudará a crear tus postres en vasos_ )

Lo mejor es que no necesitas horno, ni batidora, ni fórmulas difíciles.
Es un negocio ligero: batir, armar y refrigerar.
Así de simple.

Y la guía gratuita te va a ayudar a crear tus primeros postres y empezar a venderlos en pocos días. *Es una gran herramienta si realmente quieres intentarlo y darle un cambio bonito a tu economía* 🙌✨

Antes de enviártela quiero hacerte una preguntita importante:
*¿Te comprometes a seguir los pasos de la guía tal como están explicados?*
Es un proceso sencillo, pero requiere que pongas un poquito de tu parte 💛

Y otra cosa amiga:
*¿Estás consciente de que necesitarás comprar algunos ingredientes básicos para poder hacer los postres del reto de 7 días?*

No es una inversión grande, pero sí es necesaria para que puedas poner en práctica todo.

_Cuando me confirmes eso, te envío la guía con mucho gusto_ ❤️✨`;

                // 2. Codificamos el mensaje para que sea seguro en una URL
                const mensajeCodificado = encodeURIComponent(mensajeTemplate);

                // 3. Creamos el enlace final de WhatsApp
                const whatsappUrl = `https://wa.me/${telefonoLead}?text=${mensajeCodificado}`;

                
                // --- NUEVA LÓGICA DEL MENSAJE DE SEGUIMIENTO (BOTÓN 2) ---

                // 1. Definimos la plantilla del mensaje de seguimiento
                const mensajeTemplateSeguimiento = `Hola ${nombreLead} 👋 pudo descargar la guia? Que le parecio? si tiene algun problema con el el link puedes decirme estoy aqui para ayudarle 😁 o alguna otra pregunta hagamelo saber 😉`;

                // 2. Codificamos el mensaje de seguimiento
                const mensajeCodificadoSeguimiento = encodeURIComponent(mensajeTemplateSeguimiento);

                // 3. Creamos el enlace final de WhatsApp (BOTÓN 2)
                const whatsappUrlSeguimiento = `https://wa.me/${telefonoLead}?text=${mensajeCodificadoSeguimiento}`;

                // --- FIN DE LA LÓGICA ---


                // Creamos la nueva fila con 3 celdas (actualizamos la última celda)
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${lead.nombre || 'N/A'}</td>
                    <td>${lead.telefono || 'N/A'}</td>
                    <td>
                        <a href="${whatsappUrl}" class="whatsapp-btn" target="_blank">
                            Enviar Guía
                        </a>
                        <a href="${whatsappUrlSeguimiento}" class="whatsapp-btn-followup" target="_blank">
                            Seguimiento
                        </a>
                    </td>
                `;
                tableBody.appendChild(row);
            });

        } else {
            // No se encontraron datos (actualizamos colspan a 3)
            tableBody.innerHTML = '<tr><td colspan="3">No se encontraron leads.</td></tr>';
        }

    } catch (err) {
        console.error('Error inesperado:', err);
        tableBody.innerHTML = `<tr><td colspan="3">Ocurrió un error inesperado.</td></tr>`;
    }
}

// 5. Llamar a la función cuando se cargue la página
fetchLeads();

