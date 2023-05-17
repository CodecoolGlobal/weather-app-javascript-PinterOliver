const WEATHER_API_KEY = '664e3a10f526495492f112135231505';
const IMAGE_API_KEY = '93pgBPYkOqOAqUyuhTDX7I2NutiObGjRo02Ksv3eqIWuuwcU1CDPSSgo';
const FAVORITES = [];

/**
 * The main function.
*/
const loadEvent = () => {
  displayInputBar();
};

// Reaction to user input

window.addEventListener('load', loadEvent);

/*function makeTheButtonsClickable() {
  elementById('dropdown-content').addEventListener('click', (event) => {
    processClickOnSuggested(event);
  });
}

function processClickOnSuggested(event) {
  console.log(event.target.firstChild.innerText);
  elementById('search').value = event.target.firstChild.innerText;
  console.log(elementById('search').value);
  processWeather(event.target.firstChild.innerText);

  const e = new Event("change");
const element = document.querySelector('#test')
element.dispatchEvent(e);
}*/

function processInputChange() {
  elementById('search').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      recieveWeather(event);
      elementById('suggestionDropDown').classList.remove('is-active');
    }
  });
  elementById('search').addEventListener('focusout', (event) => processClickOnSuggested(event));  // Ki kattintás változása
}

function processAutocomplete() {
  elementById('search').addEventListener('input', (event) => recieveAutocomplete(event)); // Szöveg változás
  elementById('search').addEventListener('focusin', (event) => recieveAutocomplete(event)); // Be kattintás változása
}

function processClickOnSuggested(event) {
  {
    setTimeout(function() {
      if (!document.activeElement.querySelector('button')) {
        console.log('activeElement.child ', document.activeElement.lastChild);
        const clickedCity = document.activeElement.lastChild.innerText;
        event.target.value = clickedCity;
        processWeather(clickedCity);
      } else {
        recieveWeather(event);
      }
      elementById('suggestionDropDown').classList.remove('is-active');
    }, 0);
  }
}

function processFavoriteClick() {
  elementById('favorite').addEventListener('click', changeFavorite);
}

// Fetch and process information

async function recieveAutocomplete(event) {
  const cityName = event.target.value;
  if (cityName.length >= 3) {
    const action = 'search';
    const urlParts = {
      site: `http://api.weatherapi.com/v1/${action}.json`,
      key: WEATHER_API_KEY,
      q: `${cityName}*`,
    };
    const recieved = await getFetchOf(urlParts);
    displaySuggestions(recieved.map((x) => [x.name, x.region]), cityName);
  } else {
    displaySuggestions([], cityName);
  }
}

function recieveWeather(event) {
  // töltődő jel, amíg nem kap adatot
  let cityName = event.target.value;
  const foundFavCities = search(FAVORITES, cityName);
  if (foundFavCities.length > 0) {
    cityName = foundFavCities[0];
  } else if (document.querySelector('.is-active')) {
    cityName = elementById('city-0').lastChild.innerText;
  }
  event.target.value = cityName;
  if (cityName.length >= 3) processWeather(cityName);
}

async function processWeather(cityName) {
  const NUMBER_OF_DAYS_TO_FORECAST = 8;
  const NUMBER_OF_PICTURES = 1;
  const actionWeather = 'forecast';
  const urlPartsWeather = {
    site: `http://api.weatherapi.com/v1/${actionWeather}.json`,
    key: WEATHER_API_KEY,
    q: cityName,
    days: NUMBER_OF_DAYS_TO_FORECAST.toString(),
    aqi: 'no',
    alerts: 'no',
  };
  const recieved = await getFetchOf(urlPartsWeather);
  const actionImage = 'search';
  const urlPartsImage = {
    site: `https://api.pexels.com/v1/${actionImage}`,
    query: cityName,
    orientation: 'landscape',
    'per_page': NUMBER_OF_PICTURES.toString(),
  };
  const headers = {
    Authorization: IMAGE_API_KEY,
  };
  const recievedImages = await getFetchOf(urlPartsImage, headers);
  let image = 'images/default-city.jpg';
  if (typeof recievedImages.photos[0] !== 'undefined') {
    image = recievedImages.photos[0].src.landscape;
  }
  displayCard(recieved, image);
}

async function getFetchOf(body, headers) {
  let url = body.site;
  let isFirst = true;
  for (const key in body) {
    if (key !== 'site') {
      if (isFirst) {
        url += '?';
        isFirst = !isFirst;
      } else url += '&';
      url += `${key}=${body[key]}`;
    }
  }
  let response;
  if (headers) {
    response = await fetch(url, {headers: headers});
  } else {
    response = await fetch(url);
  }
  const jsonData = await response.json();
  return jsonData;
}

function changeFavorite() {
  elementById('favorite').classList.toggle('activefavorite');
  const cityName = elementById('cityname').innerHTML;
  const index = FAVORITES.indexOf(cityName);
  if (index > -1) FAVORITES.splice(index, 1);
  else FAVORITES.push(cityName);
}

function search(list, searchElement) {
  return list.filter((element) => new RegExp(`(^| )${searchElement}`, 'i').test(element));
}

// DOM Manipulations

