let publicaciones = [];
document.addEventListener('DOMContentLoaded',()=>{ 
        // Función para cargar los datos de la API
        async function cargarDatos() {
            try {
                const response = await fetch('https://ferqueve.github.io/tendencias/api/posts.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                publicaciones = await response.json();
                console.log('Datos cargados:', publicaciones);
            } catch (error) {
                console.error('Error al cargar los datos:', error);
                document.getElementById('results').innerHTML = '<p class="alert alert-danger">Error al cargar los datos. Por favor, intente más tarde.</p>';
            }
        }

        // Llamar a cargarDatos cuando se carga la página
        window.addEventListener('load', cargarDatos);

        function analizarTendencias(hashtag, minLikes, fechaInicio) {
            console.log("El post tiene que cumplir TODAS las condiciones para que se muestre en la lista")
            return publicaciones.filter(post => 
                post.texto.toLowerCase().includes(hashtag.toLowerCase()) &&
                post.likes >= minLikes &&
                new Date(post.fecha) >= new Date(fechaInicio)
            ); 
            
        }

        document.getElementById('trendForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const hashtag = document.getElementById('hashtag').value;
            const minLikes = parseInt(document.getElementById('minLikes').value);
            const startDate = document.getElementById('startDate').value;

            const tendencias = analizarTendencias(hashtag, minLikes, startDate);

            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '';

            if (tendencias.length > 0) {
                const list = document.createElement('ul');
                list.className = 'list-group';
                tendencias.forEach(post => {
                    const item = document.createElement('li');
                    item.className = 'list-group-item';
                    item.innerHTML = `
                        <p>${post.texto}</p>
                        <small><i class="fas fa-heart text-danger"></i> ${post.likes} likes | <i class="fas fa-calendar"></i> ${post.fecha}</small>
                    `;
                    list.appendChild(item);
                });
                resultsDiv.appendChild(list);
            } else {
                resultsDiv.innerHTML = '<p class="alert alert-info">No se encontraron resultados para los criterios especificados.</p>';
            }
        })
        });