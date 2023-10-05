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

// Handling modal window
function handleModal(request) {
    const modalWindow = document.querySelector('#modalWindow');
    const sectionTitle = document.querySelector('#sec-title');
    const sectionContent = document.querySelector('#sec-content');

    //   If request is open, open modal window
    if (request === 'open') {
        modalWindow.classList.remove('hidden');

        sectionTitle.classList.add('blur');
        sectionContent.classList.add('blur');
    } // If request is colose, close modal window
    else if (request === 'close') {
        modalWindow.classList.add('hidden');

        sectionTitle.classList.remove('blur');
        sectionContent.classList.remove('blur');
        sectionTitle.classList.remove('blur');
        sectionContent.classList.remove('blur');
    }
}