function displayCard(city, image) {
  if (elementById('container')) elementById('container').remove();
  insertHTML('root', '', 'div', 'id=container');
  insertHTML('container', '', 'div', 'id=card');
  elementById('card').style['background-image'] = `url(${image})`;
  insertHTML('card', '', 'div', 'id=sidepanel');
  insertHTML('sidepanel', '', 'div', 'id=topdetails');
  insertHTML('topdetails', `${city.current.temp_c} °C`, 'div', 'class="temperature gray-text-shadow"');
  insertHTML('topdetails', '', 'hr', '');
  insertHTML('topdetails', '', 'div', 'id=sky class="sky gray-text-shadow"');
  insertHTML('sky', '', 'img', `class=skyimg src=${city.current.condition.icon}`);
  insertHTML('sky', city.current.condition.text, 'span', '');
  insertHTML('sidepanel', '', 'div', 'id=bottomdetails');
  insertHTML('bottomdetails', '', 'div',
    'id=humidity class="details gray-text-shadow" title=Humidity');
  insertHTML('humidity', '', 'img', 'class=detailsimg src="icons/mist-line.svg"');
  insertHTML('humidity', `${city.current.humidity} %`, 'span', '');
  insertHTML('bottomdetails', '', 'div',
    'id=wind class="details gray-text-shadow" title="Wind velocity and direction"');
  insertHTML('wind', '', 'img', 'class=detailsimg src="icons/windy-line.svg"');
  insertHTML('wind', `${city.current.wind_kph} km/h (${city.current.wind_dir})`, 'span', '');
  insertHTML('card', '', 'div', 'id=bottommain');
  insertHTML('bottommain', city.location.name, 'div', 'id=cityname class=cityname');
  insertHTML('card', '', 'div', 'id=favorite class=favorite title="Add to favorites"');
  if (FAVORITES.includes(city.location.name)) {
    elementById('favorite').classList.add('activefavorite');
  }
  processFavoriteClick();
  insertHTML('card', city.current.last_updated, 'div', 'class="date black-text-shadow"');
}

/**
 * Display the suggested cities.
 * @param {array} cities - The array of the suggested names from API.
 * @param {string} input - The input from the inputbox.
*/
function displaySuggestions (cities, input) {
  const recievedCities = processCityLists(cities, input);
  cities = recievedCities[0];
  const foundFavCities = recievedCities[1];
  if (elementById('suggestionDropDown')) elementById('suggestionDropDown').remove();
  if ((cities.length > 0 || foundFavCities.length > 0) && document.activeElement.id === 'search'){
    insertHTML('inputBox', '', 'div', 'id="suggestionDropDown" class="dropdown is-active"');
    insertHTML('suggestionDropDown', '', 'div', 'id="dropdown-menu" class="dropdown-menu"');
    insertHTML('dropdown-menu', '', 'div', 'id="dropdown-content" class="dropdown-content"');
    if (foundFavCities.length > 0) {
      foundFavCities.forEach((cityName, index) => {
        insertHTML('dropdown-content', '', 'button',
          `id="favCity-${index}" class="dropdown-item favorite-dropdown-item"`);
        insertHTML(`favCity-${index}`, '', 'img',
          'class="favorite-dropdown-icon" src="icons/heart-2-fill-black.svg"');
        insertHTML(`favCity-${index}`, cityName, 'span', '');
      });
    }
    if (cities.length > 0 && foundFavCities.length > 0) {
      insertHTML('dropdown-content', '', 'hr', 'class="dropdown-divider"');
    }
    if (cities.length > 0) {
      cities.forEach((cityName, index) => {
        insertHTML('dropdown-content', '', 'button', `id=city-${index} class="dropdown-item"`);
        insertHTML(`city-${index}`, cityName[1], 'span', 'class="dropdown-region"');
        insertHTML(`city-${index}`, cityName[0], 'span', 'class="dropdown-city"');
      });
    }
  }
}

function processCityLists(cities, input) {
  const foundFavCities = search(FAVORITES, input);
  cities.forEach((city) => {
    if (FAVORITES.includes(city[0]) && !foundFavCities.includes(city[0])) {
      foundFavCities.push(city[0]);
    }
  });
  cities = cities.filter((city) => !foundFavCities.includes(city[0]));
  return [cities, foundFavCities];
}

/**
   * Creates and displays an input bar HTML element.
   */
function displayInputBar() {
  insertHTML('root', '', 'div', 'id=navPanel');
  insertHTML('navPanel', '', 'div', 'id=inputBox class="control has-icons-left"');
  insertHTML('inputBox', '', 'input', 'list="options" id="search"' +
  'placeholder="Type in a city\'s name" class="input is-medium is-rounded"');
  insertHTML('inputBox', '', 'span', 'id=searchIcon class="icon is-left"');
  insertHTML('searchIcon', '', 'img', 'src=icons/search-line.svg');
  processInputChange();
  processAutocomplete();
}

// Create HTML Elements

/**
   * Creates and displays an HTML element.
   * @param {string} parentElementId - The ID of the HTML element you want to be the parent of the new HTML element.
   * @param {string} content - The content of the HTML element.
   * @param {string} tag - The tagname of the HTML element.
   * @param {string} attributes - The attributes of the HTML element.
   */
function insertHTML(parentElementId, content, tag, attributes) {
  insertElement(elementById(parentElementId),
    createElement(content, tag, attributes));
}

/**
 * Get an HTML element by its ID.
 * @param {string} id - The id of the HTML element.
 */
function elementById(id) {
  return document.getElementById(id);
}

/**
 * Displays an HTML element.
 * @param {object} parentElement - The HTML element you want to be the parent of the new HTML element.
 * @param {object} childElement - The new HTML element.
 */
function insertElement(parentElement, childElement) {
  parentElement.insertAdjacentHTML('beforeend', childElement);
}

/**
 * Creates an HTML element.
 * @param {string} content - The content of the HTML element.
 * @param {string} tag - The tagname of the HTML element.
   * @param {string} attributes - The attributes of the HTML element.
 */
function createElement(content, tag, attributes){
  return `<${tag} ${attributes}>${content}</${tag}>`;
}
