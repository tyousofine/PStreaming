'use strict'


// Open page
function openPage(id) {
    const containerList = document.querySelectorAll('.contentContainer');
    console.log(containerList)
    //Remove an active class If an element has an active class
    for (let i = 0; i < containerList.length; i++) {
        if (containerList[i].classList.contains('active')) {
            containerList[i].classList.remove('active');
        }
    }

    //Add active class
    const idName = document.querySelector(`#${id}`);
    if (!idName.classList.contains('active')) {
        idName.classList.add('active');
    }

    return;
}

// hamburger menu
function toggleHamburgerFunction() {
    const hamburger = document.querySelector(".hamburger");
    const navbar = document.querySelector(".content-left")

    if (!hamburger.classList.contains('active')) {
        hamburger.classList.add('active')
        navbar.classList.add('nav-hamburger');
        console.log('Hamburger class: ', hamburger.classList)
        console.log('navbar class: ', navbar.classList)
    }

    else {
        hamburger.classList.remove('active')
        navbar.classList.remove('nav-hamburger')
        console.log('Hamburger class: ', hamburger.classList)
        console.log('navbar class: ', navbar.classList)

    }

}





