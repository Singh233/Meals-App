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

// function to show toast
function showToast(message) {

    // get screen width
    let screenWidth = window.screen.availWidth;

    // set toast position
    let gravity = 'bottom';
    let position = 'right';
    if (screenWidth < 768) {
        gravity = 'top';
        position = 'center';
    }

    // show toast
    Toastify({
        text: message,
        duration: 3000,
        destination: "",
        newWindow: true,
        close: true,
        gravity: gravity, // `top` or `bottom`
        position: position, // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: 'rgba(0, 0, 0, 0.375)',
            webkitBackdropFilter: 'blur(15px)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(187, 187, 187, 0.187)',
            borderRadius: '10px',
        },
        offset: {
            x: 20, // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: 20 // vertical axis - can be a number or a string indicating unity. eg: '2em'
        },
        // avatar: "./img/logo.png",
        onClick: function(){} // Callback after click
    }).showToast();
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
        let count = 0;

        data.meals.forEach((meal) => {

            const card = document.createElement('div');

            const isFavorite = checkIfFavourite(meal.idMeal);

            card.innerHTML = `
                <div class="card animate__animated animate__fadeIn">
                    <div class="card-img">
                        <img src="${meal.strMealThumb}" alt="">
                    </div>

                    <div class="card-header">
                        <p>${meal.strMeal.length >= 16 ? meal.strMeal.substring(0, 8) + '..'
                            : meal.strMeal.length > 10 && meal.strCategory.length > 10 ? 
                            meal.strMeal.substring(0, 8) + '..' : meal.strMeal}</p>
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
                        <i id='like-${meal.idMeal}' onclick="addRemoveFavourites(${meal.idMeal}, 'cardDetail')" class="${isFavorite ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                        
                    </div>
                </div>
            `;
            setTimeout(() => {
                cardsContainer.appendChild(card);
            }, count);
            count += 200;
        });
    });
}




// function to display meal details
function getMealDetails(mealId) {

    // add background overlay
    const overlay = document.getElementsByClassName('background-overlay')[0];
    overlay.classList.remove('remove');

    overlay.classList.remove('animate__fadeOut');
    overlay.classList.add('animate__fadeIn');


    const url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    const bodyContainer = document.querySelector('body');
    console.log(mealId);
    fetchMealFromApi(url, mealId)
    .then((data) => {
        let meal = data.meals[0];

        const isFavorite = checkIfFavourite(meal.idMeal);

        console.log(meal)
        const card = document.createElement('div');
            card.innerHTML = `
                <div class="meal-details animate__animated animate__faster animate__fadeIn">
                        <i onclick="closeMealDetails()" class="fa-solid fa-xmark close-button"></i>

                        <div class="meal-img">
                            <img src="${meal.strMealThumb}" alt="">
                        </div>
                    <div class="wrapper">
                        
                
                        <div class="meal-header">
                            <p>${meal.strMeal}</p>
                            <p class="slash">/</p>
                            <p>${meal.strCategory}</p>
                        </div>
                
                        <div class="meal-info">
                            <p class="area"><i class="fa-solid fa-earth-americas"></i> ${meal.strArea}</p>
                            <p class="tags"><i class="fa-solid fa-tags"></i> ${meal.strTags}</p>
                        </div>
                
                        <div class="meal-info-nav">
                            <p onclick='showIngredients()' class='ingredients'>Ingredients</p>
                            <p onclick='showInstructions()' class='recipe active'>Recipe</p>
                        </div>
                
                        <div class="ingredients-list hide">
                            <div class='ingredient'>
                                <img src='https://www.themealdb.com/images/ingredients/${meal.strIngredient1}-small.png' />
                                <p>${meal.strIngredient1}</p>
                            </div>

                            <div class='ingredient'>
                                <img src='https://www.themealdb.com/images/ingredients/${meal.strIngredient2}-small.png' />
                                <p>${meal.strIngredient2}</p>
                            </div>

                            <div class='ingredient'>
                                <img src='https://www.themealdb.com/images/ingredients/${meal.strIngredient3}-small.png' />
                                <p>${meal.strIngredient3}</p>
                            </div>

                            <div class='ingredient'>
                                <img src='https://www.themealdb.com/images/ingredients/${meal.strIngredient4}-small.png' />
                                <p>${meal.strIngredient4}</p>
                            </div>

                            <div class='ingredient'>
                                <img src='https://www.themealdb.com/images/ingredients/${meal.strIngredient5}-small.png' />
                                <p>${meal.strIngredient5}</p>
                            </div>
                            
                        </div>
                
                        <div class="recipe-info ">
                            <p>${meal.strInstructions}</p>
                            
                        </div>
                        
                        
                    </div>
                    <div class="meal-footer">
                        <a href='${meal.strYoutube}' target="_blank"><i class="fa-brands fa-youtube"></i> Watch on Youtube</a>
                        <i id='like-details-${meal.idMeal}' onclick="addRemoveFavourites(${meal.idMeal}, 'mealDetails')" class="${isFavorite ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                        
                    </div>
                    
                </div>
            `;
        bodyContainer.appendChild(card);
    });

}

