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
    // .style("box-shadow", "0 0 15px 2px #c0c0c055")
    .style("border-radius", "4px")

// set width and height for chart svg content
let bInner_width = width - padding;
let bInner_height = height - padding - 20;

let bG = chart1Svg
    .append("g")
    .attr("class", "group")
    .attr("transform", "translate(65, 0)")

// add bar chart title 
// bG
//     .append("text")
//     .attr("text-anchor", "center")
//     .attr("x", bInner_width / 8)
//     .attr("y", 0)
//     .text("Percentage of YouTubers per Category")
//     .style("fill", "#fff")
//     .style("font-size", 17)
//     .style("letter-spacing", 0.8)


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
    let bYaxis = d3.axisLeft().scale(bYscale)

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


    let graph = bG.selectAll(".graph1").data(data).enter().append("g");

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

    // Define the brushing function
    const brush = d3.brushX()
        .extent([[-50, 290], [width, height]])
        .on("brush end", brushed);

    // Append the brushing area to the bottom axis
    const brushingArea = bG.append("g")
        .attr("class", "brush")
        .call(brush);


    // Define the brushed function
    function brushed(event) {
        const selection = event.selection;

        // Change the text color based on the brushed selection
        bottomAxis.selectAll('.tick text')
            .style("font-size", function (d) {
                const x = bXscale(d);
                return (x >= selection[0] && x <= selection[1]) ? "13px" : "9px";
            });
    }
});



//********************************************************************** */
// CHART 2 - scatter plot - Relationship between Likes and subscribers
//********************************************************************** */



// read data 
d3.csv("./data/top_100_youtubers.csv").then(function (data) {
    // create svg for chart
    let svgChart2 = d3
        .select("#chart2")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr('viewBox', '0 -20 500 400')
        .attr("style", "background-color: #2c2b2b")
        .style("border-radius", "4px")

    const scatterPlotInnerWidth = width - padding
    const scatterPlotInnerHeight = height - padding;

    let spG = svgChart2
        .append("g")
        .attr("class", "group")
        .attr("transform", "translate(65, 0)")

    // // add scatterplot title 
    // spG
    //     .append("text")
    //     .attr("text-anchor", "center")
    //     .attr("x", bInner_width / 8)
    //     .attr("y", 0)
    //     .text("Relationship Between Likes and Subs")
    //     .style("fill", "#fff")
    //     .style("font-size", 17)
    //     .style("letter-spacing", 0.8)

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
    const circle = spG
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
            //show the value
            d3.select(this)
                .transition()
                .duration(100)
                .attr("r", 8)

            // helperFunction
            function showToolTip(d) {
                return d.ChannelName;
            }
            //Show only the value of the data point when the mouse is over the data point
            d3.select(this)
                .append("title")
                .text(showToolTip)
        })

        //when the mouse is out of the data point, the value will disappear
        .on("mouseout", function () {
            d3.select(this)
                .transition()
                .duration(1000)
                .attr("r", 5)
                .attr("fill", "#fff")
                .attr("opacity", ".5");
        });


    // // Adding brushing
    // const updateChart = ({ selection }) => {
    //     // const { selection } = d3.event;
    //     circle.classed("circle-selected", (d) =>
    //         isBrushed(
    //             selection,
    //             xscale(d.Likes) + 40,
    //             yscale(d.followers) + 40
    //         )
    //     );
    // };

    // const isBrushed = (edge, cx, cy) => {
    //     const x0 = edge[0][0],
    //         x1 = edge[1][0],
    //         y0 = edge[0][1],
    //         y1 = edge[1][1];

    //     return x0 <= cx && x1 >= cx && y0 <= cy && y1 >= cy;
    // };

    // spG.call(
    //     d3
    //         .brush()
    //         .extent([
    //             [0, 0],
    //             [scatterPlotInnerWidth - 100, scatterPlotInnerHeight - 100],
    //         ])
    //         .on("start brush", updateChart)
    // );

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
    .style("border-radius", "4px")

// add paddings in svg
var innerWidth = width - padding;
var innerHeight = height - padding;


// Add Title
// svg
//     .append("text")
//     .attr("text-anchor", "center")
//     .attr("x", innerWidth / 3.5)
//     .attr("y", 15)
//     .text("Number of Youtubers in Each Country")
//     .style("fill", "#fff")
//     .style("font-size", 17)
//     .style("letter-spacing", 0.8)


