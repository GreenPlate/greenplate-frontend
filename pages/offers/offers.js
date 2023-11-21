//jeg har match objektet med - hvordan skal bruges i forhold til fx storeID
import {API_URL} from "../../settings.js"
import { handleHttpErrors, makeOptions, sanitizeStringWithTableRows } from "./../../utility.js"

export async function initOffers(match){
    const storeId = match.params.storeid;
 const URL=API_URL+"/stores/foodwaste?id="+storeId;
 await getOffers(storeId);
 //document.querySelector("#offercard")
}
async function getOffers(id) {
const offers= await fetch(URL,makeOptions("GET", null, false)).then(r =>handleHttpErrors(r))
const offersRow= offers.map(offer => `
<div class="card" style="width: 18rem;">
  <img src="${offer.product.image}" class="card-img-top" alt="product picture">
  <div class="card-body">
    <h5 class="card-title">${offer.product.description}</h5>
    <p class="card-text"> original pris: ${offer.offer.originalPrice} <br>
    ny pris: ${offer.offer.newPrice} <br>
    rabat: ${offer.offer.discount} <br>
    ${offer.product.ean}</p>
    
        <div class="form-check form-check-reverse">
        <input class="form-check-input" type="checkbox" value="" id="reverseCheck1">
        <label class="form-check-label" for="reverseCheck1">
           vælg denne vare
        </label>
    </div>
  </div>
</div>`
    
    ).join("")
    document.querySelector("#offer-cards").innerHTML=sanitizeStringWithTableRows(offersRow);
}
