const WEATHER_API_KEY = '664e3a10f526495492f112135231505';

const loadEvent = () => {
  // MAIN
  displayInputBar();
};

window.addEventListener('load', loadEvent);


// DOM Manipulations

/**
   * Creates and displays an input bar HTML element.
   */
function displayInputBar() {
  insertHTML('root', '', 'div', 'navPanel', '', '');

  insertHTML('navPanel', '', 'div', 'inputBox', 'control has-icons-left');
  // eslint-disable-next-line max-len
  insertHTML('inputBox', '', 'input', 'search', 'input is-medium', 'placeholder="Type in a city\'s name"');
  insertHTML('inputBox', '', 'span', '', 'icon is-left', '');
  /*
  <div class="control has-icons-left has-icons-right" id='inputBox'>
    <input class="input is-medium" type="email" placeholder="Email">
    <span class="icon is-left">
      <i class="fas fa-envelope"></i>
    </span>
  </div>
   */
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
