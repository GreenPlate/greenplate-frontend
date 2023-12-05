import {API_URL} from "../../settings.js"
import { handleHttpErrors, makeOptions, sanitizeStringWithTableRows, sanitizer } from "./../../utility.js"

export async function initDashboard() {
  console.log("initDashboard()");

  fetchZipCount();
  fetchStoreCount();
  fetchProductCount();
}

async function fetchZipCount() {
  // Replace with real fetch call

  const zipCountArray = await fetch(API_URL + "/stores/countzipcodecalls", makeOptions("GET", null, false)).then(r =>handleHttpErrors(r))

  const zipCountRows = zipCountArray
    .map(
      (zipCount) => `
        <tr>
            <th scope="row">${zipCount.zipcode}</th>
            <td>${zipCount.count}</td>
        </tr>
    `
    )
    .join("");

  document.querySelector("#zip-count-table-body").innerHTML = zipCountRows;
  createZipCountChart(zipCountArray);
}

function createZipCountChart(zipCountArray) {
  // Extract zip codes and counts for the chart
  const zipCodes = zipCountArray.map((entry) => entry.zipcode);
  const counts = zipCountArray.map((entry) => entry.count);

  const ctx = document.getElementById("zipCountChart").getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: zipCodes,
      datasets: [
        {
          label: "Antal søgninger",
          data: counts,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      indexAxis: "y",
    },
  });
}

async function fetchStoreCount() {
  const storeCountArray = await fetch(API_URL + "/stores/countstorecalls", makeOptions("GET", null, false)).then(r =>handleHttpErrors(r))
  
  const storeCountRows = storeCountArray
    .map(
      (storeCount) => `
          <tr>
              <th scope="row">${storeCount.name}</th>
              <td>${storeCount.count}</td>
          </tr>
      `
    )
    .join("");

  document.querySelector("#store-count-table-body").innerHTML = storeCountRows;
  createStoreChart(storeCountArray);
}

function createStoreChart(storeCountArray) {
  const storeNames = storeCountArray.map((entry) => entry.name);
  const storeCounts = storeCountArray.map((entry) => entry.count);

  const storeChartCtx = document
    .getElementById("storeCountChart")
    .getContext("2d");

  new Chart(storeChartCtx, {
    type: "bar",
    data: {
      labels: storeNames,
      datasets: [
        {
          label: "Antal søgninger",
          data: storeCounts,
          backgroundColor: "rgba(192, 75, 192, 0.2)",
          borderColor: "rgba(192, 75, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      indexAxis: "y",
    },
  });
}

async function fetchProductCount() {
  // Replace with real fetch call
  const productCountArray = [
    { name: "Product A", ean: "1234567890123", count: 50 },
    { name: "Product B", ean: "9876543210987", count: 25 },
    { name: "Product C", ean: "4567890123456", count: 10 },
    { name: "Product D", ean: "3210987654321", count: 30 },
    { name: "Product E", ean: "7890123456789", count: 15 },
  ];

  const productCountRows = productCountArray
    .map(
      (productCount) => `
        <tr>
            <th scope="row">${productCount.name}</th>
            <td>${productCount.ean}</td>
            <td>${productCount.count}</td>
        </tr>
    `
    )
    .join("");

  document.querySelector("#product-count-table-body").innerHTML =
    productCountRows;
}
