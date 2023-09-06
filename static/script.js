const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('resultsContainer');
const viewButton = document.getElementById('viewButton');
const helpButton = document.getElementById('helpButton');
const helpModal = document.getElementById('helpModal');
const closeHelpModal = document.querySelector('.close');

// Обработчик события отправки формы
searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const query = searchInput.value;

    if (query) {
        try {
            resultsContainer.innerHTML = 'Загрузка...';

            const formData = new FormData();
            formData.append('search_query', query);

            const response = await fetch('/search', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();

                if (data.results.length === 0) {
                    resultsContainer.innerHTML = 'Ничего не найдено'; // Добавляем сообщение, если результаты отсутствуют
                } else {
                    const resultsHTML = data.results
                        .map((result, index) => `
                            <div class="result" data-index="${index}">
                                ${result}
                                <span class="delete-icon" data-index="${index}"><img src="trash.png" alt="Delete" /></span>
                            </div>`
                        )
                        .join('');

                    resultsContainer.innerHTML = resultsHTML;

                    const deleteIcons = document.querySelectorAll('.delete-icon');
                    deleteIcons.forEach((icon) => {
                        icon.addEventListener('click', deleteResult);
                    });
                }
            } else {
                throw new Error('Server returned an error');
            }
        } catch (error) {
            console.error('An error occurred:', error);
            resultsContainer.innerHTML = 'Произошла ошибка. Пожалуйста, попробуйте позже.';
        }
    } else {
        resultsContainer.innerHTML = 'Пожалуйста, введите поисковый запрос.';
    }
});

// Функция для удаления результата
async function deleteResult(event) {
    const resultIndex = event.currentTarget.getAttribute('data-index'); // Получаем индекс результата
    const resultElement = document.querySelector(`[data-index="${resultIndex}"]`); // Находим соответствующий элемент результата
    const query = resultElement.textContent.trim(); // Получаем текст запроса для удаления

    // Функция для отображения подтверждения удаления
    function showDeleteConfirmation(callback) {
        const confirmation = confirm('Вы действительно хотите удалить запись?');
        if (confirmation) {
            callback();
        }
    }

    // Отображаем диалоговое окно для подтверждения удаления
    showDeleteConfirmation(async () => {
        try {
            const response = await fetch('/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ delete_query: query }),
            });

            if (response.ok) {
                resultElement.remove();
                alert('Запись успешно удалена');
            } else {
                throw new Error('Сервер вернул ошибку');
            }
        } catch (error) {
            console.error('Произошла ошибка при удалении результата:', error);
        }
    });
}

const addButton = document.getElementById('addButton');

// Обработчик клика на кнопке "Добавить"
addButton.addEventListener('click', async () => {
    const query = searchInput.value;

    if (query) {
        // Функция для отображения подтверждения добавления
        function showAddConfirmation(callback) {
            const confirmation = confirm('Вы действительно хотите добавить запись?');
            if (confirmation) {
                callback();
            }
        }

        // Отображаем диалоговое окно для подтверждения добавления
        showAddConfirmation(async () => {
            try {
                const formData = new FormData();

                const response = await fetch('/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ add_query: query }),
                });

                if (response.ok) {
                    console.log('Результат успешно добавлен в базу данных.');
                    alert('Запись успешно добавлена');
                } else {
                    throw new Error('Сервер вернул ошибку');
                }
            } catch (error) {
                console.error('Произошла ошибка при добавлении результата:', error);
            }
        });
    } else {
        console.log('Введите текст для добавления в базу данных.');
    }
});

// Обработчик клика на кнопке "Просмотр"
viewButton.addEventListener('click', async () => {
    try {
        const response = await fetch('/view');

        if (response.ok) {
            const data = await response.json();
            const resultsHTML = data.results
                .map((result, index) => `
                    <div class="result" data-index="${index}">
                        ${result}
                        <span class="delete-icon" data-index="${index}"><img src="trash.png" alt="Удалить" /></span>
                    </div>`
                )
                .join('');

            resultsContainer.innerHTML = resultsHTML;

            const deleteIcons = document.querySelectorAll('.delete-icon');
            deleteIcons.forEach((icon) => {
                icon.addEventListener('click', deleteResult);
            });
        } else {
            throw new Error('Сервер вернул ошибку');
        }
    } catch (error) {
        console.error('Произошла ошибка при просмотре базы данных:', error);
    }
});

// Обработчик клика на кнопке "Помощь"
helpButton.addEventListener('click', () => {
    helpModal.style.display = 'block';
});

// Обработчик клика на элементах вне модального окна для его закрытия
closeHelpModal.addEventListener('click', () => {
    helpModal.style.display = 'none';
});

// Обработчик клика вне модального окна для его закрытия
window.addEventListener('click', (event) => {
    if (event.target === helpModal) {
        helpModal.style.display = 'none';
    }
});