// Create the first group to add the chart
var g = svg.append('g')
    .attr('transform', 'translate(60, 0)')
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
    var graph = g.selectAll('.graph2')
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

    // transition to make labels phase in
    g.selectAll('.number')
        .transition()
        .duration(800)
        .style('opacity', 1)
        .delay(function (d, i) {
            return i;
        })
})


//***************************************************** */
// CHART 4 - Top 5 channels' annual average view comparison
//****************************************************** */


var svgCh4 = d3.select('#chart4')
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('viewBox', '0 -20 500 400')
    .attr("style", "background-color: #2c2b2b")
    .style("border-radius", "4px")

// add paddings in svg
var innerWidth = width - padding;
var innerHeight = height - padding;


// Add Title
// svgCh4
//     .append("text")
//     .attr("text-anchor", "center")
//     .attr("x", innerWidth / 3.5)
//     .attr("y", 15)
//     .text("Top 5 Channels' Annual Average View")
//     .style("fill", "#fff")
//     .style("font-size", 17)
//     .style("letter-spacing", 0.8)


// Create the first group to add the chart
var lcG = svgCh4.append('g')
    .attr('transform', 'translate(50, 0)')


// Read data
d3.csv("data/avg_view_every_year.csv").then((data) => {

    // Extract the list of subjects from the data
    var channelNames = data.columns.slice(1);

    // color set for lines
    var color = d3.scaleOrdinal()
        .domain(data)
        .range(['maroon', 'blue', 'purple', '#D4Af37', '#FF7119'])

    // Add X scale
    var lcxScale = d3
        .scaleLinear()
        .domain(
            d3.extent(data, function (d) {
                return +d.Year
            })
        )
        .range([0, innerWidth]);

    // create xAxis
    var lcxAxis = d3.axisBottom().scale(lcxScale)

    // add xAxis
    lcG.append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(lcxAxis.tickFormat(d3.format("d")).ticks(6))
        .attr("color", "#c0c0c0");

    // create y scale
    var lcyScale = d3
        .scaleLinear()
        .domain([
            0,
            d3.max(data, d => {
                return +d3.max(channelNames, function (channel) {
                    return +d[channel];
                });
            }),
        ])
        .range([innerHeight, 40]);

    // append yscale
    lcG.append("g")
        .call(d3.axisLeft(lcyScale)
            .tickFormat((d) => d / 1000000 + "m")
            .tickSize(5)).attr("color", "#c0c0c0");

    // Create background box for click on everywhere else to reset all lines
    lcG.append("g")
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("opacity", 0)
        .on("click", function (e) {
            d3.selectAll('.line').attr("opacity", 1)
        });


    // add lines to channel names
    channelNames.forEach((channel) => {
        lcG
            .append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("class", `line ${channel}`)
            .attr("stroke", color(channel))
            .attr("opacity", 1)
            .attr("stroke-width", 3)
            .attr(
                "d",
                d3.line().x((d) => lcxScale(d.Year)).y((d) => lcyScale(d[channel]))
            );

        const circle = lcG.append("g")
            .selectAll("circle")
            .data(data)
            .enter()
            .append("g")
            .append("circle")
            .attr("class", `line ${channel}`)
            .attr("opacity", 1)
            .attr("cx", (d) => lcxScale(d.Year))
            .attr("cy", (d) => lcyScale(d[channel]))
            .attr("r", 4)
            .attr("fill", color(channel))
            .attr("stroke", "none")
            .on("mouseover", function () {
                //show the value 
                d3.select(this)
                    .transition()
                    .duration(100)
                    .attr("r", 8)

                // helperFunction
                function showToolTip(d) {
                    return `${channel}, Views: ${d[channel]}`
                }
                //Show only the value of the data point when the mouse is over the data point
                d3.select(this)
                    .append("title")
                    .text(showToolTip)
            })

            //when the mouse is out of the data point, the value will disappear
            .on("mouseout", function () {
                d3.select(this)
                    .transition()
                    .duration(1000)
                    .attr("r", 4)
                    .attr("fill", color(channel))

            });

    })

    // Add legend group
    var legend = lcG
        .selectAll(".legend")
        .data(channelNames)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function (subjects, i) {
            return `translate(${i * 80}, ${0})`;
        });

    // add legend color box to legend group
    legend
        .append("rect")
        .attr("x", 20)
        .attr("y", height - 40)
        .attr("width", 35)
        .attr("height", 15)
        .attr("name", function (d) {
            return d;
        })
        .style("fill", function (channel) {
            return color([channelNames.indexOf(channel)]);
        })
        .on("click", function (event, d) {
            d3.selectAll(".line").attr("opacity", 0)
            d3.selectAll("." + d).attr("opacity", 1);
        });

    //add legend text to legend group
    legend
        .append("text")
        .attr("x", 15)
        .attr("y", height - 50)
        .attr("dy", "0.2rem")
        .style("text-anchor", "start")
        .style("font-size", 13)
        .style("fill", "#c0c0c0")
        .style("font-family", "noto")
        .text(function (d) {
            return d;
        })
})


