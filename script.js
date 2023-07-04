const mealsEL = document.getElementById("meals");
const favoriteContainer = document.getElementById("fav_meals");
const searchTerm = document.getElementById("search-term");
const serachBtn = document.getElementById("search");


getRandomMeal();
fetchFavMeals();




async function getRandomMeal() {
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    const respData = await resp.json();
    const randomMeal = respData.meals[0];

    addMeal(randomMeal, true);
}

async function getMealById(id) {
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id);
    const respData = await resp.json();
    const meal = respData.meals[0];
    return meal;

}

async function getMealBySearch(term) {
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + term);
    const respData = await resp.json();
    const meals = respData.meals;


    return meals;
}


function addMeal(mealData, random) {
    const meal = document.createElement("div");
    meal.classList.add("meal");

    meal.innerHTML = `   
    <div class="meal-header">
    ${random ? `<span class="random">Random recipe </span>` : ""}
        <img 
            src="${mealData.strMealThumb}"
            alt="${mealData.strMeal}"
            />
    </div>
    <div class="meal-body">
        <h4>${mealData.strMeal}</h4>
        <button class="meal-btn" id="like">
        <i class="fas fa-heart"></i>                      
        </button>
    </div>
    `;
    const btn = meal.querySelector(".meal-body .meal-btn");

    btn.addEventListener("click", () => {   
        if(btn.classList.contains("active")){
            removeMealLS(mealData.idMeal)
            btn.classList.remove("active");
        }else{
            addMealLS(mealData.idMeal)
            btn.classList.add("active");
        }

        fetchFavMeals();
        });

        mealsEL.appendChild(meal);
}

function addMealLS(mealId){
    const mealIds = getMealLS();
    localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}

function removeMealLS(mealId){
    const mealIds = getMealLS();

    localStorage.setItem("mealIds", JSON.stringify(mealIds.filter((id) => id!==mealId)));

}

function getMealLS(mealId){
    const mealIds = JSON.parse(localStorage.getItem("mealIds"));

    return mealIds === null ? [] : mealIds;

}  
async function fetchFavMeals(){
    // clean container
    favoriteContainer.innerHTML = "";

    const mealIds = getMealLS();

    for (let i=0; i<mealIds.length; i++){
        const mealId = mealIds[i];
        const meal = await getMealById(mealId);
        addMealToFav(meal);
        }
}  

function addMealToFav(mealData) {
    const favMeal = document.createElement("li");

    favMeal.innerHTML = `   
    <li>
    <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}"/>
    <span>${mealData.strMeal}</span>
    </li>
    <button class="clear"><i class="fa-solid fa-rectangle-xmark"></i></button>
    `;
    
    const btn = favMeal.querySelector(".clear");

    btn.addEventListener('click', () => {
        removeMealLS(mealData.idMeal);
        fetchFavMeals();
    });

    favoriteContainer.appendChild(favMeal);        
}

serachBtn.addEventListener("click", async () => {
    // clean the container
    mealsEL.innerHTML = '';
const search = searchTerm.value;

const meals = await getMealBySearch(search);
    if (meals) {
    meals.forEach((meal) => {
        addMeal(meal);
        });
    }
})
