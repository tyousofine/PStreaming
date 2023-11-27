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

// make the notification interactive when hovering
function openNoti(evt, notiKind) {
    var i, notiType, notiLinks;
    notiType = document.getElementsByClassName("notiType");
    for (i = 0; i < notiType.length; i++) {
        notiType[i].style.display = "none";
    }
    notiLinks = document.getElementsByClassName("notiLinks");
    for (i = 0; i < notiLinks.length; i++) {
        notiLinks[i].className = notiLinks[i].className.replace(" active", "");
    }
    document.getElementById(notiKind).style.display = "block";
    evt.currentTarget.className += " active";
}

// *****************
// DASHBOARD SECTION
// *****************


// Chart1 - bar chart - Proportion of Channels to Categories
let svgWidth = 500; // 600 originally - tt
let bSvgHeight = 400; // 600 originally - tt
let padding = 80;


// create svg for chart 1
let chart1Svg = d3
    .select("#chart1")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('viewBox', '0 0 500 400')
    .attr("style", "background-color: #2c2b2b")
    .style("box-shadow", "0 0 15px 2px #c0c0c055")
    .style("border-radius", "4px")

// set width and height for chart svg content
let bInner_width = svgWidth - padding;
let bInner_height = bSvgHeight - padding - 20;

let bG = chart1Svg
    .append("g")
    .attr("class", "group")
    .attr("transform", "translate(65, 10)")

// add bar chart title 
bG
    .append("text")
    .attr("text-anchor", "center")
    .attr("x", bInner_width / 8)
    .attr("y", 20)
    .text("Proportion of YouTubers per Category")
    .style("fill", "#fff")
    .style("font-size", 17)
    .style("letter-spacing", 0.8)


//prepare data
d3.csv("./data/top_100_youtubers.csv").then(function (data) {

    // find the categories 
    const categoryCounts = {};
    data.forEach((obj) => {
        const category = obj['Category'];
        if (category) {
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        }
    });

    // Calculate the total number of categories
    const totalCategories = Object.values(categoryCounts).reduce((acc, count) => acc + count, 0);

    //Calculate the proportion percentage for each category
    data = Object.entries(categoryCounts).map(([category, count]) => ({
        category: category,
        percentage: ((count / totalCategories) * 100).toFixed(0),
    }));

    // console.log("data: ", data)

    // create xScale for bar chart
    let bXscale = d3
        .scaleBand()
        .range([0, bInner_width - 30])
        .domain(data.map((d) => d.category))


    // create xAxis   
    let bXaxis = d3.axisBottom().scale(bXscale)

    // append  xAxis
    const bottom = bG.append("g")
        .attr("transform", `translate(0,${bInner_height})`)
        .call(bXaxis)
        .attr("color", "#c0c0c0")

    // add angled labels
    bottom
        .selectAll('.tick text')
        .attr("transform", "rotate(-35)")
        .style("text-anchor", "end")
        .style("color", "#c0c0c0")
        .style("font-family", "noto")
        .style("font-size", 9)

    // create group for axis title
    const labelGroup = bG.append("g")
        .attr("transform", "translate(" + (bInner_width / 2.5) + "," + (bInner_height + 60) + ")");

    // Add axis title
    labelGroup.append("text")
        .style("text-anchor", "middle")
        .style("fill", "#fff")
        .style("font-family", "noto")
        .style("font-size", 15)
        .style("letter-spacing", 1)
        .text("Categories");


    // Create Y scale
    let bYscale = d3.scaleLinear().range([bInner_height, 0]).domain([0, 100]).range([300, 50]);

    // append y axis
    let bYaxis = d3.axisLeft().scale(bYscale).ticks(12);

    // append label and label style
    bG.append("g")
        .call(bYaxis)
        .attr('color', "#c0c0c0")
        .append("text")
        .attr("class", "naming")
        .attr("transform", "rotate(-90)")
        .attr("x", -150)
        .attr("y", -40)
        .attr("fill", "#fff")
        .text("Rating")
        .style("font-family", "noto")
        .style("font-size", 13)
        .style("letter-spacing", 2);

    let graph = bG.selectAll(".graph").data(data).enter().append("g");

    graph
        .append("rect")
        .attr("class", "barC5")
        .attr("x", function (d) {
            return bXscale(d.category) + 10;
        })
        .attr("y", function (d) {
            return bYscale(d.percentage) - 1;
        })
        .attr("width", bXscale.bandwidth() - 20)
        .attr("height", function (d) {
            return bInner_height - bYscale(d.percentage);
        })
        .attr("fill", "#D4Af37");

    graph
        .append("text")
        .attr('text-anchor', "start")
        .attr("x", function (d) {
            return bXscale(d.category) - 5;
        })
        .attr("y", function (d) {
            return bYscale(d.percentage);
        })
        .attr("dx", "1.4em")
        .attr("dy", "-0.5em")
        .text(function (d) {
            return `${d.percentage} % `;
        })
        .attr("fill", "#D4Af37")
        .attr("class", "textChart")
        .style("font-size", 12)
});






