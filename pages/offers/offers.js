//jeg har match objektet med - hvordan skal bruges i forhold til fx storeID
import {API_URL} from "../../settings.js"
import { handleHttpErrors, makeOptions, sanitizeStringWithTableRows, sanitizer } from "./../../utility.js"
import { storeData } from "../stores/stores.js";
const URL=API_URL+"/stores/foodwaste"
export let selectedCards = [];

export async function initOffers(match){
    userAuthenticated();
    const storeId = match.params.storeid;
    await getOffers(storeId);
    const offcanvas = document.querySelector('.offcanvas');
    offcanvas.classList.add('visible');
    document.querySelector('#canvas-hover').addEventListener('mouseover', function () {
        visibilityToggle(true);
        toggleCanvasOn();
    });
    document.querySelector('#offcanvasExample').addEventListener('mouseleave', function () {
        visibilityToggle(false);
        toggleCanvasOff();
    });
    selectedCards = [];
    cardsToCanvas(storeData);
    document.querySelector('#recipe-button').addEventListener('click', createRecipe)
    document.querySelector('#close-canvas-button').addEventListener('click', function () {
        visibilityToggle(false);
    });
}
async function getOffers(id) {
    document.querySelector("#offer-cards").style.visibility = "visible"
    const offers= await fetch(URL+"?id="+id,makeOptions("GET", null, false)).then(r =>handleHttpErrors(r))
    const clearances = offers[0].clearances;
    const offersRow = clearances.map(clearance => {
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
                        <input class="form-check-input" type="checkbox" value="" data-index="${clearance.product.ean}" style="height:30px; width:30px;">
                    </div>
                </div>
            </div>
</div>`
    
}).join("");
    document.querySelector("#offer-cards").innerHTML=sanitizeStringWithTableRows(offersRow);
    document.body.addEventListener('change', function (event) {
        const target = event.target;
        if (target.classList.contains("form-check-input")) {
            handleCheckboxChange(target, offers[0].clearances);
        }
    });
    document.querySelector("#offer-cards").addEventListener('click', function (event) {
        const clickedElement = event.target;
        const card = clickedElement.closest('.card');
        const checkbox = clickedElement.closest('.form-check-input');
        if (checkbox) {
            handleCheckboxChange(checkbox, offers[0].clearances);
        } else if (card) {
            const checkboxInCard = card.querySelector('.form-check-input');
            if (checkboxInCard) {
                checkboxInCard.checked = !checkboxInCard.checked;
                const changeEvent = new Event('change');
                checkboxInCard.dispatchEvent(changeEvent);
                handleCheckboxChange(checkboxInCard, offers[0].clearances);
            }
        }
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
    if (selectedCards.length > 5) {
        const modal = document.getElementById('selectionLimitModal');
        modal.style.display = 'block';
        modal.classList.add('show');
        document.body.classList.add('modal-blur');
        setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('show');
        }, 1000);

        checkbox.checked = false;
        return;
    }
    cardsToCanvas(storeData);
}
async function cardsToCanvas(storeData){
    const listAmount = selectedCards.length;
    document.querySelector('#error_recipe_msg').innerHTML = "";
    const store = storeData.map(store_data => `
        <div class="card-body row pt-1 pb-0 m-0">
            <h5 class="col" id="${store_data.id}">${store_data.name}</h5>
            <p class="col">${store_data.address}</p>
            <img src="${getBrandLogo(store_data.brand)}" class="col-md-8" style="height: 80px; width: auto;">
        </div>
    `).join("")
    document.querySelector('#store_data').innerHTML = sanitizeStringWithTableRows(store);
    
    if(selectedCards.length >= 3){
        document.querySelector('#placeholdertext').innerHTML = ""
    }
    else{
        document.querySelector('#placeholdertext').innerHTML = "Hvis du er medlem kan du vælge 3-5 <br> produkter og få en opskrift lavet af en AI!"
    }
    document.querySelector('#number-canvas').innerHTML = listAmount;
    const cards = selectedCards.map((card, index) => {
        const imgSrc = card.product.image ? card.product.image : '../../images/PlaceholderProductImage.jpg';
        return`
        <div class="row p-2">   
            <div class="col text-start" style="white-space: nowrap; max-width: 70%; overflow: hidden; text-overflow: ellipsis;">${card.product.description}</div>
            <div class="col" style="max-width: 25%;">${card.offer.newPrice}</div>
            <button class="col btn-remove modal-dialog-centered justify-content-center" data-index="${card.product.ean}" style="max-width: 5%; border: solid 1px rgb(255, 82, 82); color:grey; background-color:white;">X</button>
        </div>
    `}).join("");
    document.querySelector('#canvas-cards').innerHTML = sanitizeStringWithTableRows(cards);
    if(!selectedCards.length == 0){
        const totalPriceSectionExists = document.querySelector('#canvas-cards').innerHTML.includes('Total pris');
        const totalPrice = selectedCards.reduce((sum, card) => sum + parseFloat(card.offer.newPrice), 0);

        if (!totalPriceSectionExists) {
            document.querySelector('#canvas-cards').innerHTML += `
                <div class="row p-2" style="border-top: solid 1px rgb(31, 156, 31)">
                    <div class="col text-start" style="max-width: 70%;">Total pris</div>
                    <div class="col text-center" style="max-width: 25%;">${totalPrice}</div>
                    <div class="col" style="max-width: 5%;">&nbsp;</div>
                </div>`;
        }
    }
    document.querySelectorAll('.btn-remove').forEach(button => {
        button.addEventListener('click', function () {
            const eanToRemove = this.getAttribute('data-index');
            const checkbox = document.querySelector(`.form-check-input[data-index="${eanToRemove}"]`);
    
            if (checkbox) {
                checkbox.checked = false;
            }
            const indexToRemove = selectedCards.findIndex(card => card.product.ean === eanToRemove);
            if (indexToRemove !== -1) {
                selectedCards.splice(indexToRemove, 1);
                cardsToCanvas(storeData);
            }
        });
    });
}
function getBrandLogo(brand) {
    switch (brand.toLowerCase()) {
        case 'netto':
            return '../../images/netto.png';
        case 'foetex':
            return '../../images/foetex.png';
        case 'bilka':
            return './path/to/bilka.png';
    }
}
function toggleCanvasOn(){
    const offcanvas = document.querySelector('.offcanvas');
    offcanvas.style.transform = 'translateX(0)';
}
function toggleCanvasOff(){
    const offcanvas = document.querySelector('.offcanvas');
    offcanvas.style.transition = 'transform 0.3s ease-in-out';
    offcanvas.style.transform = 'translateX(100%)';
}
async function createRecipe(){
    if (selectedCards.length < 3) {
        document.querySelector('#error_recipe_msg').innerHTML = "Vælg mindst 3 produkter.";
        return;
    }
    else{
        router.navigate(`/foodplan/`);
    }    
}
function visibilityToggle(open){
    const offcanvas = document.querySelector('.offcanvas');
    if (open) {
        offcanvas.style.transition = 'transform 0.3s ease-in-out';
        offcanvas.style.transform = 'translateX(0)';
    } else {
        offcanvas.style.transition = 'transform 0.3s ease-in-out';
        offcanvas.style.transform = 'translateX(100%)';
    }
}
function userAuthenticated(){
    if(localStorage.getItem("token") === null){
        return;
    }
    document.querySelector('#recipe-button').classList.remove("invisible");
}