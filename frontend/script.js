const WEATHER_API_KEY = '664e3a10f526495492f112135231505';
const IMAGE_API_KEY = '93pgBPYkOqOAqUyuhTDX7I2NutiObGjRo02Ksv3eqIWuuwcU1CDPSSgo';
const favorites = [];

const loadEvent = () => {
  // MAIN
  displayInputBar();
  //displayCard(placeholderBudapest());
};

window.addEventListener('load', loadEvent);

async function recieveAutocomplete(event) {
  const cityName = event.target.value;
  if (cityName.length >= 3) {
    const urlParts = {
      site: 'http://api.weatherapi.com/v1/search.json',
      key: WEATHER_API_KEY,
      q: `${cityName}*`,
    };
    const recieved = await getFetchOf(urlParts);
    displaySuggestions(recieved.map((x) => `${x.name}, ${x.region}`));
  }
}

async function recieveWeather(event) {
  // töltődő jel, amíg nem kap adatot
  const cityName = event.target.value;
  const NUMBER_OF_DAYS_TO_FORECAST = 8;
  const NUMBER_OF_PICTURES = 1;
  const urlPartsWeather = {
    site: 'http://api.weatherapi.com/v1/forecast.json',
    key: WEATHER_API_KEY,
    q: cityName,
    days: NUMBER_OF_DAYS_TO_FORECAST.toString(),
    aqi: 'no',
    alerts: 'no',
  };
  //const recieved = await getFetchOf(placeholderLondon());
  const recieved = await getFetchOf(urlPartsWeather);
  const urlPartsImage = {
    site: 'https://api.pexels.com/v1/search',
    query: cityName,
    orientation: 'landscape',
    'per_page': NUMBER_OF_PICTURES.toString(),
  };
  const headers = {
    Authorization: IMAGE_API_KEY,
  };
  const recievedImages = await getFetchOf(urlPartsImage, headers);
  const image = recievedImages.photos[0].src.landscape;
  displayCard(recieved, image);
}
/*
function placeholderLondon() {
  const urlParts = {
    site: 'http://api.weatherapi.com/v1/current.json',
    key: WEATHER_API_KEY,
    q: 'London',
    days: '8',
    aqi: 'no',
    alerts: 'no',
  };
  return urlParts;
}
*/
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

function placeholderBudapest() {
  const city = {
    current: {
      condition: {
        icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
        text: 'Sunny',
      },
      humidity: '25',
      'last_updated': '2023-05-14 13:00',
      'temp_c': '18',
      'wind_dir': 'N',
      'wind_kph': '15.1',
    },
    location: {
      name: 'Budapest',
    },
  };
  return city;
}

function search(list, searchElement) {
  return list.filter((element) => element.contains(searchElement));
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
  if (favorites.includes(city.location.name)) {
    elementById('favorite').classList.add('activefavorite');
  }
  processFavoriteClick();
  insertHTML('card', city.current.last_updated, 'div', 'class="date black-text-shadow"');
}

// recieved array full of suggestion names
function displaySuggestions (cities) {
  console.log(cities);
}

function processInputChange() {
  elementById('search').addEventListener('change', (event) => recieveWeather(event));
}

function processFavoriteClick() {
  elementById('favorite').addEventListener('click', changeFavorite);
}

function inputAutocomplete() {
  elementById('search').addEventListener('input', (event) => recieveAutocomplete(event));
}

function changeFavorite() {
  elementById('favorite').classList.toggle('activefavorite');
  const cityName = elementById('cityname').innerHTML;
  const index = favorites.indexOf(cityName);
  if (index > -1) favorites.splice(index, 1);
  else favorites.push(cityName);
}

/**
   * Creates and displays an input bar HTML element.
   */
function displayInputBar() {
  insertHTML('root', '', 'div', 'id=navPanel');
  insertHTML('navPanel', '', 'div', 'id=inputBox class="control has-icons-left"');
  insertHTML('inputBox', '', 'input',
    'id=search placeholder="Type in a city\'s name" class="input is-medium is-rounded"');
  insertHTML('inputBox', '', 'span', 'id=searchIcon class="icon is-left"');
  insertHTML('searchIcon', '', 'img', 'src=icons/search-line.svg');
  processInputChange();
  inputAutocomplete();
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

/*
/**
 * Add classes.
 * @param {string} id - The id of the HTML element.
 * @param {Array} classes - The array of the classes you want to add to the HTML element.
 */
/*function addClassesToElement(id, classes) {
  classes.forEach((className) => {
    elementById(id).classList.add(className);
  });
}

/**
 * Remove classes.
 * @param {string} id - The id of the HTML element.
 * @param {Array} classes - The array of the classes you want to remove from the HTML element.
 */
/*function removeClassesFromElement(id, classes) {
  classes.forEach((className) => {
    elementById(id).classList.remove(className);
  });
}
*/

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
