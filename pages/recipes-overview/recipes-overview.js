import { handleHttpErrors, makeOptions, sanitizeStringWithTableRows } from "./../../utility.js"

export async function initRecipesOverview(){
    console.log("initRecipesOverview()");

    await getRecipes()

}

async function getRecipes(){
    console.log("getRecipes()")
    const recipes = [
        {
            "recipeTitle": "Spaghetti Bolognese",
            "recipeBody": "Classic Italian pasta dish with a rich meat sauce.",
            "recipeIngredients": "500g ground beef, 1 onion, 2 cloves garlic, 1 can crushed tomatoes, 1 tsp oregano, 2 tbsp tomato paste, salt, pepper, 400g spaghetti"
        },
        {
            "recipeTitle": "Chicken Caesar Salad",
            "recipeBody": "A refreshing salad with grilled chicken and Caesar dressing.",
            "recipeIngredients": "2 boneless chicken breasts, Romaine lettuce, croutons, Parmesan cheese, Caesar dressing"
        },
        {
            "recipeTitle": "Vegetarian Stir Fry",
            "recipeBody": "Quick and healthy stir-fried vegetables with tofu.",
            "recipeIngredients": "1 block tofu, broccoli, bell peppers, carrots, soy sauce, ginger, garlic, sesame oil"
        },
        {
            "recipeTitle": "Mango Avocado Salsa",
            "recipeBody": "A fruity salsa with a hint of spice.",
            "recipeIngredients": "2 ripe mangoes, 2 avocados, red onion, cilantro, lime juice, jalapeño, salt"
        },
        {
            "recipeTitle": "Shrimp Scampi Pasta",
            "recipeBody": "Garlicky shrimp served over a bed of linguine.",
            "recipeIngredients": "250g linguine, 1 lb shrimp, garlic, white wine, lemon juice, parsley, salt, pepper"
        },
        {
            "recipeTitle": "Caprese Salad",
            "recipeBody": "Simple and classic Italian salad with fresh tomatoes, mozzarella, and basil.",
            "recipeIngredients": "Tomatoes, fresh mozzarella, fresh basil, balsamic glaze, olive oil, salt, pepper"
        },
        {
            "recipeTitle": "BBQ Chicken Pizza",
            "recipeBody": "Homemade pizza topped with BBQ chicken, red onions, and cilantro.",
            "recipeIngredients": "Pizza dough, cooked chicken, BBQ sauce, red onion, cilantro, mozzarella cheese"
        },
        {
            "recipeTitle": "Quinoa Salad with Roasted Vegetables",
            "recipeBody": "Healthy and hearty salad with quinoa, roasted veggies, and a lemon vinaigrette.",
            "recipeIngredients": "Quinoa, cherry tomatoes, bell peppers, zucchini, red onion, olive oil, lemon juice, feta cheese"
        },
        {
            "recipeTitle": "Beef and Broccoli Stir Fry",
            "recipeBody": "Quick and flavorful stir fry with tender beef and crisp broccoli.",
            "recipeIngredients": "500g beef sirloin, broccoli, soy sauce, ginger, garlic, sesame oil, rice vinegar"
        },
        {
            "recipeTitle": "Chocolate Banana Smoothie",
            "recipeBody": "A delicious and indulgent smoothie with chocolate and banana.",
            "recipeIngredients": "2 ripe bananas, milk, chocolate protein powder, peanut butter, ice cubes"
        },
    ];

    const recipeRows = recipes.map(recipe => `
        <div class="custom-card mt-2">
            <div class="card-body">
                <h5 class="card-title">${recipe.recipeTitle}</h5>
                <h6 class="card-subtitle mb-2 text-body-secondary">${recipe.recipeIngredients}</h6>
                <p class="card-text">${recipe.recipeBody}<p>
                <a href="#" class="card-link">Ændre opskrift</a>
                <a href="#" class="card-link">Slet opskrift</a>
            </div>
        </div>
    `).join("");
    document.querySelector('#recipe-section').innerHTML = sanitizeStringWithTableRows(recipeRows);



}


