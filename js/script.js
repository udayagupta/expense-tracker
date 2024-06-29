let categoryInput = document.getElementById("category");
let form = document.getElementsByTagName("form")[0];
let filter = document.getElementById("filter");
let customCategoriesName = ["Food", "Recharges", "Grocery"]
let customCategories = {}
let monthlyExpenses = {
    "January": 0,
    "February": 0,
    "March": 0,
    "April": 0,
    "May": 0,
    "June": 0,
    "July": 0,
    "August": 0,
    "September": 0,
    "October": 0,
    "November": 0,
    "December": 0
  }
let fundsLeft = 12000
let totalExpenses = 0;
let fundsLeftElement = document.getElementsByClassName("fundsLeft")[0]
const rupeeSign = "₹"

fundsLeftElement.innerText = `${rupeeSign} ${fundsLeft}`

let expenses = []

expenses = JSON.parse(localStorage.getItem("expenses"))

console.log(expenses)
let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const months = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
}

let filterMonth = document.getElementById("filterMonth")

category.addEventListener("input", function()  {
    let value = categoryInput.value
    let custom = document.getElementById("custom")

    if (value === "custom") {
        custom.style.display = "block"
        custom.required = true
    } else {
        custom.style.display = "none"
        custom.required = false
    }
})

form.addEventListener("submit", function(event) {
    event.preventDefault()

    let amount = document.getElementById("amount").value
    let date = document.getElementById("date").value
    let dateValue = new Date(document.getElementById("date").value)
    let categoryInput = document.getElementById("category");
    let title = document.getElementById("title").value;
    let custom = document.getElementById("custom")
    let spentOnCategories = document.getElementsByClassName("spentOnCategories")[0]
    let parsedAmount = parseFloat(amount).toFixed(2)
    let numberAmount = parseFloat(parsedAmount);
    let category;
    

    if (categoryInput.value.toLowerCase() === 'custom') {
        let customCategory = document.getElementById("custom");
        category = customCategory.value
        // customCategories.push(category);
        console.log(customCategoriesName)
        if (!customCategoriesName.includes(toTitleCase(category))) {
            let option = document.createElement("option")
            option.setAttribute("value", `${category}`);
            option.innerText = `${category}`

            let filterOption = document.createElement("option")
            filterOption.setAttribute("value", `${category}`);
            filterOption.innerText = `${category}`

            categoryInput.appendChild(option);
            filter.appendChild(filterOption);
        }
        // addCategoryToDashboard(category, numberAmount, formatDate(date))
        
    } else {
        category = categoryInput.value
    }

    form.reset()
    custom.style.display = "none"

    let expense = {
        "title": title,
        "amount": numberAmount,
        "date": date,
        "category": category,
        "day": days[dateValue.getDay()]
    }
    renderData(expense)
    expenses.push(expense)

    let expensesJSON = JSON.stringify(expenses)
    localStorage.setItem("expenses", expensesJSON)
})

filter.addEventListener("input", function() {
    
    let filterValue = filter.value.toLowerCase();
    let table = document.getElementsByTagName("table")[0];
    let tr = table.getElementsByTagName("tr");

    for (var i = 1; i < tr.length; i++) {
        let trElement = tr[i].getElementsByTagName("td");
        let td = trElement[3].innerText.toLowerCase()

        if (td.indexOf(filterValue) > -1) {
            tr[i].style.display = ""

        } else if (filterValue === "all") {
            tr[i].style.display = "table-row"
        
        } else {
            tr[i].style.display = "none"

        }
    }

})

filterMonth.addEventListener("input", function() {
    let filterValue = toTitleCase(filterMonth.value);
    let table = document.getElementsByTagName("table")[0];
    let tr = table.getElementsByTagName("tr");

    for (var i = 1; i < tr.length; i++) {
        let trElement = tr[i].getElementsByTagName("td");
        let td = trElement[2].innerText

        if (td.indexOf(filterValue) > -1) {
            tr[i].style.display = ""

        } else if (filterValue === "all" || filterValue === "All") {
            tr[i].style.display = "table-row"
        
        } else {
            tr[i].style.display = "none"

        }
    }

})

