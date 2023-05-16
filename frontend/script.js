const WEATHER_API_KEY = '664e3a10f526495492f112135231505';

const loadEvent = () => {
  // MAIN

  //  getTheWeather();

  displayInputBar();
  document.getElementById('search').addEventListener('change', (event) => recieveWeather(event));
  //main();

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
  //draw the card
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


// DOM Manipulations

/**
   * Creates and displays an input bar HTML element.
   */
function displayInputBar() {
  insertHTML('root', '', 'div', 'navPanel');

  insertHTML('navPanel', '', 'div', 'inputBox', '');
  addClassesToElement('inputBox', ['control', 'has-icons-left']);

  // eslint-disable-next-line max-len
  insertHTML('inputBox', '', 'input', 'search', '', 'placeholder="Type in a city\'s name"');
  addClassesToElement('search', ['input', 'is-medium', 'is-rounded']);

  insertHTML('inputBox', '', 'span', 'searchIcon', '', '');
  addClassesToElement('searchIcon', ['icon', 'is-left']);

  insertHTML('searchIcon', '', 'img', '', '', 'src="icons/search-line.svg"');
}


// Create HTML Elements

/**
   * Creates and displays an HTML element.
   * @param {string} parentElementId - The ID of the HTML element you want to be the parent of the new HTML element.
   * @param {string} content - The content of the HTML element.
   * @param {string} tag - The tagname of the HTML element.
   * @param {string} id - The id of the HTML element.
   * @param {string} className - The class of the HTML element.
   * @param {string} attribute - The attributes of the HTML element.
   */
function insertHTML(parentElementId, content, tag, id, className, attribute) {
  insertElement(elementById(parentElementId),
    createElement(content, tag, id, className, attribute));
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
   * @param {string} id - The id of the HTML element.
   * @param {string} className - The class of the HTML element.
   * @param {string} attribute - The attributes of the HTML element.
 */
function createElement(content, tag, id, className, attribute){
  return `<${tag} id=${id} class=${className} ${attribute}>${content}</${tag}>`;
}