// function to close meal details 
function closeMealDetails() {
    const overlay = document.getElementsByClassName('background-overlay')[0];
    const mealDetails = document.getElementsByClassName('meal-details')[0];

    mealDetails.classList.remove('animate__fadeIn');
    mealDetails.classList.add('animate__fadeOut');

    overlay.classList.remove('animate__fadeIn');
    overlay.classList.add('animate__fadeOut');

    setTimeout(() => {
        mealDetails.remove();
        overlay.classList.add('remove');
    }, 700);


}





// function to show favorites list
function showFavorites() {
    const favoritesContainer = document.getElementsByClassName('favorites-container')[0];
    favoritesContainer.classList.remove('remove');
    favoritesContainer.classList.remove('animate__fadeOut');
    favoritesContainer.classList.add('animate__fadeIn');

    // add background overlay
    const overlay = document.getElementsByClassName('background-overlay')[0];
    overlay.classList.remove('remove');

    overlay.classList.remove('animate__fadeOut');
    overlay.classList.add('animate__fadeIn');

    // get the array from local storage
    const arr = JSON.parse(localStorage.getItem("favouritesList"));
    const url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let div = '';
    div += `
    <i onclick="hideFavorites()" class="fa-solid fa-xmark close-button"></i>
    <div class="favorites-header">
        <p> <i class="fa-solid fa-heart"></i> Favorites</p>
    </div>
    `;

    if (arr.length == 0) {
        div += `
        <div class="no-favorites animate__animated animate__fadeIn">
            <p><i class="fa-solid fa-face-frown"></i> No favorites to show!</p>
        </div>
        `;
        favoritesContainer.innerHTML = div;

    } else {
        arr.forEach((mealId) => {
            fetchMealFromApi(url, mealId)
            .then((data) => {
                let meal = data.meals[0];
                
                div += `
                <div class="card animate__animated animate__fadeIn">
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
                        <i id='like-${meal.idMeal}' onclick="addRemoveFavourites(${meal.idMeal}, 'favorites')" class="fa-solid fa-heart animate__animated"></i>
                        
                    </div>
                </div>
                `;

                favoritesContainer.innerHTML = div;

            });

        });
    }

}

// function to hide favorites list
function hideFavorites() {
    const favoritesContainer = document.getElementsByClassName('favorites-container')[0];
    // add background overlay
    const overlay = document.getElementsByClassName('background-overlay')[0];

    favoritesContainer.classList.add('animate__fadeOut');
    favoritesContainer.classList.remove('animate__fadeIn');

    overlay.classList.add('animate__fadeOut');
    overlay.classList.remove('animate__fadeIn');





    setTimeout(() => {
        favoritesContainer.classList.add('remove');
        overlay.classList.add('remove');

    }, 700);
    
}







// function to add or remove from favorites array
function addRemoveFavourites(mealId, from) {
    // get the array from local storage
    const arr = JSON.parse(localStorage.getItem("favouritesList"));
    let isRemoved = false;

    // check if the array is empty
    if (arr.length == 0) {
        // add the meal id to the array
        arr.push(mealId);
        showToast('Added to favorites');

    } else {
        // check if the meal id is already in the array
        if (arr.includes(mealId)) {
            // remove the meal id from the array
            arr.splice(arr.indexOf(mealId), 1);
            isRemoved = true;
            showToast('Removed from favorites');

        } else {
            // add the meal id to the array
            arr.push(mealId);
            showToast('Added to favorites');

        }
    }

    // save the array to local storage
    localStorage.setItem("favouritesList", JSON.stringify(arr));

console.log(from)
console.log(mealId)
    // change the like icon of the cards list
    const heartIcon = document.getElementById(`like-${mealId}`);
    if (heartIcon.classList.contains('fa-regular')) {
        heartIcon.classList.remove('fa-regular');
        heartIcon.classList.add('fa-solid');

        // animate the like icon
        heartIcon.classList.remove('animate__bounceIn');
        setTimeout(() => {
            heartIcon.classList.add('animate__bounceIn');
        }, 1);
    } else {
        heartIcon.classList.remove('fa-solid');
        heartIcon.classList.add('fa-regular');

        // animate the like icon
        heartIcon.classList.remove('animate__bounceIn');
        setTimeout(() => {
            heartIcon.classList.add('animate__bounceIn');
        }, 1);    
    }

    // change the like icon of the details page 
    if (from == 'mealDetails') {
        const heartIconDetails = document.getElementById(`like-details-${mealId}`);
        if (heartIconDetails.classList.contains('fa-regular')) {
            heartIconDetails.classList.remove('fa-regular');
            heartIconDetails.classList.add('fa-solid');

            // animate the like icon
            heartIconDetails.classList.remove('animate__bounceIn');
            setTimeout(() => {
                heartIconDetails.classList.add('animate__bounceIn');
            }, 1);


        } else {
            heartIconDetails.classList.remove('fa-solid');
            heartIconDetails.classList.add('fa-regular');

            // animate the like icon
            heartIconDetails.classList.remove('animate__bounceIn');
            setTimeout(() => {
                heartIconDetails.classList.add('animate__bounceIn');
            }, 1); 
            
        }
    }
    


    const favoritesContainer = document.getElementsByClassName('favorites-container')[0];
    ;
    if (!favoritesContainer.classList.contains('remove') && isRemoved) {
        showFavorites();
    }

}




