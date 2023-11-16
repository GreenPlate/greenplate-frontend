import { API_URL } from "./../../settings.js"
import { handleHttpErrors, makeOptions, sanitizeStringWithTableRows, sanitizer } from "./../../utility.js"

const URL = API_URL + "/recipes/limited"

export async function initFoodplan(match){
    const storeId = match.params.storeid    
    fetchRecipe(storeId)
    showSpinner(); // Show the spinner while data is being loaded
}

async function fetchRecipe(storeId){
    const data = await fetch(URL + "?storeId=" + storeId, makeOptions("GET", null, false)).then(r =>handleHttpErrors(r))
    
        var recipeText = data.answer;
        var lines = recipeText.split('\n');

        var htmlOutput = '<p>';
        lines.forEach(function(line) {
            if (line.trim() !== '') {
            var depth = line.split('  ').length - 1;
            htmlOutput += '&emsp;'.repeat(depth) + line.trim() + '<br>';
            }
        });
        htmlOutput += '</p>'
        hideSpinner(); // Hide the spinner when data is loaded
        document.querySelector(".card-text").innerHTML = sanitizer(htmlOutput)
        
    }
    function showSpinner() {
        var spinner = document.getElementById("spinner");
        spinner.style.display = "block";
    }
    
    function hideSpinner() {
        var spinner = document.getElementById("spinner");
        spinner.style.display = "none";
    }