//*************************************************************** */
// CHART 5 - group bar horizontal
//*************************************************************** */

var svgCh5 = d3.select('#chart5')
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('viewBox', '0 -20 500 400')
    .attr("style", "background-color: #2c2b2b")
    .style("border-radius", "4px")

// add paddings in svg
var innerWidth = width - padding;
var innerHeight = height - padding;


// // Add Title
// svgCh5
//     .append("text")
//     .attr("text-anchor", "center")
//     .attr("x", innerWidth / 3.5)
//     .attr("y", 15)
//     .text("Top 5 Channels' Quarterly Income")
//     .style("fill", "#fff")
//     .style("font-size", 17)
//     .style("letter-spacing", 0.8)


// Create the first group to add the chart
var hgcG = svgCh5.append('g')
    .attr('transform', 'translate(0, -10)')


// read and apply data
d3.csv("data/top_100_youtubers.csv").then(function (data) {


    const topFive = data.slice(0, 5);
    const quarterlyEarningsKey = data.columns.slice(19);

    // create scales
    const yScale = d3
        .scaleBand()
        .domain(topFive.map(d => d.ChannelName))
        .range([innerHeight, 40])
        .padding([0.2]);

    const xScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d3.max(quarterlyEarningsKey, key => +d[key]))])
        .range([80, innerWidth + 20]);

    // color scheme
    const color = d3
        .scaleOrdinal()
        .domain(quarterlyEarningsKey)
        .range(['blue', 'purple', 'maroon', '#FF7119']);

    // create axis   
    const xAxis = d3.axisBottom().scale(xScale)
    const yAxis = d3.axisLeft().scale(yScale)

    // append axis'
    hgcG.append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(xAxis.tickFormat((d) => d / 1000 + "k"))
        .style("color", "#c0c0c0")
        .style("font-family", "noto")


    const yAxisGroup = hgcG.append("g")
        .attr("transform", `translate(80, 0)`)
        .call(yAxis)
        .style("color", "#c0c0c0")
        .style("font-family", "noto")


    yAxisGroup.selectAll('text')
        .call(wrap, 10)


    // helper function for text wrap
    function wrap(text, width) {
        text.each(function () {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1, // ems
                y = text.attr("y"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em")
            while (word = words.pop()) {
                line.push(word)
                tspan.text(line.join(" "))
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop()
                    tspan.text(line.join(" "))
                    line = [word]
                    tspan = text.append("tspan").attr("x", -15).attr("y", y).text(word).attr("dy", `${++lineNumber * dy}em`).text(word)

                }
            }
        })
    }

    // create and apply group for bars 
    const barsGroup = hgcG.selectAll('.bars')
        .data(topFive)
        .enter()
        .append('g')
        .attr('transform', (d, i) => `translate(3, ${yScale(d.ChannelName)})`)
    // apply bars to grou
    const bars = barsGroup
        .selectAll('rect')
        .data(function (d) {
            return quarterlyEarningsKey.map(function (key) {
                return {
                    'quarter': key,
                    'value': +d[key]
                };
            });
        })
        .enter()
        .append('rect')
        .attr("class", "theBar")
        .attr('x', xScale(0))
        .attr('y', (d, i) => i * 10)
        .attr('width', d => xScale(d.value) - xScale(0))
        .attr('height', 10)
        .attr('fill', d => color(d.quarter))
        .on("mouseover", function (d, i) {



            // helperFunction - tooltip
            function showToolTip(d) {
                return d.value;
            }
            //Show only the value of the data point when the mouse is over the data point
            d3.select(this)
                .append("title")
                .text(showToolTip)
        })


    // Quarter 1 Legend
    hgcG.append("rect")
        .attr("x", 90)
        .attr("y", innerHeight + 40)
        .attr("width", 75)
        .attr("height", 15)
        .style("fill", "blue");

    hgcG.append("text")
        .attr("x", 120)
        .attr("y", innerHeight + 35)
        .attr("class", "legend")
        .text("Q1")
        .style("fill", "#c0c0c0")
        .style("font-size", 12)

    // Quarter 2 Legend
    hgcG.append("rect")
        .attr("x", 175)
        .attr("y", innerHeight + 40)
        .attr("width", 75)
        .attr("height", 15)
        .style("fill", "purple")


    hgcG.append("text")
        .attr("x", 205)
        .attr("y", innerHeight + 35)
        .attr("class", "legend")
        .text("Q2")
        .style("fill", "#c0c0c0")
        .style("font-size", 12)


    // Quarter 3 Legend
    hgcG.append("rect")
        .attr("x", 260)
        .attr("y", innerHeight + 40)
        .attr("width", 75)
        .attr("height", 15)
        .style("fill", "maroon");

    hgcG.append("text")
        .attr("x", 285)
        .attr("y", innerHeight + 35)
        .attr("class", "legend")
        .text("Q3")
        .style("fill", "#c0c0c0")
        .style("font-size", 12)


    // Quarter 4 Legend
    hgcG.append("rect")
        .attr("x", 345)
        .attr("y", innerHeight + 40)
        .attr("width", 75)
        .attr("height", 15)
        .style("fill", "#FF7119");

    hgcG.append("text")
        .attr("x", 370)
        .attr("y", innerHeight + 35)
        .attr("class", "legend")
        .text("Q4")
        .style("fill", "#c0c0c0")
        .style("font-size", 12)


});

