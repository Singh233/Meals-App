// To make a favourites meal array if it doesn't exist in local storage
if (localStorage.getItem("favouritesList") == null) {
    localStorage.setItem("favouritesList", JSON.stringify([]));
    console.log(localStorage.getItem("favouritesList"));
}

// fetch data from api and return it
async function fetchMealFromApi(url,value) {
    const response=await fetch(`${url+value}`);
    const meal=await response.json();
    return meal;
}




// function to display meals on typing in search bar
function getList() {
    const mainContainer = document.getElementsByClassName('main-container')[0];
    const searchValue = document.getElementById('search-input').value;
    const url = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
    fetchMealFromApi(url, searchValue)
    .then((data) => {
        console.log(data);
        const cardsContainer = document.getElementById('cards-container');
        mainContainer.classList.remove('center-main');
        cardsContainer.innerHTML='';
        data.meals.forEach((meal) => {
            const card = document.createElement('div');
            card.innerHTML = `
                <div class="card">
                    <div class="card-img">
                        <!-- <div class="shape"></div> -->
                        <img src="${meal.strMealThumb}" alt="">
                    </div>

                    <div class="card-header">
                        <p>${meal.strMeal.length}</p>
                        <p class="slash">/</p>
                        <p>${meal.strCategory}</p>
                    </div>

                    <div class="shape"></div>

                    <div class="card-info">
                        <p class="area"><i class="fa-solid fa-earth-americas"></i> ${meal.strArea}</p>
                        <p class="tags"><i class="fa-solid fa-tags"></i> ${meal.strTags}</p>
                    </div>
                    
                    <div class="card-footer">
                        <p onclick='getMealDetails(${meal.idMeal})'>See Details </p>
                        <i class="fa-regular fa-heart"></i>
                        
                    </div>
                </div>
            `;
            
            cardsContainer.appendChild(card);
        });
    });
}




// function to display meal details
function getMealDetails(mealId) {
    const url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    const bodyContainer = document.querySelector('body');
    console.log(mealId);
    fetchMealFromApi(url, mealId)
    .then((data) => {
        let meal = data.meals[0];
        console.log(meal)
        const card = document.createElement('div');
            card.innerHTML = `
                <div class="meal-details animate__animated animate__zoomIn">
                        <div class="meal-img">
                            <img src="${meal.strMealThumb}" alt="">
                        </div>
                    <div class="wrapper">
                        
                
                        <div class="meal-header">
                            <p>${meal.strMeal}</p>
                            <p class="slash">/</p>
                            <p>${meal.strCategory}</p>
                        </div>
                
                        
                
                        <div class="meal-info-nav">
                            <p>Ingredients</p>
                            <p>Recipe</p>
                        </div>
                
                        <div class="ingredients-list hide">
                            <p>${meal.strIngredient1}</p>
                            <p>${meal.strIngredient2}</p>
                            <p>${meal.strIngredient3}</p>
                            <p>${meal.strIngredient4}</p>
                            <p>${meal.strIngredient5}</p>
                        </div>
                
                        <div class="recipe-info ">
                            <p>${meal.strInstructions}</p>
                            
                        </div>
                        
                        
                    </div>
                    <div class="meal-footer">
                        <p><i class="fa-brands fa-youtube"></i> Watch on Youtube</p>
                        <i class="fa-regular fa-heart"></i>
                        
                    </div>
                    
                </div>
            `;
        bodyContainer.appendChild(card);
    });

}






const handleScroll = event => {
    const searchBar = document.getElementById('search-bar1');
    const navBar = document.getElementsByClassName(`nav-bar`)[0];

    if (window.scrollY <= 5) {

        

        navBar.classList.remove('navbar-scroll-effect');

        // cardsContainer.classList.add('');

        searchBar.classList.add('animate__fadeIn');
        searchBar.classList.remove('animate__fadeOut');
        
    } else if (window.scrollY > 50) {

        
        navBar.classList.add('navbar-scroll-effect');


        searchBar.classList.add('animate__fadeOut');
        searchBar.classList.remove('animate__fadeIn');


        
    }
    
};

window.addEventListener('scroll', handleScroll);