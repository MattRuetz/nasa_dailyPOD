const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

// NASA API
const count = 10;
const apiKey = 'DEMO_KEY' 

const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`


let resultsArray = [];
let favorites = {};

const createDOMNodes = (page) => {
    const currentArray = page === 'results' ? resultsArray : Object.values(favorites);
    console.log('current', page, currentArray);
    currentArray.forEach((result) => {
        // create card-container
        const card = document.createElement('div');
        card.classList.add('card');

        // Link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';

        // Image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA Picture of the Day';
        image.loading = 'lazy';
        image.classList.add('card-img-top');

        // Card body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        // Card Title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;

        // Save Text
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        saveText.textContent = 'Add to Favorites';
        saveText.setAttribute('onclick', `saveFavorite('${result.url}')`); //Any unique value works

        // Card Text
        const cardText = document.createElement('p');
        cardText.textContent = result.explanation;

        // Footer
        const footer = document.createElement('small');
        footer.classList.add('text-muted');

        // Date
        const date = document.createElement('strong');
        date.textContent = result.date;

        // Copyright
        const copyrightResult = result.copyright === undefined ? '' : result.copyright;
        const copyright = document.createElement('span');
        copyright.textContent = `${copyrightResult}`

        // Append properly
        footer.append(date, copyright);
        cardBody.append(cardTitle, cardText, saveText, footer);
        link.appendChild(image);
        card.append(link, cardBody);
        console.log(card);
        imagesContainer.appendChild(card);
    });
}

const updateDOM = (page) => {
    // Get favorites from localStorage
    if(localStorage.getItem('nasaFavorites')) {
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
        console.log('SAVED FAVS: ', favorites);
    }
    createDOMNodes('favorites');
}

// Add a chosen img to favorites
const saveFavorite = (itemUrl) => {
    // Loop through results and find favorite
    resultsArray.forEach((item) => {
        if (item.url.includes(itemUrl)) {
            favorites[itemUrl] = item;

            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true;
            }, 2000);

            localStorage.setItem('nasaFavorites', JSON.stringify(favorites))
        }
    })
}

// Get 10images with ASYNC GET REQUEST
const getNasaPictures = async () => {
    try {
        // resultsArray = await (await fetch(apiUrl)).json();
        updateDOM();
    } catch (err) {
        console.log(err);
    }
}

getNasaPictures();