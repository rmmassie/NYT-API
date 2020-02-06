// Connection Variables

const baseURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
let url; 
const key = 'lqi28uDhzljZedAwIerGVoTHOLd7Hh6f';


const searchTerm = document.getElementById('searchBox');
const startDate = document.querySelector('.start-date');
const endDate = document.querySelector('.end-date');
const searchForm = document.querySelector('form');
const submitBtn = document.getElementById('searchSubmit');

// Results Variables
const nextBtn = document.getElementById('next');
const previousBtn = document.getElementById('prev');

const nextLi = document.getElementById('nextLi');
const prevLi = document.getElementById('prevLi');

const nav = document.querySelector('.pages');
const newNav = document.getElementById('pages');

const section = document.querySelector('section');


newNav.style.display = 'none';
let pageNumber = 0;
let displayNav = false;

searchForm.addEventListener('submit', fetchResults);
nextBtn.addEventListener('click', nextPage);
previousBtn.addEventListener('click', previousPage);

function fetchResults(e) {
    e.preventDefault()
    url = baseURL + '?api-key=' + key + '&page=' + pageNumber + '&q=' + searchTerm.value;
    
    if(startDate.value !== '') {
        url += '&begin_date=' + startDate.value;
    }
    
    if(endDate.value !== ''){
        url += '&end_date=' + endDate.value;
    }
    
    fetch(url)
    .then(function(result){return result.json()})
    .then(function(json){displayResults(json)})
}

function displayResults(json) {
    while (section.firstChild) {
        section.removeChild(section.firstChild);
        
    }
    let articles = json.response.docs;
    let meta = json.response;
    console.log(meta)
    if(articles.length === 10 && pageNumber == 0) {
        //Remove Previous functionality if on the first page
        console.log('articles.length === 10 && pageNumber == 0')
        newNav.style.display = 'block';
        prevLi.setAttribute('class', "page-item disabled")
        nextLi.setAttribute('class', "page-item")
        
    } else if (articles.length === 10 && pageNumber > 0) {
        // Both Buttons Functional.
        console.log('articles.length === 10 && pageNumber > 0')
        newNav.style.display = 'block';
        prevLi.setAttribute('class', "page-item")
        nextLi.setAttribute('class', "page-item")
      
    } else if (articles.length < 10 && pageNumber > 0) {
        //Disable Next Button
        console.log('articles.length < 10 && pageNumber > 0')
        newNav.style.display = 'block';
        prevLi.setAttribute('class', "page-item")
        nextLi.setAttribute('class', "page-item disabled")
    
    } else if (pageNumber == 0) {
        //Disable N
        newNav.style.display = 'block';
        prevLi.setAttribute('class', "page-item disabled")
        
    } else {
        newNav.style.display = 'none';
        }
    
     
    
    
    if (articles.length === 0) {
        console.log('No Results')
    } else {
        for (let i = 0; i < articles.length; i++) {
            //create a new Bootstrap Card Div
            let container = document.createElement('div');
            container.setAttribute('class', 'card');
            
            //Make an img to tie to. Appends to container.
            let img = document.createElement('img');
            img.setAttribute('class', 'card-img-top')

            //make the card body
            let cardBody = document.createElement('div');
            cardBody.setAttribute('class', 'card-body');
            //card title
            // let heading = document.createElement('h5');
            // heading.setAttribute('class',  'card-title')
            
            //Link fot the card Button
            let link = document.createElement('a');
            link.setAttribute('class', 'btn btn-primary')
            let date = document.createElement('p')
            let summary = document.createElement('h5');
            summary.setAttribute('class', 'card-text')
                        
            let current = articles[i];
            date.textContent = current.pub_date;
            date.textContent = 'Published on ' +date.textContent.slice(0,10)
            console.log(date)
            link.href = current.web_url;
            link.textContent = 'Read More...';

                   
            if (current.multimedia.length > 0) {
                img.src = 'https://www.nytimes.com/' + current.multimedia[0].url;
                img.alt = current.headline.main;
            } else {
                img.src = './assets/placeholder.png'
            }

            summary.textContent = current.headline.main
                        
                       
            // cardBody.appendChild(heading);
            cardBody.appendChild(summary);
            cardBody.appendChild(link)
            cardBody.appendChild(date)
            container.appendChild(img)
            container.appendChild(cardBody);
            section.appendChild(container);
        }
    }
}


function nextPage(e) {
    e.preventDefault()
    pageNumber++;
    fetchResults(e)
    console.log("Page number:", pageNumber);
    
}

function previousPage(e) {
    e.preventDefault()
    if (pageNumber > 0) {
        pageNumber--;
    } else {
        pageNumber = 0
    }
    
    fetchResults(e)
    console.log("Page number:", pageNumber);
    
}