//************************************************************* */
// CHART 6 - pie chart
//**************************************************************/

// list of countries
let countryList = ['IN', 'US', 'KR', 'CA', 'BR', 'MX', 'SV', 'CL', 'NO', 'PR', 'BY', 'RU', 'PH', 'TH']

// create and append d3 dropdown for user country selection
var dropdown = d3.select(".dropdown")
    .append('select');

dropdown.selectAll('option')
    .data(countryList)
    .enter()
    .append('option')
    .attr("id", "options")
    .text(function (d) {
        return d;
    })
    .attr('value', function (d) {
        return d;
    });


// Dropdown onChange
dropdown.on('change', function (d) {
    var selectedCountry = d3.select(this).property("value");
    switchCharts(selectedCountry)

})

// create chart canvas 
var svgCh6 = d3.select('#chart6')
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('viewBox', '0 -20 500 400')
    .attr("style", "background-color: #2c2b2b")
    .style("border-radius", "4px")



// event listener function for dropdown value change
function switchCharts(selectedCountry = "IN") {

    // remove all graph info from last selection

    d3.selectAll('.graph6').remove()
    d3.selectAll('.allPolylines').remove()
    d3.selectAll('.allLabels').remove()


    // importing data
    d3.csv("data/top_100_youtubers.csv").then(function (data) {


        // find the categories for selected country 
        const categoryCounts = {};
        data.forEach((obj) => {
            if (obj['Country'] === selectedCountry) {
                const category = obj['Category'];
                if (category) {
                    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
                }
            }
        });

        // Preparing data - return data to be used for chart
        const categoryPerCountry = Object.entries(categoryCounts).filter(
            (d) => d
        );

        // create group for chart elements
        const pcG = svgCh6
            .append("g")
            .attr("transform", `translate(${innerWidth / 1.7}, ${innerHeight / 1.8})`)
            .attr("class", "graph6");

        // define radius
        const radius = Math.min(innerWidth, innerHeight) / 2.5;

        // color scheme 
        const color = d3
            .scaleOrdinal()
            .range(['#FF7119', 'maroon', '#D4Af37', 'blue', 'purple',]);

        // define the pie to be used for the chart
        const pie = d3.pie().value((d) => {
            return d[1];
        });

        // define the arc to be used for labels and long ticks
        const arc = d3.arc().innerRadius(0).outerRadius(radius);

        // label arc for being outside the pie chart
        const labelArc = d3
            .arc()
            .innerRadius(radius)
            .outerRadius(radius * 1.5);

        // create the pie chart
        pcG.selectAll(".graph6")
            .data(pie(categoryPerCountry))
            .join("path")
            .attr("d", arc)
            .attr("fill", (d) => color(d.data[0]))
            .attr("stroke", "black")
            .style("stroke-width", "2px");

        //Add long ticks - polylines between chart and your labels.
        pcG.selectAll(".allPolylines")
            .data(pie(categoryPerCountry))
            .join("polyline")
            .attr("stroke", "#c0c0c0")
            .attr("fill", "none")
            .attr("stroke-width", 1)
            .attr("points", (d) => {
                let posA = arc.centroid(d);
                let posB = labelArc.centroid(d);
                let posC = labelArc.centroid(d);

                const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                console.log(posA[0])

                posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1);
                posC[0] = posC[0] < 0 ? posC[0] - 50 : posC[0] + 50;
                return [posA, posB, posC];
            });

        // add labels to data
        pcG.selectAll(".allLabels")
            .data(pie(categoryPerCountry))
            .join("text")
            .text((d) => `${d.data[0]} (${d.data[1]})`)
            .attr("transform", (d) => {
                const pos = labelArc.centroid(d);
                const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                pos[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1);
                pos[0] = pos[0] < 0 ? pos[0] - 50 : pos[0] + 10;
                pos[1] -= 2;
                return `translate(${pos})`;
            })
            .style("font-size", "12px")
            .style("fill", "#c0c0c0");

    })
}

