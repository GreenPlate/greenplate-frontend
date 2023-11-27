import { API_URL } from "./../../settings.js"
import { handleHttpErrors, makeOptions, sanitizeStringWithTableRows, sanitizer } from "./../../utility.js"
import { selectedCards } from "../offers/offers.js"

const URL = API_URL + "/recipes"

export async function initFoodplan(){   
    fetchRecipe(selectedCards)
    showSpinner(); // Show the spinner while data is being loaded
}

async function fetchRecipe(selectedCards){
    document.querySelector('#temptext').innerHTML = "Vent et øjeblik mens vi laver din opskrift!"
    document.querySelector(".recipe-container").innerHTML = ""
    console.log(selectedCards)
    const ingredients = selectedCardsToIngredients(selectedCards);
    console.log(ingredients);
    const data = await fetch(URL, makeOptions("POST", ingredients, true)).then(r =>handleHttpErrors(r))
        // var recipeText = data.answer;
        // var lines = recipeText.split('\n');
        // var htmlOutput = '';
        // lines.forEach(function(line) {
        //     if (line.trim() !== '') {
        //     var depth = line.split('  ').length - 1;
        //     htmlOutput += '&emsp;'.repeat(depth) + line.trim() + '<br>';
        //     }
        // });
        
        hideSpinner(); // Hide the spinner when data is loaded
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
    function selectedCardsToIngredients(selectedCards){
        const ingredients = selectedCards.map(card => card.product.description);
        return ingredients;
    }
    function saveRecipe(selectedCards){
        
    } 
