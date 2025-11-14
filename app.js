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
                
                // --- LÓGICA DEL MENSAJE DE WHATSAPP ---

                // Usamos `|| ''` para evitar errores si un campo está vacío
                const nombreLead = lead.nombre || 'Interesado(a)'; 
                const telefonoLead = (lead.telefono || '').replace(/[\s()-]/g, ''); // Limpia el teléfono

                // 1. Definimos la plantilla del mensaje. Usamos plantillas literales (backticks ``)
                //    para respetar los saltos de línea.
                const mensajeTemplate = `*Lo prometido es deuda..*

¡Hola ${nombreLead}! 👋 ¡Soy Arnel Ospino, encantado de saludarte!

(Te has registrado en un formulario en Facebook y has dejado tu número de WhatsApp para enviarte una guía gratuita)

¡Felicidades por tomar lación de emprender! 🥳 Tal como te prometí, aquí tienes tu Guía Rápida para Iniciar tu Negocio de Postres en Vasos.  

https://drive.google.com/file/d/1n2liWB2Vcqz1BTMUbtf4JUd9rQ8dpjO-/view?usp=drivesdk

Esta guía es 100% gratuita y te dará el plan exacto de 7 días para generar tus primeros ingresos desde casa.  

Mi objetivo es acompañarte en este proceso.  

Tienes alguna experiencia en la elaboración de postres en vasos?`;

                // 2. Codificamos el mensaje para que sea seguro en una URL
                const mensajeCodificado = encodeURIComponent(mensajeTemplate);

                // 3. Creamos el enlace final de WhatsApp
                const whatsappUrl = `https://wa.me/${telefonoLead}?text=${mensajeCodificado}`;

                // --- FIN DE LA LÓGICA ---


                // Creamos la nueva fila con 3 celdas
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${lead.nombre || 'N/A'}</td>
                    <td>${lead.telefono || 'N/A'}</td>
                    <td>
                        <a href="${whatsappUrl}" class="whatsapp-btn" target="_blank">
                            Enviar WhatsApp
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