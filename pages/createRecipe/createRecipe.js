import { API_URL } from "./../../settings.js"
import { handleHttpErrors, makeOptions, sanitizer } from "./../../utility.js"

const URL = API_URL + "/recipes"
var recipeInput = "";


export async function initCreateRecipe(){   
    
    showSpinner(); // Show the spinner while data is being loaded
}
document.querySelector('#createRecipeButton').addEventListener('click', function () {
    recipeInput = document.getElementById('recipeInput').value;
    document.querySelector('#AI-box').style.display = "block";
    fetchRecipe(recipeInput);
    var closeButton = document.querySelector('#recipeCreateModal [data-bs-dismiss="modal"]');
    closeButton.click();
    document.querySelector('#admin-recipe-create').style.display = "none";
});

async function fetchRecipe(recipeInput){
    
    document.querySelector('#temptextRecipe').innerHTML = "Vent et øjeblik mens vi laver din opskrift!"
    document.querySelector(".recipe-container").innerHTML = ""
    const ingredients = recipeInput;
    console.log(ingredients);
    const data = await fetch(URL, makeOptions("POST", ingredients, true)).then(r =>handleHttpErrors(r))


        hideSpinner(); // Hide the spinner when data is loaded
        document.querySelector('#temptextRecipe').innerHTML = "Her er din nye opskrift!"
        document.querySelector(".recipe-container").innerHTML = sanitizer(data.answer)
        
    }
    function showSpinner() {
        var spinner = document.getElementById("spinner");
        spinner.style.display = "block";
    }
    
    function hideSpinner() {
        var spinner = document.getElementById("spinner");
        spinner.style.display = "none";
    }

    document.addEventListener('DOMContentLoaded', function () {
        initCreateRecipe();
    });