function renderData(expense) {
    let table = document.getElementsByTagName("table")[0];
    let totalExpense = document.getElementsByClassName("totalExpenses")[0];
    let spentOnCategories = document.getElementsByClassName("spentOnCategories")[0]
    const title = expense["title"]
    const amount = expense["amount"]
    const date = formatDate(expense["date"])
    const category = expense["category"]
    const day = expense["day"]

    let tr = document.createElement("tr");
    tr.setAttribute("onclick", "fullDetails(this)")
    let tdTitle = document.createElement("td")
    tdTitle.classList.add("expense-title")

    let tdAmount = document.createElement("td")
    tdAmount.classList.add("expense-amount")
    
    let tdDate = document.createElement("td")
    tdDate.classList.add("expense-date")

    let tdCategory = document.createElement("td")
    tdCategory.classList.add("expense-category")


    tdTitle.innerText = `${title}`
    tdAmount.innerText = `${rupeeSign} ${amount}`
    tdDate.innerText = `${day}, ${date}`
    tdCategory.innerText = `${category}`

    tr.appendChild(tdTitle)
    tr.appendChild(tdAmount)
    tr.appendChild(tdDate)
    tr.appendChild(tdCategory)

    fundsLeft -= parseFloat(amount)
    fundsLeftElement.innerText = `${rupeeSign} ${fundsLeft}`
    totalExpenses += parseFloat(amount);
    totalExpense.innerText = `${rupeeSign} ${totalExpenses}`

    table.appendChild(tr);
    console.log(category)
    addCustomCategoryOption(category)
    console.log(customCategoriesName)
   
    console.log("Success")
    
    let month = tdDate.textContent.split(" ")[2]
    if (monthlyExpenses[month]) {
        monthlyExpenses[month] += parseFloat(amount)
    } else {
        monthlyExpenses[month] = parseFloat(amount)
    }
    
    let titleCategory = toTitleCase(category)
    let camelCaseCategory = camleCaseClassName(category)
    console.log(customCategories)
    if (customCategories[camelCaseCategory]) {
        customCategories[camelCaseCategory] += parseFloat(amount)
        spentOnCategories.getElementsByClassName(`${camelCaseCategory}`)[0].querySelector(".categoryAmount").innerText = `Total Amount: ${rupeeSign} ${customCategories[camelCaseCategory]}`;
        spentOnCategories.getElementsByClassName(`${camelCaseCategory}`)[0].querySelector(".lastDateAdded").innerText = `Last spent on: ${date}`;
        console.log(camelCaseCategory ,"Exists")
    } else {
        customCategories[camelCaseCategory] = parseFloat(amount)
        console.log(camelCaseCategory,"Does not Exists")
        addCategoryToDashboard(category, amount, date)
    }

}

function formatDate(dateString) {
    

    let splitDate = dateString.split("-");
    let date = splitDate[2];
    let month = months[parseInt(splitDate[1])];
    let year = splitDate[0];

    return `${date} ${month} ${year}`
    
}

function toTitleCase(str) {
    return str.split(' ').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
}

expenses.forEach(element => {
    renderData(element)
})

function addCategoryToDashboard(category, amount, date) {
    let spentOnCategories = document.getElementsByClassName("spentOnCategories")[0]
    
    let div = document.createElement("div");
    div.classList.add("card")
    div.classList.add(`${camleCaseClassName(category)}`)

    let h4 = document.createElement("h4");
    h4.innerText = `${toTitleCase(category)}`
    

    let p = document.createElement("p");
    p.classList.add("categoryAmount");
    p.innerText = `Total Amount: ${rupeeSign} ${amount}`

    let dateP = document.createElement("p");
    dateP.classList.add("lastDateAdded")
    dateP.innerText = `Last spent On: ${date}`
    
    div.appendChild(h4)
    div.appendChild(p)
    div.appendChild(dateP)

    spentOnCategories.appendChild(div);
}

function camleCaseClassName(className) {
    let splitClass = className.split(" ");
    return splitClass.join("-")
}

function convertFromCamleCase(className) {
    let splitClass = className.split("-")
    
    for (let index = 0; index < splitClass.length; index++) {
        splitClass[index] = toTitleCase(splitClass[index])
    }

    return splitClass.join(" ")
}

