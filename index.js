'use strict'


// Open page
function openPage(id) {
    const containerList = document.querySelectorAll('.contentContainer');

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

    }

    else {
        hamburger.classList.remove('active')
        navbar.classList.remove('nav-hamburger')


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

// Global variables for all charts
let width = 500;
let height = 400;
let padding = 80;


//********************************** */
// CHART 1 
//********************************** */

// create svg for chart 1
let chart1Svg = d3
    .select("#chart1")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('viewBox', '0 -20 500 400')
    .attr("style", "background-color: #2c2b2b")
    .style("box-shadow", "0 0 15px 2px #c0c0c055")
    .style("border-radius", "4px")

// set width and height for chart svg content
let bInner_width = width - padding;
let bInner_height = height - padding - 20;

let bG = chart1Svg
    .append("g")
    .attr("class", "group")
    .attr("transform", "translate(65, 10)")

// add bar chart title 
bG
    .append("text")
    .attr("text-anchor", "center")
    .attr("x", bInner_width / 8)
    .attr("y", 0)
    .text("Percentage of YouTubers per Category")
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


    // create scales
    let bXscale = d3
        .scaleBand()
        .range([-20, bInner_width - 20])
        .paddingOuter(0.3)
        .domain(data.map((d) => d.category))

    let bYscale = d3.scaleLinear().range([bInner_height + 20, 40]).domain([0, 50]);

    // create Axis'  
    let bXaxis = d3.axisBottom().scale(bXscale)
    let bYaxis = d3.axisLeft().scale(bYscale) // add .tickFormat("") if you want numbers gone;

    // append  xAxis
    const bottomAxis = bG.append("g")
        .attr("transform", `translate(0,${bInner_height + 20})`)
        .call(bXaxis)
        .attr("color", "#c0c0c0")

    // add angled labels
    bottomAxis
        .selectAll('.tick text')
        .attr("transform", "rotate(-25)")
        .style("text-anchor", "end")
        .style("color", "#c0c0c0")
        .style("font-family", "noto")
        .style("font-size", 9)


    // append label and label style for yAxis
    bG.append("g")
        .attr("transform", `translate(-20, 0)`)
        .call(bYaxis)
        .attr('color', "#c0c0c0")
        .style("font-size", 8)


    let graph = bG.selectAll(".graph").data(data).enter().append("g");

    // add graph - bars
    graph
        .append("rect")
        .attr("class", "barC5")
        .attr("x", function (d) {
            return bXscale(d.category) + 10;
        })
        .attr("y", function (d) {
            return bYscale(d.percentage);
        })
        .attr("width", bXscale.bandwidth() - 20)
        .attr("height", function (d) {
            return 320 - bYscale(d.percentage);
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



//********************************************************************** */
// CHART 2 - scatter plot - Relationship between Likes and subscribers
//********************************************************************** */

// create svg for chart 1
let svgChart2 = d3
    .select("#chart2")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('viewBox', '0 -20 500 400')
    .attr("style", "background-color: #2c2b2b")
    .style("box-shadow", "0 0 15px 2px #c0c0c055")
    .style("border-radius", "4px")

const scatterPlotInnerWidth = width - padding
const scatterPlotInnerHeight = height - padding;

let spG = svgChart2
    .append("g")
    .attr("class", "group")
    .attr("transform", "translate(65, 10)")

// add scatterplot title 
spG
    .append("text")
    .attr("text-anchor", "center")
    .attr("x", bInner_width / 8)
    .attr("y", 0)
    .text("Relationship Between Likes and Subs")
    .style("fill", "#fff")
    .style("font-size", 17)
    .style("letter-spacing", 0.8)


// read data 
d3.csv("./data/top_100_youtubers.csv").then(function (data) {

    // color set for circles
    var color = d3.scaleOrdinal()
        .domain(data)
        .range(['blue', 'purple', 'maroon', '#FF7119'])

    // Creating scales
    const xscale = d3
        .scaleLinear()
        .range([0, scatterPlotInnerWidth - 20])
        .domain([200, d3.max(data, (d) => +d.Likes)])

    const yscale = d3
        .scaleLinear()
        .range([scatterPlotInnerHeight, 40])
        .domain([0, d3.max(data, (d) => +d.followers)]);

    // Creating axis'
    const xaxis = d3.axisBottom().scale(xscale);
    const yaxis = d3.axisLeft().scale(yscale);

    const createXaxis = spG
        .append("g")
        .call(xaxis.tickFormat((d) => d / 1000000 + "m").tickSize(-scatterPlotInnerHeight + 40))
        .attr("transform", `translate(0, ${scatterPlotInnerHeight})`)
        .attr("color", "#c0c0c055")
        .attr("style", "font-family: noto")

    // add label to xaxis
    createXaxis
        .append("text")
        .text("Likes")
        .attr("class", "axis-name")
        .attr("fill", "#fff")
        .attr("x", 170)
        .attr("y", 30)
        .style("font-family", "noto")
        .style("font-size", 15);


    // create y axis    
    const createYaxis = spG
        .append("g")
        .call(yaxis.tickFormat((d) => d / 100000 + "m").tickSize(-scatterPlotInnerWidth + 20))
        .attr("color", "#c0c0c055")
        .attr("style", "font-family: noto")


    // add label to y axis
    createYaxis
        .append("text")
        .text("Subscribers")
        .attr("class", "axis-name")
        .attr("fill", "#fff")
        .style("transform", "rotate(-90deg)")
        .attr("x", -150)
        .attr("y", -45)
        .style("font-family", "noto")
        .style("font-size", 15);


    // Populating the chart
    spG
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("r", 4)
        .attr("cx", (d) => xscale(0))
        .attr("cy", (d) => yscale(0))
        .style("fill", d => color(d.Likes))
        .style("opacity", 1)

    spG.selectAll("circle")
        .transition()
        .duration(1000)
        .attr("cx", (d) => xscale(d.Likes))
        .attr("cy", (d) => yscale(d.followers))
        .delay((d, i) => i * 10);

    // add mouseover tool tip
    spG.selectAll("circle")
        .on("mouseover", function () {
            //show the value of the ID and Flight_Distance when the mouse is over the data point
            d3.select(this)
                .transition()
                .duration(100)
                .attr("r", 8)

            // Create a function to show the value of the data point on the top of the data point whenever the mouse is over the data point.
            function showToolTip(d) {
                console.log('d: ', d)
                console.log(d.ChannelName)
                return d.ChannelName;
            }
            //Show only the value of the data point when the mouse is over the data point
            d3.select(this)
                .append("title")
                .text(showToolTip)
            console.log("is this working?");
        })

        //when the mouse is out of the data point, the value will disappear
        .on("mouseout", function () {
            d3.select(this)
                .transition()
                .duration(1000)
                .attr("r", 5)
                .attr("fill", "#821214")
                .attr("opacity", ".5");
        });
})

//****************************************************** */
// CHART 3 - Each Countries number of youtubers
//****************************************************** */



// Create SVG element
var svg = d3.select('#chart3')
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('viewBox', '0 -20 500 400')
    .attr("style", "background-color: #2c2b2b")
    .style("box-shadow", "0 0 15px 2px #c0c0c055")
    .style("border-radius", "4px")

// add paddings in svg
var innerWidth = width - padding; // 400
var innerHeight = height - padding; // 300


// Add Title
svg
    .append("text")
    .attr("text-anchor", "center")
    .attr("x", innerWidth / 3.5)
    .attr("y", 15)
    .text("Number Youtubers in Each Country")
    .style("fill", "#fff")
    .style("font-size", 17)
    .style("letter-spacing", 0.8)


// Create the first group to add the chart
var g = svg.append('g')
    .attr('transform', 'translate(60, 10)')
    .attr('class', 'graph')

// 7. Get the data from the csv file
d3.csv('./data/top_100_youtubers.csv').then(function (data) {

    // color set for bars
    var color = d3.scaleOrdinal()
        .domain(data)
        .range(['maroon', 'blue', 'purple',])


    // Find number of youtubers in each country
    const countryCount = [];
    data.forEach((obj) => {
        const country = obj['Country'];
        if (country) {
            countryCount[country] = (countryCount[country] || 0) + 1;
        }
    });

    // create new data object
    data = Object.entries(countryCount).map(([country, count]) => ({
        country: country,
        count: count,
    }));

    // chart scales
    var xScale = d3.scaleBand()
        .range([0, innerWidth - 30])
        .paddingInner(0.2)
        .paddingOuter(0.5)
        .domain(data.map(d => d.country))

    var yScale = d3.scaleLinear()
        .range([innerHeight, 40])
        .domain([0, d3.max(data, d => parseInt(d.count))])


    // create xAxis
    var xAxis = d3.axisBottom()
        .scale(xScale)
    // create yAxis 
    var yAxis = d3.axisLeft()
        .scale(yScale)

    // append the xAxis
    g.append('g')
        .attr('transform', 'translate(0, ' + innerHeight + ')')
        .call(xAxis.tickSize(12))
        .attr("style", "color: #c0c0c0")
        .attr("font-family", "noto")


    // append the yAxis
    g.append('g')
        .call(yAxis)
        .style("color", "#c0c0c0")



    // create g for data bars
    var graph = g.selectAll('.graph')
        .data(data)
        .enter()
        .append('g')

    // append the bars
    graph.append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(d.country))
        .attr('y', d => yScale(0))
        .attr('width', xScale.bandwidth())
        .attr('height', d =>
            innerHeight - yScale(0))
        .attr("fill", d => color(d.country))

    //  add text number to bars
    graph.append('text')
        .attr('class', 'number')
        .attr("text-anchor", "start")
        .attr('x', function (d) { return xScale(d.country) })
        .attr('y', function (d) { return yScale(+d.count) })
        .attr('dx', '.25em')
        .attr('dy', d => d.count - 10)
        .text(function (d) {
            return d.count
        })
        .attr('fill', '#c0c0c0')
        .style('opacity', 0)

    // transition for the chart
    svg.selectAll('rect')
        .transition()
        .duration(800)
        .attr('y', d =>
            yScale(parseInt(d.count)))

        .attr('height', d => innerHeight - yScale(parseInt(d.count)))
        .delay(function (d, i) {
            return i * 100
        })

    // 15. Add transition to change opacity of your label
    g.selectAll('.number')
        .transition()
        .duration(800)
        .style('opacity', 1)
        .delay(function (d, i) {
            return i;
        })
})





