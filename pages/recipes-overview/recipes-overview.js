import { API_URL } from "./../../settings.js"

import { handleHttpErrors, makeOptions, sanitizeStringWithTableRows } from "./../../utility.js"

export async function initRecipesOverview(){
    console.log("initRecipesOverview()");

    await getRecipes()

}

async function getRecipes(){
    console.log("getRecipes()")
    
    // fetch recipes from database
    console.log(API_URL + "/recipes");
    const recipes = await fetch(API_URL + "/recipes/admin", makeOptions("GET", null, true)).then(r => handleHttpErrors(r));

console.log(recipes);

    // Map recipes to innerHTML
    const recipeRows = recipes.map(recipe => `
        <div class="custom-card mt-2">
            <div class="card-body">
                <h5 class="card-title">${recipe.recipeTitle}</h5>
                <h6 class="card-subtitle mb-2 text-body-secondary">${recipe.recipeIngredients}</h6>
                <p class="card-text">${recipe.recipeBody}<p>
                <button id="${recipe.id}_recipeid" href="#" class="card-link">Ændre opskrift</button>
                <button id="${recipe.id}_recipeid" href="#" class="card-link">Slet opskrift</button>
            </div>
        </div>
    `).join("");

    document.querySelector('#recipe-section').innerHTML = sanitizeStringWithTableRows(recipeRows);


    // Setup event listeners on change or delete buttons
    const buttons = document.querySelectorAll('.custom-card button');
    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            const recipeId = event.target.id.split('_')[0];
            const action = event.target.textContent.trim().toLowerCase(); // "Ændre opskrift" or "Slet opskrift"

            if (action === 'ændre opskrift') {
                // Handle change button click
                console.log(`Change recipe with ID ${recipeId}`);

                 // Find the selected recipe based on the recipeId
                 const selectedRecipe = recipes.find(recipe => recipe.id === parseInt(recipeId));

                // Populate the modal with recipe information
                document.getElementById('modal-recipe-id').value = selectedRecipe.id;
                document.getElementById('recipe-name').value = selectedRecipe.recipeTitle;
                document.getElementById('recipe-ingredients').value = selectedRecipe.recipeIngredients;
                document.getElementById('recipe-body').value = selectedRecipe.recipeBody;
 
                 // Open the modal
                const changeRecipeModal = new bootstrap.Modal(document.getElementById('changeRecipe'));
                changeRecipeModal.show();

            } else if (action === 'slet opskrift') {
                // Handle delete button click
                console.log(`Delete recipe with ID ${recipeId}`);

                // Find the selected recipe based on the recipeId
                const selectedRecipe = recipes.find(recipe => recipe.id === parseInt(recipeId));

                // Populate the modal with recipe information
                document.getElementById('modal-recipe-id').value = selectedRecipe.id;
                document.getElementById('recipe-name').value = selectedRecipe.recipeTitle;
                document.getElementById('recipe-ingredients').value = selectedRecipe.recipeIngredients;
                document.getElementById('recipe-body').value = selectedRecipe.recipeBody;

                // Open the modal
                const changeRecipeModal = new bootstrap.Modal(document.getElementById('deleteRecipe'));
                changeRecipeModal.show();



            }
        });
    });

    // Setup event listener for "Gem opskrift" button in the modal
    const saveButton = document.getElementById('save-recipe-button');
    saveButton.addEventListener('click', saveRecipe);

    // Setup event listener for "Slet opskrift" button in the modal
    const deleteButton = document.querySelector('#delete-recipe-button');
    deleteButton.addEventListener('click', deleteRecipe);
}


async function saveRecipe() {
    console.log("saveRecipe()")

    // Build JSON object
    const patchRecipe = {
        "id": document.querySelector('#modal-recipe-id').value,
        "recipeTitle": document.querySelector('#recipe-name').value,
        "recipeBody": document.querySelector('#recipe-body').value,
        "recipeIngredients": document.querySelector('#recipe-ingredients').value,
    };

    console.log(patchRecipe);

    const newRecipe = await fetch(API_URL + "/recipes/admin", makeOptions("PATCH", patchRecipe, true)).then(r => handleHttpErrors(r));

    console.log(newRecipe);
}

async function deleteRecipe() {
    console.log("deleteRecipe()");
    // Build JSON object
    
    const deleteRecipe = {
        "recipeId": document.querySelector('#modal-recipe-id').value,
        "recipeTitle": document.querySelector('#recipe-name').value,
        "recipeBody": document.querySelector('#recipe-body').value,
        "recipeIngredients": document.querySelector('#recipe-ingredients').value,
    };


}