function fullDetails(trElement) {
    let div = document.querySelector(".full-details")
    let td = trElement.getElementsByTagName("td")
    let title = td[0].textContent
    let amount = td[1].textContent
    let date = td[2].textContent
    let category = td[3].textContent

    let divChildern = div.children;
    divChildern[1].innerText = `Title: ${title}` 
    divChildern[2].innerText = `Amount: ${amount}` 
    divChildern[3].innerText = `Date: ${date}` 
    divChildern[4].innerText = `Category: ${category}` 

    div.style.display = "inline-block"
    document.querySelector(".overlay").style.display = "block"
 
}

function closePopUp() {
    document.querySelector(".full-details").style.display = "none"
    document.querySelector(".overlay").style.display = "none"
}

let barColor = "rgb(28, 46, 65)"
let lineColor = "rgba(255, 255, 255, 0.2)"

let updateMonthlyGraph = document.getElementById("update-graph-monthly");
const monthlyGraph = document.getElementById("myChartMonthly");
let monthlyChart = new Chart(monthlyGraph, {
    type: "line",
    data: {
        labels: Object.keys(monthlyExpenses),
        datasets: [{
            label: "Amount",
            backgroundColor: barColor,
            barThickness: 20,
            borderWidth: 2,
            borderColor: "white",
            data: Object.values(monthlyExpenses),
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: "rgb(255, 255, 255)"
                },
                grid: {
                    display: true,
                    color: lineColor
                }
            },
            x: {
                ticks: {
                    color: "rgb(255, 255, 255)"
                },
                grid: {
                    display: true,
                    color: lineColor
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: 'white' // Change legend label font color
                }
            }
        }
    }
    
})

updateMonthlyGraph.addEventListener("click", function() {
    monthlyChart.data.labels = Object.keys(monthlyExpenses)
    monthlyChart.data.datasets[0].data = Object.values(monthlyExpenses);
    monthlyChart.update()
})


let updateGraph = document.getElementById("update-graph");
const ctx = document.getElementById("myChartCategories")
let myChart = new Chart(ctx, {
    type: "line",
    data: {
        labels: Object.keys(customCategories),
        datasets: [{
            label: "Amount",
            backgroundColor: barColor,
            barThickness: 50,
            borderWidth: 2,
            borderColor: "rgb(255, 255, 255)",
            data: Object.values(customCategories),
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: "rgb(255, 255, 255)"
                },
                grid: {
                    display: true,
                    color: lineColor
                }
            },
            x: {
                ticks: {
                    color: "rgb(255, 255, 255)"
                },
                grid: {
                    display: true,
                    color: lineColor
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: 'white' // Change legend label font color
                }
            }
        }
    }

})

updateGraph.addEventListener("click", function() {
    myChart.data.labels = Object.keys(customCategories)
    myChart.data.datasets[0].data = Object.values(customCategories);
    myChart.update()
})


function selectTodaysDate() {
    event.preventDefault()
    let datePicker = document.getElementById("date");
    let todaysDate = new Date()
    
    let date = String(todaysDate.getDate()).padStart(2, "0")
    let month = String(todaysDate.getMonth() + 1).padStart(2, "0")
    let year = todaysDate.getFullYear()
    
    let formattedDate = `${year}-${month}-${date}`
    datePicker.value = formattedDate
}

function quickAmount(element) {
    let amountInput = document.getElementById("amount")
    amountInput.value = element.innerText
}

function addCustomCategoryOption(category) {
    let customCategory = document.getElementById("custom");
        
        // customCategories.push(category);
        
    if (!customCategoriesName.includes(category)) {
        
        let option = document.createElement("option")
        option.setAttribute("value", `${toTitleCase(category)}`);
        option.innerText = `${toTitleCase(category)}`

        let filterOption = document.createElement("option")
        filterOption.setAttribute("value", `${toTitleCase(category)}`);
        filterOption.innerText = `${toTitleCase(category)}`

        categoryInput.appendChild(option);
        filter.appendChild(filterOption);
        customCategoriesName.push(category)
        
    }
}