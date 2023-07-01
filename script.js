// https://www.omdbapi.com/?i=tt3896198&apikey=f227a303

const inputBox = document.getElementById('input-box');
const  searchList = document.getElementById('search-list');
const allresult = document.getElementById('all-result');
const favContentItems = document.getElementById('fav-content-items');

// Let's load movie from API

async function loadMovies(searchedWord){
    const url= `https://www.omdbapi.com/?s=${searchedWord}&apikey=f227a303`;

    const resource = await fetch(`${url}`);
    const data = await resource.json();
    if(data.Response == "True") displayMovieList(data.Search);
    console.log(data);
}

//  find movie in search box
function toFindMovie(){
    let searchedTerm = (inputBox.value).trim();
    if(searchedTerm.length>0){
        searchList.classList.remove('hide-suggestion-list');
        loadMovies(searchedTerm);
    }else{
        searchList.classList.add('hide-suggestion-list');
    }
}
  
// function to display movie 
function displayMovieList(movies){
    searchList.innerHTML="";
    for(let ind = 0; ind < movies.length; ind++){
        let listItemMov = document.createElement('div');
        listItemMov.dataset.id = movies[ind].imdbID;
        listItemMov.classList.add('search-list-item');
        if(movies[ind].Poster !== "N/A"){
          moviePoster = movies[ind].Poster;
        }else{
            moviePoster = `https://www2.brockport.edu/live/resource/image/_resources/images/directory_index_default.rev.1649271413.png`;
        }

        listItemMov.innerHTML = `
        <div class="search-img">
            <img src="${moviePoster}">
        </div>
        <div class="name-year-tag">
            <h3>${movies[ind].Title}</h3>
            <p>${movies[ind].Year}</p>
        </div>
    `;
    
        searchList.appendChild(listItemMov);
    }
    loadMovieAllDetails();
}

