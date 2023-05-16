const WEATHER_API_KEY = '664e3a10f526495492f112135231505';
const favourites = [];

const loadEvent = () => {
  // MAIN
  displayInputBar();
  processInputChange();
  displayCard(placeholder());
};

window.addEventListener('load', loadEvent);

async function recieveWeather(event) {
  // töltődő jel, amíg nem kap adatot
  const proba = {
    site: 'http://api.weatherapi.com/v1/current.json',
    key: WEATHER_API_KEY,
    q: 'London',
    aqi: 'no',
  };
  const recieved = await getFetchOf(proba);
  console.log(recieved);
  //displayCard(recieved);
}

async function getFetchOf(object) {
  let url = object.site;
  let isFirst = true;
  for (const key in object) {
    if (key !== 'site') {
      if (isFirst) {
        url += '?';
        isFirst = !isFirst;
      } else url += '&';
      url += `${key}=${object[key]}`;
    }
  }
  const response = await fetch(url);
  const jsonData = await response.json();
  return jsonData;
}

function placeholder() {
  const city = {
    current: {
      condition: {
        icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
        text: 'Sunny',
      },
      humidity: '25',
      'last_updated': '2023-05-14 13:00',
      'temp_c': 18,
      'wind_dir': 'N',
      'wind_kph': '15.1',
    },
    location: {
      name: 'Budapest',
    },
  };
  return city;
}


// DOM Manipulations

function displayCard() {
  //insertHTML('root', '', 'div', 'id=container');
}

function processInputChange() {
  document.getElementById('search').addEventListener('change', (event) => recieveWeather(event));
}

/**
   * Creates and displays an input bar HTML element.
   */
function displayInputBar() {
  insertHTML('root', '', 'div', 'id=navPanel');
  insertHTML('navPanel', '', 'div', 'id=inputBox class="control has-icons-left"');
  insertHTML('inputBox', '', 'input',
    'id=search placeholder=Type in a city\'s name class="input is-medium is-rounded"');
  insertHTML('inputBox', '', 'span', 'id=searchIcon class="icon is-left"');
  insertHTML('searchIcon', '', 'img', 'src=icons/search-line.svg');
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
 * Add classes.
 * @param {string} id - The id of the HTML element.
 * @param {Array} classes - The array of the classes you want to add to the HTML element.
 */
function addClassesToElement(id, classes) {
  classes.forEach((className) => {
    elementById(id).classList.add(className);
  });
}

/**
 * Remove classes.
 * @param {string} id - The id of the HTML element.
 * @param {Array} classes - The array of the classes you want to remove from the HTML element.
 */
function removeClassesFromElement(id, classes) {
  classes.forEach((className) => {
    elementById(id).classList.remove(className);
  });
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
