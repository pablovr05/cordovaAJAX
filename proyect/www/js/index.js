/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
}

window.onload = function() {
  console.log("Página cargada");
  var options = { "swipeable": true };
  var el = document.getElementsByClassName('tabs');
  var instance = M.Tabs.init(el, options);
}

document.addEventListener('DOMContentLoaded', function() {
  const elems = document.querySelectorAll('.sidenav');
  M.Sidenav.init(elems);
  
  const selectElems = document.querySelectorAll('select');
  M.FormSelect.init(selectElems);

  document.getElementById('search-btn').addEventListener('click', function() {
    const searchType = document.getElementById('search-type').value;
    const searchQuery = document.getElementById('search-query').value;
    const resultText = `Se buscó por ${searchType === 'isbn' ? 'ISBN' : 'Nombre del Libro'} con (${searchQuery})`;
    document.getElementById('search-result').innerText = resultText;

    let apiUrl = '';
    if (searchType === 'isbn') {
      apiUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${searchQuery}`;
    } else {
      apiUrl = `https://www.googleapis.com/books/v1/volumes?q=intitle:${searchQuery.replace(/ /g, '+')}`;
    }

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const resultsContainer = document.getElementById('search-result');
        resultsContainer.innerHTML = '';

        if (data.items && data.items.length > 0) {
          data.items.forEach(item => {
            const bookInfo = item.volumeInfo;
            const bookElement = document.createElement('div');
            bookElement.classList.add('book-item');
            bookElement.innerHTML = `
              <div class="book-item">
                <div class="book-info">
                  <div class="book-title">
                    <h6 class="book-title-text">${bookInfo.title}</h6>
                  </div>
                  <div class="book-authors">
                    <p><strong>Autor(es):</strong> <span class="authors-list">${bookInfo.authors ? bookInfo.authors.join(', ') : 'Desconocido'}</span></p>
                  </div>
                  <div class="book-published">
                    <p><strong>Publicado en:</strong> <span class="published-date">${bookInfo.publishedDate || 'Desconocido'}</span></p>
                  </div>
                  <div class="book-description">
                    <p><strong>Descripción:</strong> <span class="description-text">${bookInfo.description || 'No disponible.'}</span></p>
                  </div>
                </div>
                <div class="book-image">
                  <img class="book-thumbnail" src="${bookInfo.imageLinks ? bookInfo.imageLinks.thumbnail : ''}" alt="Imagen del libro">
                </div>
              </div>
            `;
            resultsContainer.appendChild(bookElement);
          });
        } else {
          resultsContainer.innerHTML = 'No se encontraron resultados para su búsqueda.';
        }
      })
      .catch(error => {
        console.error('Error al realizar la búsqueda:', error);
        document.getElementById('search-result').innerText = 'Hubo un problema al realizar la búsqueda.';
      });

    const instance = M.Tabs.getInstance(document.querySelector('.tabs'));
    instance.select('test-swipe-2');
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const videoElement = document.getElementById('video');
  const photoElement = document.getElementById('photo');
  const canvasElement = document.getElementById('canvas');
  const cameraStatus = document.getElementById('camera-status');
  const cameraBtn = document.getElementById('camera-btn');

  function startCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
          videoElement.srcObject = stream;
        })
        .catch(function(err) {
          console.error("Error al acceder a la cámara: ", err);
          cameraStatus.textContent = "No se pudo acceder a la cámara.";
        });
    } else {
      alert("La API de cámara no está soportada en este navegador.");
    }
  }

  cameraBtn.addEventListener('click', function() {
    const context = canvasElement.getContext('2d');
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
    context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

    const imageData = canvasElement.toDataURL('image/png');
    photoElement.src = imageData;
    photoElement.style.display = 'block';
    cameraStatus.textContent = '¡Foto tomada!';
  });

  startCamera();
});
