const WEATHER_API_KEY = '664e3a10f526495492f112135231505';

const loadEvent = () => {



};

window.addEventListener('load', loadEvent);



// Create HTML Elements

/**
   * Creates and displays an HTML element.
   * @param {object} parentElementId - The ID of the HTML element you want to be the parent of the new HTML element.
   * @param {string} content - The content of the HTML element.
   * @param {string} tag - The tagname of the HTML element.
   * @param {string} properties - The properties of the HTML element.
   */
function insertHTML(parentElementId, content, tag, properties) {
  insertElement(elementById(parentElementId), createElement(content, tag, properties));
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
 * @param {string} properties - The properties of the HTML element.
 */
function createElement(content, tag, properties){
  return `<${tag} ${properties}>${content}</${tag}>`;
}