// call switch chart to initiate the default value process on load.
switchCharts()



// **************************************************************
// Single Value Charts
// ***************************************************************


// chart7 - category that has most followers
d3.csv("data/top_100_youtubers.csv").then(function (data) {



    // Find number of youtubers in each country
    const categories = []
    data.forEach((obj) => {
        const category = obj['Category'];
        if (category) {
            categories[category] = (categories[category] || 0) + 1;
        }
    });

    const categoryWithMostFollowers = Object.entries(categories).filter(
        (d) => d[1] === d3.max(Object.entries(categories), (d) => d[1])
    );

    console.log("country with most youtubers: ", categoryWithMostFollowers)




    // create chart canvas 
    var svChart7 = d3.select("#chart7").append('g')

    //Title Text and styling
    svChart7.append("p").text("Category with most followers").attr("class", "title")

    //Channel Name and styling
    svChart7.append("p").text(categoryWithMostFollowers[0][0]).attr("class", "lineOne")
    //Number of likes for the channel and styling
    svChart7.append("p").text(categoryWithMostFollowers[0][1]).attr("class", "number")

})



// chart 8

d3.csv("data/top_100_youtubers.csv").then(function (data) {

    const svChart3Width = 100
    const svChart3Height = 100

    // Find the country with most youtubers
    const youtuberPerCountry = [];
    data.forEach((obj) => {
        const country = obj['Country'];
        if (country) {
            youtuberPerCountry[country] = (youtuberPerCountry[country] || 0) + 1;
        }
    });

    const countryWithMostYoutubers = Object.entries(youtuberPerCountry).filter(
        (d) => d[1] === d3.max(Object.entries(youtuberPerCountry), (d) => d[1])
    );


    // create chart canvas 
    var svChart8 = d3.select("#chart8")

    //Title Text and styling
    svChart8.append("p").text("Country with most youtubers").attr("class", "title")

    //Channel Name and styling
    svChart8.append("p").text(countryWithMostYoutubers[0][0]).attr("class", "lineOne")
    //Number of likes for the channel and styling
    svChart8.append("p").text(countryWithMostYoutubers[0][1]).attr("class", "number")

})


// CHART 9 - Name of channel with the most subs

d3.csv("data/top_100_youtubers.csv").then(function (data) {


    // Find channel with most subs
    const channelsAndFollowers = [];
    data.forEach((obj) => {
        channelsAndFollowers.push(
            {
                channel: obj.ChannelName,
                subs: parseInt(obj.followers)
            }
        )


    });

    const channelWithMostSubs = d3.max(channelsAndFollowers)

    console.log("channel with most subs", channelWithMostSubs)


    // create chart canvas 
    var svChart9 = d3.select("#chart9")

    //Title Text and styling
    svChart9.append("p").text("Channel with most subscribers").attr("class", "title")

    //Channel Name and styling
    svChart9.append("p").text(channelWithMostSubs.channel).attr("class", "lineOne")
    //Number of likes for the channel and styling
    svChart9.append("p").text(channelWithMostSubs.subs / 1000000 + "m").attr("class", "number")

})









