// ====== EVENT LISTENERS ======
let authorLinks = document.querySelectorAll("a");
for (let authorLink of authorLinks) {
    authorLink.addEventListener("click", getAuthorInfo);
}

document.getElementById("likesForm").addEventListener("submit", function(event) {

    const minInput = document.getElementById("minLikes");
    const maxInput = document.getElementById("maxLikes");
    const errorField = document.getElementById("likesError");

    const minValue = parseInt(minInput.value) || 0;
    const maxValue = parseInt(maxInput.value);

    let isValid = true;

    if (isNaN(maxValue)) {
        errorField.textContent = "Max likes is required";
        maxInput.classList.add('is-invalid');
        isValid = false;
    } else if (minValue > maxValue) {
        errorField.textContent = "Maximum must be greater than minimum";
        maxInput.classList.add('is-invalid');
        isValid = false;
    } else {
        maxInput.classList.remove('is-invalid');
    }

    if (!isValid) {
        event.preventDefault();
    }

});

// ====== FUNCTIONS ======

async function getAuthorInfo() {
    let myModal = new bootstrap.Modal(document.getElementById('authorModal'));
    myModal.show();

    let url = `api/author/${this.id}`;
    
    let response = await fetch(url);
    let data = await response.json();

    console.log(data);

    let authorInfo = document.querySelector("#authorInfo");
    authorInfo.innerHTML = `<h1> ${data[0].firstName}
                                 ${data[0].lastName} </h1>`;
    authorInfo.innerHTML += `<img src="${data[0].portrait}" width="200"><br>`;
    authorInfo.innerHTML += `<b>Profession:</b> ${data[0].profession}<br>`;
    authorInfo.innerHTML += `<b>Sex:</b> ${data[0].sex}<br>`;
    authorInfo.innerHTML += `<b>Date of Birth:</b> ${formatAuthorDates(data[0].dob)}<br>`;
    authorInfo.innerHTML += `<b>Date of Death:</b> ${formatAuthorDates(data[0].dod)}<br>`;
    authorInfo.innerHTML += `<b>Birth Place:</b> ${data[0].country}<br>`;
    authorInfo.innerHTML += `<b>Biography:</b> ${data[0].biography}<br>`;
}

function formatAuthorDates(dateString) {
    const date = new Date(dateString);

    return date.toLocaleDateString('en-US', {
        timeZone: 'UTC',
        dateStyle: 'medium'
    });
}