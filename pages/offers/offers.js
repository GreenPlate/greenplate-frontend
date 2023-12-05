//jeg har match objektet med - hvordan skal bruges i forhold til fx storeID
import {API_URL} from "../../settings.js"
import { handleHttpErrors, makeOptions, sanitizeStringWithTableRows, sanitizer } from "./../../utility.js"
import { storeData } from "../stores/stores.js";
const URL=API_URL+"/stores/foodwaste"
const URL2=API_URL+"/stores/clearance"
export let selectedCards = [];
let pageSize = 8;
let minPrice = 0;
let maxPrice = 1000;
let isInitialized = false;
let selectedFilter=" ";
let sortvalue=" ";
let storeId; 
let page=0;
let filteredOffersList = [];
let offersList = [];

let totalPages;
export async function initOffers(match){
   page=0;
    userAuthenticated();
     storeId = match.params.storeid;
     if (!isInitialized) {  //No reason to setup event handlers if it's already been done
        isInitialized = true;
        document.querySelector('#pagination').addEventListener('click', handlePaginationClick)       
      }
    getOffers(page);
    setupOffcanvas();
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

async function getOffers(pageNumber,filteredOffersList) {
    const pageSize = 8;
    const offerCardsContainer = document.querySelector("#offer-cards");

    offerCardsContainer.style.visibility = "visible";
    if(filteredOffersList){
                offersList=filteredOffersList
            }else{
            offersList= await fetch(URL2+"?id="+storeId,makeOptions("GET", null, false)).then(r =>handleHttpErrors(r))//.then(data=>data.offers) //tilføjet sidste .then
            }   

    const { minPrice, maxPrice } = calculateMinMaxPrice(offersList);

    console.log("minimum pris: " + minPrice);
    console.log("maximum pris: " + maxPrice);

    const countOffers = offersList.length;
    console.log("no. of Offers: " + countOffers);

    const totalPages = Math.ceil(countOffers / pageSize);
    const offers = getPaginatedOffers(offersList, pageNumber, pageSize);

    const offersRow = createOffersRow(offers);
    offerCardsContainer.innerHTML = sanitizeStringWithTableRows(offersRow);

    addEventListeners(offers);

    displayPagination(totalPages, pageNumber);
}

function calculateMinMaxPrice(offersList) {
    const newPrices = offersList.map(offer => offer.newPrice);
    const minPrice = Math.min(...newPrices);
    const maxPrice = Math.max(...newPrices);
    return { minPrice, maxPrice };
}

function getPaginatedOffers(offersList, pageNumber, pageSize) {
    const startIndex = pageNumber * pageSize;
    const endIndex = startIndex + pageSize;
    return offersList.slice(startIndex, endIndex);
}

function createOffersRow(offers) {
    return offers.map(offer => {
        const imgSrc = offer.image ? offer.image : '../../images/PlaceholderProductImage.jpg';
        return `
            <div class="card mx-2 mt-2 d-flex align-items-center  justify-content-center shadow-sm p-3 mb-5 bg-body-tertiary rounded" style="width: 18rem">
                <div class="col-md-4 d-flex align-items-center  justify-content-center">
                    <img src="${imgSrc}" class="card-img-top" onerror="this.src='../../images/PlaceholderProductImage.jpg';" style="width: 17rem; height: 150px; overflow: ignore;">
                </div>    
                <div class="card-body">
                    <div class="h-25">
                        <h5 class="card-title">${offer.description}</h5>
                    </div>
                    <p class="card-text"> original pris: ${offer.originalPrice} <br>
                        ny pris: ${offer.newPrice} <br>
                        rabat: ${offer.discount} <br>
                        ${offer.ean}
                    </p>
                    <input class="invisible" type="text" value="${offer.id}">
                    <div class="form-check form-check-reverse ">
                        <label class="form-check-label p-2" for="reverseCheck1"><p>Vælg vare </p></label>
                        <input class="form-check-input" type="checkbox" value="" data-index="${offer.ean}" style="height:30px; width:30px;">
                    </div>
                </div>
            </div>
</div>`    ;
    }).join("");
}

function addEventListeners(offers) {
    const offerCardsContainer = document.querySelector("#offer-cards");

    document.body.addEventListener('change', function (event) {
        const target = event.target;
        if (target.classList.contains("form-check-input")) {
            handleCheckboxChange(target, offers);
        }
    });

    offerCardsContainer.addEventListener('click', function (event) {
        const clickedElement = event.target;
        const card = clickedElement.closest('.card');
        const checkbox = clickedElement.closest('.form-check-input');

        if (checkbox) {
            handleCheckboxChange(checkbox, offers);
        } else if (card) {
            const checkboxInCard = card.querySelector('.form-check-input');
            if (checkboxInCard) {
                checkboxInCard.checked = !checkboxInCard.checked;
                const changeEvent = new Event('change');
                checkboxInCard.dispatchEvent(changeEvent);
                handleCheckboxChange(checkboxInCard, offers);
            }
        }
    });

    document.querySelector("#searchselection").addEventListener("click", searchAndSort);
}


function handleCheckboxChange(checkbox, offers) {
    const card = checkbox.parentElement.parentElement.parentElement;
    const cardIndex = Array.from(card.parentElement.children).indexOf(card);
    if (checkbox.checked&&selectedCards.length<=5) {
        selectedCards.push(offers[cardIndex]);
    } else {
        selectedCards = selectedCards.filter(card => card !== offers[cardIndex]);
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
    const cards = selectedCards.map((card) => {
        const imgSrc = card.image ? card.image : '../../images/PlaceholderProductImage.jpg';
        return`
        <div class="row p-2">   
            <div class="col text-start" style="white-space: nowrap; max-width: 70%; overflow: hidden; text-overflow: ellipsis;">${card.description}</div>
            <div class="col" style="max-width: 25%;">${card.newPrice}</div>
            <button class="col btn-remove modal-dialog-centered justify-content-center" data-index="${card.ean}" style="max-width: 5%; border: solid 1px rgb(255, 82, 82); color:grey; background-color:white;">X</button>
        </div>
    `}).join("");
    document.querySelector('#canvas-cards').innerHTML = sanitizeStringWithTableRows(cards);
    if(!selectedCards.length == 0){
        const totalPriceSectionExists = document.querySelector('#canvas-cards').innerHTML.includes('Total pris');
        const totalPrice = selectedCards.reduce((sum, card) => sum + parseFloat(card.newPrice), 0);

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
            const indexToRemove = selectedCards.findIndex(card => card.ean === eanToRemove);
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

function setupOffcanvas(){
  const filterbutton=` <b class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvassorts" aria-controls="offcanvasExample">
  filtre 
</b> 
`
const priceRange=`<label for="from-price" class="form-label">minimum pris:${minPrice}</label>
<input type="range" class="form-range" min="${minPrice}" max="${maxPrice}" step="0.5" id="from-price" value="${minPrice}">

<label for="to-price" class="form-label">maximum pris: ${maxPrice}</label>
<input type="range" class="form-range" min="${minPrice}" max="${maxPrice}" step="0.5" id="to-price" value="${maxPrice}">`
document.querySelector("#sorts").innerHTML=sanitizeStringWithTableRows(filterbutton)
document.querySelector("#range-value").innerHTML=sanitizeStringWithTableRows(priceRange)
}

function displayPagination(totalPages, currentPage) {
    let paginationHtml = '';
    if (currentPage > 0) { // Previous Page
      paginationHtml += `<li class="page-item"><a class="page-link" data-page="${currentPage - 1}" href="#">Previous</a></li>`
    }
    // Display page numbers
    let startPage = Math.max(0, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 2);
  
    for (let i = startPage; i <= endPage; i++) {
      if (i === currentPage) {
        paginationHtml += `<li class="page-item active"><a class="page-link" href="#">${i + 1}</a></li>`
      } else {
        paginationHtml += `<li class="page-item"><a class="page-link" data-page="${i}" href="#">${i + 1}</a></li>`
      }
    }
    if (currentPage < totalPages - 1) { // Next Page
      paginationHtml += `<li class="page-item"><a class="page-link" data-page="${currentPage + 1}" href="#">Next</a></li>`
    }
    document.getElementById('pagination').innerHTML = paginationHtml;
}
function handlePaginationClick(evt) {
    evt.preventDefault()
    if (evt.target.tagName === 'A' && evt.target.hasAttribute('data-page')) {
       page = parseInt(evt.target.getAttribute('data-page'));
      getOffers(page);
    }
  }
//     function setFilters() {
//     let filteredOffersList = offersList;

//     function applyFilters() {
//         const searchInput = document.querySelector("#search-input").value;
//         const sortInput = document.querySelector("#sorting-input").value;
//         const fromPrice = document.querySelector("#from-price").value;
//         const toPrice = document.querySelector("#to-price").value;

//         if (!Array.isArray(offersList)) {
//             console.error("Error: 'offersList' is not an array.");
//             console.error("Value of 'offersList':", offersList);
//             return;
//         }

//         const preFilter = offersList.filter(offer => offer.newPrice >= fromPrice && offer.newPrice <= toPrice);

//         if (searchInput !== "") {
//             selectedFilter = searchInput;
//             filteredOffersList = preFilter.filter(offer => offer.description.includes(selectedFilter));
//         }

//         if (sortInput !== "" && searchInput === "") {
//             sortValue = sortInput;
//             filteredOffersList = preFilter.sort((a, b) => (a[sortValue] > b[sortValue]) ? 1 : -1);
//         } else if (sortInput !== "" && searchInput !== "") {
//             sortValue = sortInput;
//             filteredOffersList = filteredOffersList.sort((a, b) => (a[sortValue] > b[sortValue]) ? 1 : -1);
//         } else {
//             filteredOffersList = preFilter;
//         }
//     }

//     document.querySelector("#searchselection").addEventListener("click", function (event) {
//         event.preventDefault();
//         applyFilters();
//     });

//     // Initial application of filters
//     applyFilters();

//     return filteredOffersList;
// }
//    function setFilters(offersList){
//   let  filteredofferslist=offersList
//     var sortandsearch=[]
//     document.querySelector("#searchselection").addEventListener("click", function (event) {
//     event.preventDefault();
//     const searchInput=document.querySelector("#search-input").value
//     const sortInput=document.querySelector("#sorting-input").value
//     const fromprice=document.querySelector("#from-price").value
//     const toprice=document.querySelector("#to-price").value
//     const prefilter=offersList.filter(offer=>offer.newPrice>=fromprice&&offer.newPrice<=toprice)
//     if(searchInput!==""){
//         selectedFilter=searchInput
//         sortandsearch=prefilter.filter(offer=>offer.description.includes(selectedFilter))
//     }

//     if(sortInput!==""&&searchInput===""){
//         sortvalue=sortInput
//         filteredofferslist=prefilter.sort((a, b) => (a.sortvalue > b.sortvalue) ? 1 : -1)  
//     }
//     else if(sortInput!==""&&searchInput!==""){
//         sortvalue=sortInput
//         filteredofferslist=sortandsearch.sort((a, b) => (a.sortvalue > b.sortvalue) ? 1 : -1)  
//     }
//     else{
//         filteredofferslist=prefilter
//     }
    
//   });
//   return filteredofferslist;
// }
function searchAndSort() {
    const searchButton = document.getElementById('searchselection');
    let sortedData=[];

    searchButton.addEventListener('click', function () {
        const searchInput = document.getElementById('search-input').value.toLowerCase();
        const fromPrice = parseFloat(document.getElementById('from-price').value);
        const toPrice = parseFloat(document.getElementById('to-price').value);
        const sortingInput = document.getElementById('sorting-input').value;

        const filteredData = offersList.filter(offer => {
            const meetsPriceCriteria = offer.newPrice >= fromPrice && offer.newPrice <= toPrice;
            const meetsSearchCriteria = searchInput === '' || offer.description.toLowerCase().includes(searchInput);

            return meetsPriceCriteria && meetsSearchCriteria;
        });

        //sortedData=[];
        if (sortingInput !== '') {
            sortedData = filteredData.sort((a, b) => {
                if (a[sortingInput] > b[sortingInput]) return 1;
                if (a[sortingInput] < b[sortingInput]) return -1;
                return 0;
            });
        } else {
            sortedData = filteredData;
        }

        // Use the sortedData for further processing, such as displaying results.
        console.log(sortedData);
        //filteredOffersList= sortedData.map(offer => offer);
        getOffers(0, sortedData);
       
    });
   
}