import { API_URL } from "../../settings.js"
import { handleHttpErrors, makeOptions, sanitizer } from "../../utility.js"
import { ingredients } from "../recipes-overview/recipes-overview.js";
const URL = API_URL + "/recipes"
// export let ingredients = "";

export async function initCreateRecipe(){   
    fetchRecipeAdmin(ingredients);
    showSpinner(); 
}


// THIS GOES INTO createRecipe.js REDO THIS TO ACCEPT INGREDIENTS AS A PARAMETER
async function fetchRecipeAdmin(ingredients){
    document.querySelector('#temptext').innerHTML = "Vent et øjeblik mens vi laver din opskrift!"
    document.querySelector(".recipe-container").innerHTML = ""
    const saveButtonRecipe = document.querySelector('#save-button-recipe');
    console.log("til API: " +ingredients);
    // // Data from inputfields
    // const ingredientsInputs = document.querySelectorAll('#ingredientFields input');
    // ingredients = Array.from(ingredientsInputs).map(input => input.value).join(', ');
    // console.log(ingredients);
    
    
    const data = await fetch(URL, makeOptions("POST", ingredients, true)).then(r =>handleHttpErrors(r))
    
    hideSpinner(); 
    document.querySelector('#temptext').innerHTML = "Her er din nye opskrift!"
    document.querySelector(".recipe-container").innerHTML = sanitizer(data.answer)
    
    var divChecker = document.querySelector(".recipe-container");
    var containsH3 = divChecker.querySelector("h3") !== null;
    if(containsH3){
        saveButtonRecipe.style.display = "block";
    }
    document.querySelector('#recipe-modal-head').innerHTML = "<h5>" + document.querySelector('#recipe-heading').innerHTML +"</h5>"
    document.querySelector('#input-field-recipe').value = document.querySelector('#recipe-heading').innerHTML;
    
    const recipeRequest = {
        "recipeTitle": document.querySelector('#input-field-recipe').value,
        "recipeIngredients": ingredients.toString(),
        "recipeBody": data.answer    
    }
    document.querySelector('#save-recipe-db').addEventListener('click', () => saveRecipe(recipeRequest))
    
}    
function showSpinner() {
        var spinner = document.getElementById("spinner");
        spinner.style.display = "block";
    }
    
    function hideSpinner() {
        var spinner = document.getElementById("spinner");
        spinner.style.display = "none";
    }
    
  
    function saveRecipe(recipeRequest){
        fetch(URL+"/admin", makeOptions("POST", recipeRequest, true)).then(r =>handleHttpErrors(r))
        document.querySelector('#inside-close').click()
        router.navigate("/recipes-overview")

        // //START OF recipes-overview.js
        // var maxFields = 5;
        // var currentFields = 1;
        
        // var addButton = document.querySelector('.inputFieldButton');
        // var removeButton = document.querySelector('.removeFieldButton');
        
        // addButton.addEventListener('click', function () {
        //     if (currentFields < maxFields) {
        //         addIngredientField();
        //         currentFields++;
        //     } else {
        //         alert('You can only add up to 5 ingredients.');
        //     }
        // });
        // removeButton.addEventListener('click', function () {
        //     if (currentFields > 1) {
        //         removeIngredientField();
        //         currentFields--;
        //     } else {
        //         alert('You must have at least one ingredient.');
        //     }
        // });
        // function addIngredientField() {
        //     var ingredientFields = document.getElementById('ingredientFields');
        
        //     var newInputGroup = document.createElement('div');
        //     newInputGroup.className = 'input-group mb-3';
        
        //     var newInput = document.createElement('input');
        //     newInput.className = 'form-control form-control-lg';
        //     newInput.type = 'text';
        //     newInput.placeholder = 'Indtast ingrediens';
        //     newInput.setAttribute('aria-label', '.form-control-lg example');
        
        //     newInputGroup.appendChild(newInput);
        //     ingredientFields.appendChild(newInputGroup);
        // }
        // function removeIngredientField() {
        //     var ingredientFields = document.getElementById('ingredientFields');
        //     ingredientFields.removeChild(ingredientFields.lastElementChild);
        // }
        
        
        // //THIS NEEDS TO BE REPLACED SOMEHOW TO REDIRECT ON CLICK WITH "ingredients" as a parameter
        
        // document.querySelector('#createRecipeButton').addEventListener('click', function () {
        //     document.querySelector('#AI-box').style.display = "block";
        //     fetchRecipeAdmin(); 
        //     var closeButton = document.querySelector('#recipeCreateModal [data-bs-dismiss="modal"]');
        //     closeButton.click();
        //     document.querySelector('#admin-recipe-create').style.display = "none";
        // });
        // //END OF recipes-overview.js
    }