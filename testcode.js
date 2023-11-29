
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
    .style("box-shadow", "0 0 15px 2px #c0c0c055")
    .style("border-radius", "4px")

// add paddings in svg
var innerWidth = width - padding;
var innerHeight = height - padding;


// Add Title
svgCh4
    .append("text")
    .attr("text-anchor", "center")
    .attr("x", innerWidth / 3.5)
    .attr("y", 15)
    .text("Top 5 Channels' Annual Average View")
    .style("fill", "#fff")
    .style("font-size", 17)
    .style("letter-spacing", 0.8)


// Create the first group to add the chart
var lcG = svgCh4.append('g')
    .attr('transform', 'translate(50, 0)')
    .attr('class', 'graph')

// Read data
d3.csv("data/avg_view_every_year.csv").then((data) => {

    // Extract the list of subjects from the data
    var subjects = data.columns.slice(1);

    // color set for lines
    var color = d3.scaleOrdinal()
        .domain(data)
        .range(['maroon', 'blue', 'purple', '#D4Af37', '#FF7119'])

    // Add X scale
    var lcxScale = d3
        .scaleLinear()
        .domain(
            d3.extent(data, function (d) {
                console.log(d.Year)
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
                return +d3.max(subjects, function (subject) {
                    return +d[subject];
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

            line.attr("opacity", 1);
        });

    // Add a line for each subject
    var line = lcG
        .selectAll(".line")
        .data(subjects)
        .enter()
        .append("path")
        .attr("class", function (d) {
            return d;
        })
        .attr("fill", "none")
        .attr("opacity", 1)
        .attr("d", function (subject) {
            return d3
                .line()
                .x(function (d) {
                    return lcxScale(d.Year);
                })
                .y(function (d) {
                    return lcyScale(+d[subject]);
                })(data);
        })
        .style("stroke", function (s) {
            return color([subjects.indexOf(s)]);
        })
        .attr("stroke-width", 3)

    // Add legend group
    var legend = lcG
        .selectAll(".legend")
        .data(subjects)
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
        .style("fill", function (subject) {
            return color([subjects.indexOf(subject)]);
        })
        .on("click", function (event, d) {
            console.log(event, d)
            line.attr("opacity", 0);
            d3.select("." + d).attr("opacity", 1);
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
