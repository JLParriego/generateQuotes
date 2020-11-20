/* ---------- DOM ELEMENTS --------------------------------------------- */
//Connect js to our html DOM elements

const quoteContainer = document.getElementById("quote-container");
const quoteText = document.getElementById("quote");
const authorText = document.getElementById("author");
const twitterBtn = document.getElementById("twitter-button");
const newQuoteBtn = document.getElementById("new-quote");
const newBody = document.getElementById("bigBody");
const imageDescription = document.getElementById("description");
const imageName = document.getElementById("name");
const clock = document.getElementById("clock");
const loader = document.getElementById("loader")

/* -------- ADD QUOTES FROM API TO THE WEB ----------------------------- */

// Show New Quote in - we create a pure fx with no side effects
// To do that we include fx newQuote (closure) inside fx viewQuotes

// Pick a random quote from apiQuotes array
// We choose a random number between 0 and 1 that multiply by length of the array assures it will always smaller than the array length and to remove decimals we use floor, goes to the next lower int number.
// We asign the author and quote of the quotes API object to
// the content of the elements quote and author

function viewQuotes(array) {
  let apiQuotes = array;

  function newQuote() {
    showLoadingSpinner();
    const quote = apiQuotes[Math.floor(Math.random() * apiQuotes.length)];

    // Check if Author field is blank and replace it with 'unknow'
    //!quote.author --> If there is no quote.author --> quote.author === null
    if (!quote.author) {
      authorText.textContent = "Unknown";
    } else {
      authorText.textContent = quote.author;
    }

    // Check Quote length to determine styling
    if (quote.text.length > 120) {
      quoteText.classList.add("long-quote");
    } else {
      quoteText.classList.remove("long-quote");
    }

    // Set the quote, Hide Loader
    quoteText.textContent = quote.text;
    removeLoadingSpinner();
  }
  newQuote();
}

//async is new version of a Promise (keys: async function and await)
// runs independently from the browser
// fetch: allows us to make a network request(ask)
// So getQuotes is an asyncronous functions. It means goes out of the JS callstack and goes to the JSRunTimeEnv API
// First we "await" to a positive answer to the fetch call to the APIURL. If that happens we include the fetch result in response.
// Second if response is ok, data is not set until we have the response in json format
// if first or second gives an error we catch it with catch and capture the type of error
// try code inside try, if doesn´t work catch the error and respond
// we download only one all the quotes into apiQuotes and after that
// we call the newQuote fx that randomly will choose one

async function getQuotes() {
  showLoadingSpinner();
  const apiUrl = "https://type.fit/api/quotes";

  try {
    const response = await fetch(apiUrl);
    apiQuotes = await response.json();
    viewQuotes(apiQuotes);
  } catch (error) {
    getQuotes();
    console.log("oops", error);
  }
}

/* ----------- ADD IMAGES FROM UNSPLASH API TO THE WEB -------------------------------- */

// Show New Image - we create a pure fx with no side effects
// To do that we include fx newImage (closure) inside fx viewImages
// We choose a random image from urls property with the size value = full
// Adding the image to the body backgroundImage
// Finally calling the newImage() fx.
function viewImages(listArray) {
  let images = listArray;

  function newImage() {
    console.log(images);
    let image = images[Math.floor(Math.random() * images.length)];
    let urls = image.urls.regular;
    let description = image.description;
    let name = image.user.name;
    console.log(image);
    console.log(urls);
    console.log(description);
    console.log(name);
    newBody.style.backgroundImage = "url(" + urls + ")";
    imageDescription.textContent = description;
    imageName.textContent = name;
  }
  newImage();
}

// We download the unsplash images json file and call the function to
// choose one image
async function getImages(query) {
  const accessKey = "1qolww0EXG7XtCnU4CvgC6xDnH8qbKm8SnDikBPOklQ";
  const endPoint = "https://api.unsplash.com/search/photos";

  try {
    let response = await fetch(
      endPoint + "?query=" + query + "&client_id=" + accessKey
    );
    let jsonResponse = await response.json();
    let imagesList = await jsonResponse.results;
    viewImages(imagesList);
  } catch (error) {
    getImages(query);
    console.log("oops", error);
  }
}

/* --------------- TWEETING QUOTES ------------------------------ */

// Tweet Quote
function tweetQuote() {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quoteText.textContent} - ${authorText.textContent}`;

  //we open a new window with the twitterUrl blank.
  window.open(twitterUrl, "_blank");
}

/* --------- CLOCK -------------- */
// Extract hours and minutes from current date
// Add a zero to in front of hours and minutes < 10. fx checkTime

function startTime() {
  let today = new Date();
  let h = today.getHours();
  let m = today.getMinutes();
  h = checkTime(h);
  m = checkTime(m);
  clock.innerHTML = h + ":" + m;
  let t = setTimeout(startTime, 1000);
  
}


function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}


/* --------------- LOADER --------------- */

//Show loading - while loading show the loader and hide the quote
//add loading to getQuote() and newQuote() fxs at the top to be sure its runs till the quote is loaded

function showLoadingSpinner(){
  quoteContainer.hidden = true;
  loader.hidden = false;
}




//Hide loading - when loaded show the quote and hide the loader
//Add complete()fx to newQuote()fx to the botton whe the quote is set

function removeLoadingSpinner(){
 quoteContainer.hidden = false;
 loader.hidden = true; 
}





/* --------------- ADD EVENT LISTENERS ------------------------------ */
//Add event listeners
//the two firsts wait for the click, the startTime() needs () as is called when the body is loaded
newQuoteBtn.addEventListener("click", getQuotes);
twitterBtn.addEventListener("click", tweetQuote);
newBody.addEventListener("load", startTime());

/* ----------------- LOAD THE FUNCTIONS ------------------------------- */

// When the index is loaded getQuotes is launched
getQuotes();


//choosing the theme of the images and calling the fx
getImages("nature");
