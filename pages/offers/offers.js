//jeg har match objektet med - hvordan skal bruges i forhold til fx storeID
import {API_URL} from "../../settings.js"
import { handleHttpErrors, makeOptions, sanitizeStringWithTableRows } from "./../../utility.js"
const URL=API_URL+"/stores/foodwaste"
export async function initOffers(match){
    const storeId = match.params.storeid;

 await getOffers(storeId);
 //document.querySelector("#offercard")
}
async function getOffers(id) {
    document.querySelector("#offer-cards").style.visibility = "visible"
const offers= await fetch(URL+"?id="+id,makeOptions("GET", null, false)).then(r =>handleHttpErrors(r))
const clearances=offers[0].clearances;
const offersRow= clearances.map(clearance => `

    <div class="card mx-2 mt-2 d-flex align-items-center  justify-content-center shadow-sm p-3 mb-5 bg-body-tertiary rounded" style="width: 18rem" >
        <div class="col-md-4 d-flex align-items-center  justify-content-center">
                <img src="${clearance.product.image}"  class="card-img-top " alt="product picture" style="width: 17rem; height: 150px; overflow: ignore;">
        </div>    
            <div class="card-body">
                <div class="h-25">
                <h5 class="card-title ">${clearance.product.description}</h5>
                </div>
                <p class="card-text"> original pris: ${clearance.offer.originalPrice} <br>
                ny pris: ${clearance.offer.newPrice} <br>
                rabat: ${clearance.offer.discount} <br>
                ${clearance.product.ean} </p>
                
                <div class="form-check form-check-reverse ">
                <label class="form-check-label p-2" for="reverseCheck1"><p>Vælg vare </p></label>
                    <input class="form-check-input" type="checkbox" value="" id="reverseCheck1" style="height:30px; width:30px;">
                    
                    
                   
                </div>
            </div>
       
  
</div>`
    
    ).join("");
    document.querySelector("#offer-cards").innerHTML=sanitizeStringWithTableRows(offersRow);
}