// function to check if the meal is in the favorites array
function checkIfFavourite(mealId) {
    // get the array from local storage
    const arr = JSON.parse(localStorage.getItem("favouritesList"));
    console.log(arr, parseInt(mealId));
    if (arr.includes(parseInt(mealId))) {
        return true;
    }
    return false;
}



// show ingredients
function showIngredients(meal) {
    const ingredientsInfo = document.getElementsByClassName('ingredients-list')[0];
    const recipeInfo = document.getElementsByClassName('recipe-info')[0];
    const ingredientsButton = document.getElementsByClassName('ingredients')[0];
    const recipeButton = document.getElementsByClassName('recipe')[0];


    recipeInfo.classList.add('hide');
    ingredientsInfo.classList.remove('hide');

    ingredientsButton.classList.add('active');
    recipeButton.classList.remove('active');


}

// show instructions 
function showInstructions(meal) {
    const ingredientsInfo = document.getElementsByClassName('ingredients-list')[0];
    const recipeInfo = document.getElementsByClassName('recipe-info')[0];

    const ingredientsButton = document.getElementsByClassName('ingredients')[0];
    const recipeButton = document.getElementsByClassName('recipe')[0];

    recipeInfo.classList.remove('hide');
    ingredientsInfo.classList.add('hide');


    ingredientsButton.classList.remove('active');
    recipeButton.classList.add('active');

}






// function to toggle menu on small devices
function toggleMenu() {
    const menuExpand = document.getElementsByClassName('menu-expand')[0];
    const menuIcon = document.getElementsByClassName('menu-icon')[0];
    

    if (menuExpand.classList.contains('hide-menu')) {
        menuExpand.classList.toggle('hide-menu');

        menuExpand.classList.add('animate__slideInDown');
        menuExpand.classList.remove('animate__slideOutUp');

        menuIcon.classList.remove('animate__rotateIn');
        menuIcon.classList.remove('animate__rotateOut');

        menuIcon.classList.add('animate__rotateIn');

        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-xmark');

    } else {
        
        menuExpand.classList.add('animate__slideOutUp');
        menuExpand.classList.remove('animate__slideInDown');


        menuIcon.classList.add('animate__rotateOut');


        setTimeout(() => {
            menuIcon.classList.remove('animate__rotateOut');
            menuIcon.classList.remove('animate__rotateIn');


            menuExpand.classList.toggle('hide-menu');
            menuIcon.classList.remove('fa-xmark');

        menuIcon.classList.add('fa-bars');
        }, 500);
    }
}



let isChanged = false;



const handleScroll = event => {
    const searchBar = document.getElementById('search-bar1');
    const dummySearchBar = document.getElementById('dummy-space');
    const navBar = document.getElementsByClassName('sm-navbar')[0];


    if (window.scrollY >= 0 && window.scrollY <= 199) {

        if (searchBar.classList.contains('search-bar2')) {
            searchBar.classList.add('animate__fadeOut');
            searchBar.classList.remove('animate__fadeIn');

            // navBar.classList.remove('blur-bg');

            setTimeout(() => {
                searchBar.classList.remove('search-bar2');
                searchBar.classList.add('animate__fadeIn');
                searchBar.classList.remove('animate__fadeOut');
                dummySearchBar.classList.add('hide');

            }, 500);

            isChanged = false;
        }

    } else if (window.scrollY > 200) {
        if (!isChanged) {
            searchBar.classList.add('animate__fadeOut');
            searchBar.classList.remove('animate__fadeIn');

            setTimeout(() => {
                searchBar.classList.add('search-bar2');
                searchBar.classList.add('animate__fadeIn');
                searchBar.classList.remove('animate__fadeOut');
                dummySearchBar.classList.remove('hide');

            }, 500);

            // navBar.classList.add('blur-bg');


            isChanged = true;
        }
        
    } 
    
};

window.addEventListener('scroll', handleScroll);