// function to load movie details
function loadMovieAllDetails(){

    const searchedMovieInList = searchList.querySelectorAll(".search-list-item");
   
    searchedMovieInList.forEach(movie=>{
       movie.addEventListener('click', async()=>{
        // console.log(movie.dataset.id);
        searchList.classList.add('hide-suggestion-list');
        inputBox.value ="";
        const result = await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=f227a303`);
        const movieDetails = await result.json();
        displayMovieDetails(movieDetails);
        // console.log(movieDetails);
       })
    })
}

// function to diaplay movie details
function displayMovieDetails(details){
   allresult.innerHTML = `
   <div class="poster">
   <img src="${(details.Poster !== "N/A") ? details.Poster : `https://www2.brockport.edu/live/resource/image/_resources/images/directory_index_default.rev.1649271413.png`}" alt="The Flash image">
  </div>
  
  
  <div class="descreption">
      <div class="head">
          <h3 class="movie-name">${details.Title}</h3>
          <div class="heart-icon">
             <i class="fa-solid fa-heart"></i>
          </div>
      </div>
      <div class=" detailed-info">
          <div class="yr-rat-rel arrange">
              <div class="date-year arrange">
              <h4>Year:</h4>
              <p>${details.Year}</p>
          </div>
          <div class="heading-and-rating arrange">    
              <h4 class="rating-h"><i class="fa-solid fa-star" style="color: #f9fd17;"></i> Ratings:</h4>
              <p class="ratings">${details.imdbRating}</p>
          </div>
          <div class="release-date-details arrange">
              <h4 class="release-h">Released:</h4>
              <p class="released">${details.Released}</p>
          </div>
          </div>    
          <div class="genere arrange">
              <h4 class="genere-name">Genere:</h4>
              <p>${details.Genre}</p>
          </div>
          <div class="writer arrange">
              <h4 class="writer-name">Writer: </h4>
              <p class="write-name">${details.Writer}</p>
          </div>
          <div class="actors arrange">
              <h4 class="actor-names">Actor:</h4>
              <p class="Actors-all-names">${details.Actors}</p>
          </div>

          <div class="paragraph arrange">
              <h4 class="plot-details">Plot:</h4>
              <p class="Plot-para">${details.Plot}</p>
          </div>

          <div class="language arrange">
           <h4 class="language-h"> <i> Language: </i></h4>
           <p class="lang-details"> <i>${details.Language}</i></p>
          </div>

      </div>
  </div> 
   `;

  //  lets make heart icon working and also add movies to fav section 
   const heartIcon = allresult.querySelector(".heart-icon");
   const isFavorite = isMovieFavorite(details);
   toggleHeartIcon(heartIcon.querySelector("i.fa-heart"), isFavorite);
   heartIcon.addEventListener("click", () => {
    const isFavorite = isMovieFavorite(details);
    if (!isFavorite) {
        addToFavorites(details);
        toggleHeartIcon(heartIcon.querySelector("i.fa-heart"), true);
        addToFavoritesUI(details);
      } else {
        removeFromFavorites(details);
        toggleHeartIcon(heartIcon.querySelector("i.fa-heart"), false);
        removeFromFavoritesUI(details);
      }
   });
}
 

// Toggle heart icon
function toggleHeartIcon(icon, isFavorite) {
    icon.classList.toggle('red-heart', isFavorite);
  }

// Check if a movie is already a favorite
function isMovieFavorite(details) {
    const favorites = getFavorites();
    if (favorites) {
      return favorites.some(movie => movie.imdbID === details.imdbID);
    }
    return false;
  }

  // Get favorites from local storage
function getFavorites() {
    const favorites = localStorage.getItem('favorites');
    return JSON.parse(favorites);
  }

  // Add movie to favorites
function addToFavorites(details) {
    let favorites = getFavorites();
  
    if (!favorites) {
      favorites = [];
    }
  
    favorites.push(details);
    saveFavorites(favorites);
  }

  // Save favorites to local storage
    function saveFavorites(favorites) {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }

  // Add favorite movie to the UI
 function addToFavoritesUI(details) {
    const newDiv = document.createElement('div');
    newDiv.classList.add("favourite-wrapper");
  
    const moviePoster = details.Poster !== "N/A" ? details.Poster : "https://www2.brockport.edu/live/resource/image/_resources/images/directory_index_default.rev.1649271413.png";
    
    newDiv.innerHTML = `
      <div class="f-image">
        <img src="${moviePoster}" alt="${details.Title} image">
      </div>
      <div class="name-year-icon-f">
        <div class="name-year-tag-f">
          <h3>${details.Title}</h3>
          <p>${details.Year}</p>
        </div>
        <div class="cross-icon">
        <i class="fa-solid fa-xmark" style="color: #f50000;"></i>
        </div>
      </div>
    `;
    favContentItems.appendChild(newDiv);

      // Add click event listener to the "fa-xmark" icon
      const xmarkIcon = newDiv.querySelector(".cross-icon");
      // console.log("Clicked on the xmark icon");
      // console.log(xmarkIcon);
      xmarkIcon.addEventListener("click", () => {
        console.log("Clicked on the xmark icon");
        removeFromFavorites(details);
        newDiv.remove();
      });
  }
 
  // Remove movie from favorites
function removeFromFavorites(details) {
    let favorites = getFavorites();
  
    if (!favorites) {
      return;
    }
  
    favorites = favorites.filter(movie => movie.imdbID !== details.imdbID);
    saveFavorites(favorites);
  }

  // Remove favorite movie from the UI
function removeFromFavoritesUI(details) {
    const favoriteWrappers = favContentItems.querySelectorAll(".favourite-wrapper");
    favoriteWrappers.forEach(wrapper => {
      if (wrapper.querySelector("h3").textContent.trim() === details.Title.trim()) {
        wrapper.remove();
      }
    });
  }



// Load favorites from local storage and display
function loadFavorites() {
  const favorites = getFavorites();
  if (favorites) {
    favorites.forEach(movie => {
      addToFavoritesUI(movie);
    });
  }
}

// Event listener for the window load event
window.addEventListener('load', () => {
    loadFavorites();
  });

  // click anywhere on screen and suggestion list will get hidden
  window.addEventListener('click', (event) =>{
    if(event.target.className !== "search-list"){
        searchList.classList.add('hide-suggestion-list');
    }
})









