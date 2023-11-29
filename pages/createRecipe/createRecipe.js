import { API_URL } from "./../../settings.js"
import { handleHttpErrors, makeOptions, sanitizer } from "./../../utility.js"

const URL = API_URL + "/recipes"
var recipeInput = "";


export async function initCreateRecipe(){   
    
    showSpinner(); // Show the spinner while data is being loaded
}
//START OF recipes-overview.js
var maxFields = 5;
var currentFields = 1;

var addButton = document.querySelector('.inputFieldButton');
var removeButton = document.querySelector('.removeFieldButton');

addButton.addEventListener('click', function () {
    if (currentFields < maxFields) {
        addIngredientField();
        currentFields++;
    } else {
        alert('You can only add up to 5 ingredients.');
    }
});
removeButton.addEventListener('click', function () {
    if (currentFields > 1) {
        removeIngredientField();
        currentFields--;
    } else {
        alert('You must have at least one ingredient.');
    }
});
function addIngredientField() {
    var ingredientFields = document.getElementById('ingredientFields');

    var newInputGroup = document.createElement('div');
    newInputGroup.className = 'input-group mb-3';

    var newInput = document.createElement('input');
    newInput.className = 'form-control form-control-lg';
    newInput.type = 'text';
    newInput.placeholder = 'Indtast ingrediens';
    newInput.setAttribute('aria-label', '.form-control-lg example');

    newInputGroup.appendChild(newInput);
    ingredientFields.appendChild(newInputGroup);
}
function removeIngredientField() {
    var ingredientFields = document.getElementById('ingredientFields');
    ingredientFields.removeChild(ingredientFields.lastElementChild);
}


//THIS NEEDS TO BE REPLACED SOMEHOW TO REDIRECT ON CLICK WITH "ingredients" as a parameter

document.querySelector('#createRecipeButton').addEventListener('click', function () {
    document.querySelector('#AI-box').style.display = "block";
    fetchRecipeAdmin(); 
    var closeButton = document.querySelector('#recipeCreateModal [data-bs-dismiss="modal"]');
    closeButton.click();
    document.querySelector('#admin-recipe-create').style.display = "none";
});
//END OF recipes-overview.js


// THIS GOES INTO createRecipe.js
async function fetchRecipeAdmin(){
    document.querySelector('#temptext').innerHTML = "Vent et øjeblik mens vi laver din opskrift!"
    document.querySelector(".recipe-container").innerHTML = ""
    
    // Data from inputfields
    const ingredientsInputs = document.querySelectorAll('#ingredientFields input');
    let ingredients = Array.from(ingredientsInputs).map(input => input.value).join(', ');
    console.log(ingredients);


    const data = await fetch(URL, makeOptions("POST", ingredients, true)).then(r =>handleHttpErrors(r))

    hideSpinner(); 
    document.querySelector('#temptext').innerHTML = "Her er din nye opskrift!"
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

