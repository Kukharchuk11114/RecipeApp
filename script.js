const meals = document.getElementById("meals");

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
    const meals = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + term)
}
function addMeal(mealData, random) {
    console.log(mealData);
    const meal = document.createElement("div");
    meal.classList.add("meal");

    meal.innerHTML = `   
    <div class="meal-header">
    ${random ? `<span class="random">Random recipe </span>` : ' '}
        <img 
            src="${mealData.strMealThumb}"
            alt="${mealData.strMeal}"
            />
    </div>
    <div class="meal-body">
        <h4>${mealData.strMeal}</h4>
        <button id="like" class="meal-btn">
        <i class="fas fa-heart"></i>                      
        </button>
    </div>
        `
        meals.appendChild(meal);
        const btn = meal.querySelector(".meal-body .meal-btn");

        btn.addEventListener("click", () => {   
            if(btn.classList.contains("active")){
                removeMealFromLS(mealData.idMeal)
                btn.classList.remove("active");
            }else{
                addMealToLS(mealData.idMeal)
                btn.classList.add("active");
            }
        });
}

function addMealToLS(mealId){
    const mealIds = getMealFromLS();
    localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}

function removeMealFromLS(mealId){
    const mealIds = getMealFromLS();

    localStorage.setItem("mealIds", JSON.stringify(mealIds.filter(id => id!==mealId)));

}

function getMealFromLS(mealId){
    const mealIds = JSON.parse(localStorage.getItem("mealIds"));

    return mealIds === null ? [] : mealIds;

}  
async function fetchFavMeals(){
    const mealIds = getMealFromLS();
    const meals = [];
    for (let i=0; i<mealIds.length; i++){
        const mealId = mealIds[i];
        meal =await getMealById(mealId);
        meals.push(meal);
        }
        console.log(meals);
}  
