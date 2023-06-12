// Импортирую массив с состояниями погоды
import conditions from './conditions.js';

// Мой ключ для погодного апи
const apiKey = '6e60dc337dc5487c983174156221312';

//Собираю элементы со страници
const header = document.querySelector('.header');
const form = document.querySelector('.form');
const input = document.querySelector('.input');

//Отправка запроса на сервер в асинхронном виде
async function getWeater(city) {
  // Адрес запроса
  const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  return data;
}
//comit 12.06
// Ф-ция которая отрисовывает карточку(данные берет из объекта weatherData)
function showCard({name, country, temp, condition, icon}) {
  const html =
    // Разметка карточки
    `
  <div class="card">
    <h2 class="card-city">${name} <span>${country}</span></h2>
    <div class="card-weather">
        <div class="card-value">${temp}<sup>°c</sup></div>
        <img class="card-img" src=${icon} alt="Weather">
    </div>
    <div class="card-description">${condition}</div>
</div>`;

  // Отображаю карточку на странице
  header.insertAdjacentHTML('afterend', html);
}

//ф-ция отборажение ошибки
function showError(errorMessage) {
  // Отобразить карточку с ошибкой
  const html = `<div class="card">${errorMessage}</div>`;

  // Отображаем карточку на странице
  header.insertAdjacentHTML('afterend', html);
}

//Ф-ция удаляющая предыдущцю карточу
function removeCard() {
  const prevCard = document.querySelector('.card');
  if (prevCard) prevCard.remove();
}

// Слушаю отправку формы. нужна асинхронная ф-ция, чтобы получать асинх.ответ
form.onsubmit = async function (e) {
  // Отменяю обновление стр при отправке формы
  e.preventDefault();
  // Беру значение из инпута, обрезаю пробелы
  let city = input.value.trim();
  //Получаю данные с сервера
  const data = await getWeater(city); // вот здесь

  if (data.error) {
    removeCard();
    showError(data.error.message);
  } else {
    removeCard();

    const info = conditions.find(el => el.code === data.current.condition.code);
    console.log(info.languages[23]['day_text']);
    // Объект который сделан из получиных данных из апи, с удобным названием свойств
    const weatherData = {
      name: data.location.name,
      country: data.location.country,
      temp: data.current.temp_c,
      condition: data.current.is_day
        ? info.languages[23]['day_text']
        : info.languages[23]['night_text'],
      icon: data.current.condition.icon,
    };
    console.log(data.current.condition.code);

    showCard(weatherData);
  }
};
