//Event listeners
let authorLinks = document.querySelectorAll("a");
for (let authorLink of authorLinks) {
    authorLink.addEventListener("click", getAuthorInfo);
}

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
    authorInfo.innerHTML += `<b>Date of Birth:</b> ${data[0].dob}<br>`;
    authorInfo.innerHTML += `<b>Date of Death:</b> ${data[0].dod}<br>`;
    authorInfo.innerHTML += `<b>Country of Citizenship:</b> ${data[0].country}<br>`;
    authorInfo.innerHTML += `<b>Biography:</b> ${data[0].biography}<br>`;
}