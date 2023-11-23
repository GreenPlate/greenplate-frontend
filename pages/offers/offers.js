//jeg har match objektet med - hvordan skal bruges i forhold til fx storeID
import {API_URL} from "../../settings.js"
import { handleHttpErrors, makeOptions, sanitizeStringWithTableRows } from "./../../utility.js"
const URL=API_URL+"/stores/foodwaste"
let selectedCards = [];

export async function initOffers(match){
    const storeId = match.params.storeid;
    await getOffers(storeId);
}
async function getOffers(id) {
    document.querySelector("#offer-cards").style.visibility = "visible"
    const offers= await fetch(URL+"?id="+id,makeOptions("GET", null, false)).then(r =>handleHttpErrors(r))
    const clearances = offers[0].clearances;
    const offersRow = clearances.map(clearance => {
        // Check if the image source is null or empty
        const imgSrc = clearance.product.image ? clearance.product.image : '../../images/PlaceholderProductImage.jpg';

        return `
            <div class="card mx-2 mt-2 d-flex align-items-center  justify-content-center shadow-sm p-3 mb-5 bg-body-tertiary rounded" style="width: 18rem">
                <div class="col-md-4 d-flex align-items-center  justify-content-center">
                    <img src="${imgSrc}" class="card-img-top" onerror="this.src='../../images/PlaceholderProductImage.jpg';" style="width: 17rem; height: 150px; overflow: ignore;">
                </div>    
                <div class="card-body">
                    <div class="h-25">
                        <h5 class="card-title">${clearance.product.description}</h5>
                    </div>
                    <p class="card-text"> original pris: ${clearance.offer.originalPrice} <br>
                        ny pris: ${clearance.offer.newPrice} <br>
                        rabat: ${clearance.offer.discount} <br>
                        ${clearance.product.ean}
                    </p>
                    
                    <div class="form-check form-check-reverse ">
                        <label class="form-check-label p-2" for="reverseCheck1"><p>Vælg vare </p></label>
                        <input class="form-check-input" type="checkbox" value="" id="reverseCheck1" style="height:30px; width:30px;">
                    </div>
                </div>

            </div>
       
  
</div>`
    
}).join("");
    document.querySelector("#offer-cards").innerHTML=sanitizeStringWithTableRows(offersRow);
    document.querySelectorAll(".form-check-input").forEach(checkbox => {
        checkbox.addEventListener("change", function() {
            handleCheckboxChange(this, offers[0].clearances);
        });
    });
}
function handleCheckboxChange(checkbox, clearances) {
    const card = checkbox.parentElement.parentElement.parentElement;
    const cardIndex = Array.from(card.parentElement.children).indexOf(card);
    if (checkbox.checked) {
        selectedCards.push(clearances[cardIndex]);
    } else {
        selectedCards = selectedCards.filter(card => card !== clearances[cardIndex]);
    }
    console.log(selectedCards); 
}