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
        const { data, error } = await _supabase
            .from('leads')
            .select('nombre, telefono');

        if (error) {
            console.error('Error al obtener los datos:', error);
            tableBody.innerHTML = `<tr><td colspan="3">Error: ${error.message}</td></tr>`;
            return;
        }

        if (data && data.length > 0) {
            tableBody.innerHTML = '';

            data.forEach(lead => {
                const nombreLead = lead.nombre || 'Interesado(a)';
                const telefonoLead = (lead.telefono || '').replace(/[\s()-]/g, '');

                // ========= MENSAJE OPTIMIZADO DE ENVÍO =========

                const mensajeTemplate = `*Lo prometido es deuda…*

¡Hola ${nombreLead}! 👋😄  
Vi que dejaste tus datos para recibir la *Guía Rápida para iniciar tu negocio de postres en vasos*, ¡excelente decisión!

Esta guía gratuita está pensada para personas *sin experiencia*, porque:
• No necesitas horno 🍰  
• No necesitas batidora ⚡  
• No requiere fórmulas complicadas  
• Solo *batir, armar y refrigerar*  
• Puedes comenzar desde casa con muy poco capital  
• En 7 días ya puedes tener tus primeros postres listos para vender 💛

Esta guía te muestra exactamente:
✔ Cómo crear tus *primeros 2 postres profesionales*  
✔ Cómo iniciar con *materiales económicos*  
✔ Cómo preparar tu *primer mini menú*  
✔ Cómo dar tus *primeros pasos de venta*  
✔ Cómo hacer postres que de verdad se venden rápido

Es un recurso muy valioso si quieres empezar un negocio real desde cero con algo simple y rentable.

Antes de enviártela solo necesito hacerte dos preguntitas importantes:

1️⃣ *¿Te comprometes a seguir los pasos tal como vienen explicados en la guía?*  
2️⃣ *¿Estás consciente de que necesitarás comprar ingredientes muy básicos para poder completar el reto de 7 días?*

Cuando me confirmes esto, te envío la guía enseguida ❤️✨`;

                const mensajeCodificado = encodeURIComponent(mensajeTemplate);
                const whatsappUrl = `https://wa.me/${telefonoLead}?text=${mensajeCodificado}`;

                // ========= MENSAJE DE SEGUIMIENTO OPTIMIZADO =========

                const mensajeTemplateSeguimiento = `Hola ${nombreLead} 👋  
Solo pasaba para asegurarme de que hayas podido ver mi mensaje anterior 😊

La guía gratuita que te voy a enviar es *muy valiosa* si realmente quieres empezar a crear y vender postres en vasos, incluso si nunca antes has cocinado algo para vender.

Te enseña a:
✔ Preparar tus primeros postres sin experiencia  
✔ Empezar con una inversión mínima  
✔ Crear productos que la gente compra rápido  
✔ Tener resultados en pocos días 💛  

¿Sigues interesado(a) en comenzar?  
Si quieres, te explico cómo funciona el reto de 7 días para que te prepares mejor.`;

                const mensajeCodificadoSeguimiento = encodeURIComponent(mensajeTemplateSeguimiento);
                const whatsappUrlSeguimiento = `https://wa.me/${telefonoLead}?text=${mensajeCodificadoSeguimiento}`;

                // ========= INSERTAR FILA =========
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
            tableBody.innerHTML = '<tr><td colspan="3">No se encontraron leads.</td></tr>';
        }

    } catch (err) {
        console.error('Error inesperado:', err);
        tableBody.innerHTML = `<tr><td colspan="3">Ocurrió un error inesperado.</td></tr>`;
    }
}

// 5. Llamar a la función cuando se cargue la página
fetchLeads();
