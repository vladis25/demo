document.addEventListener('DOMContentLoaded', () => {
    getPersons(1, true)

})


function getPersons(page, create = false) {
    let xml = new XMLHttpRequest()
    let url = `https://swapi.dev/api/starships/?page=${page}`
    xml.open('GET', url)
    xml.responseType = 'json'
    xml.send()
    xml.onload = () => {
        showAllPerson(xml.response.results)
    }
    if (create) {
        xml.onreadystatechange = () => {
            if (xml.readyState == 4) {
                createPagination(xml.response.count, xml.response.results.length)
                document.querySelector('.number_page').classList.add('visible')
                activePagination()
            }
        }
    }

}

// function showAllPerson(data) {
//     let content = document.querySelector('.content')
//     content.innerHTML = ''
//     data.forEach(element => {
//         let str = `<div class="card mb-3">
//         <h3 class="card-header">${element.name}</h3>
//         <img src="https://starwars-visualguide.com/assets/img/species/${element.url.match(/\/([0-9]*)\/$/)[1]}.jpg" class="d-block user-select-none">
//         </svg>
//       </div>`
//         content.insertAdjacentHTML('beforeend', str)
//     });
//     showPerson(data)
// }
function showPerson(data){
    let blocks = document.querySelectorAll('.content div.card')
    for (let i = 0; i < blocks.length; i++) {
        blocks[i].addEventListener('click',()=>{
            showDetails(data[i],blocks[i].children[1].src)
            document.querySelector('.details').classList.add('show')
        });
    }
    document.querySelector('.border-info').addEventListener('click',()=>{
        document.querySelector('.details').classList.remove('show')
    })
}

async function checkImageExists(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        return false;
    }
}

async function showAllPerson(data) {
    let content = document.querySelector('.content');
    content.innerHTML = '';
    
    for (const element of data) {
        let filmUrlMatches = element.url.match(/\/([0-9]*)\/$/);
        let filmId = filmUrlMatches ? filmUrlMatches[1] : '';
        
        let imgSrc = `https://starwars-visualguide.com/assets/img/species/${filmId}.jpg`;
        let imgElement = document.createElement('img');
        imgElement.classList.add('d-block', 'user-select-none');
        
        let imageExists = await checkImageExists(imgSrc);
        if (!imageExists) {
            imgSrc = 'https://starwars-visualguide.com/assets/img/placeholder.jpg'; //резервне зображення
        }
        
        imgElement.src = imgSrc;
        
        let card = document.createElement('div');
        card.classList.add('card', 'mb-3');
        card.innerHTML = `
            <h3 class="card-header">${element.name}</h3>
        `;
        card.appendChild(imgElement);
        
        content.appendChild(card);
    }
    
    showPerson(data);
}

function showDetails(data, url){
    let img = document.querySelector('.details .card-header img')
    let li = document.querySelectorAll('.details .info')
    let title = document.querySelector('.details .card-title')
    const {name,classification,designation,average_lifespan,average_height,skin_colors} = data
    title.textContent = name
    li[0].textContent = classification
    li[1].textContent = designation
    li[2].textContent = average_lifespan
    li[3].textContent = average_height
    li[4].textContent = skin_colors
    img.src = url
}
function activePagination() {
    let page = document.querySelectorAll('.page-item');

    for (let index = 0; index < page.length; index++) {
        page[index].addEventListener('click', function () {
            for (let i = 0; i < page.length; i++) {
                page[i].classList.remove('active');
            }
            this.classList.add('active')
            getPersons(this.firstElementChild.textContent)
        })
    }
}

function createPagination(all, current) {
    let line = ''
    let number = parseInt(all / current) + (all / current > parseInt(all / current) ? 1 : 0)
    for (let i = 0; i < number; i++) {
        if (i == 0) {
            line += `<li class="page-item active"><a class="page-link" href="#">${i + 1}</a></li>`
            continue
        }
        line += `<li class="page-item"><a class="page-link" href="#">${i + 1}</a></li>`
    }
    document.querySelector('.pagination li:first-child').insertAdjacentHTML('afterend', line)
}