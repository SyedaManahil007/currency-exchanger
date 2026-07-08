const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/";

const dropdownSelects = document.querySelectorAll(".dropdown select");
const button = document.querySelector("form button");
const fromCurrency = document.querySelector(".from select");
const toCurrency = document.querySelector(".to select");
const message = document.querySelector(".message");

window.addEventListener("load", () => {
    updateExchangeRate();
});

for (let select of dropdownSelects) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.value = currCode;
        newOption.innerText = currCode;

        if (select.name === "from" && currCode === "USD") {
            newOption.selected = true;
        } else if (select.name === "to" && currCode === "PKR") {
            newOption.selected = true;
        }

        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
        updateExchangeRate();
    });
}

function updateFlag(element) {
    let currCode = element.value;
    let countryCode = countryList[currCode];

    let img = element.parentElement.querySelector("img");
    img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}

button.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

async function updateExchangeRate() {
    let amount = document.querySelector(".amount input");
    let amountVal = amount.value;

    if (amountVal === "" || amountVal <= 0) {
        amountVal = 1;
        amount.value = 1;
    }

    const URL = `${BASE_URL}${fromCurrency.value.toLowerCase()}.json`;

    try {
        let response = await fetch(URL);
        let data = await response.json();

        let rate =
            data[fromCurrency.value.toLowerCase()][
                toCurrency.value.toLowerCase()
            ];

        let finalAmount = (amountVal * rate).toFixed(2);

        message.innerText = `${amountVal} ${fromCurrency.value} = ${finalAmount} ${toCurrency.value}`;
    } catch (error) {
        message.innerText = "Unable to fetch exchange rate.";
        console.error(error);
    }
}