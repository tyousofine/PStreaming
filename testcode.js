
let svgChart3 = d3
    .select("#chart3")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('viewBox', '0 -20 500 400')
    .attr("style", "background-color: #2c2b2b")
    .style("box-shadow", "0 0 15px 2px #c0c0c055")
    .style("border-radius", "4px")


let barChartG = svgChart3
    .append("g")
    .attr("class", "group")
    .attr("transform", "translate(50, 10)")

// add chart title 

barChartG
    .append("text")
    .attr("text-anchor", "center")
    .attr("x", bInner_width / 8)
    .attr("y", 0)
    .text("Number of Youtubers in Each Country")
    .style("fill", "#fff")
    .style("font-size", 17)
    .style("letter-spacing", 0.8)

d3.csv("./data/top_100_youtubers.csv").then(function (data) {

    // Find number of youtubers in each country
    const countryCount = [];
    data.forEach((obj) => {
        const country = obj['Country'];
        if (country) {
            countryCount[country] = (countryCount[country] || 0) + 1;
        }
    });

    data = Object.entries(countryCount).map(([country, count]) => ({
        country: country,
        count: count,
    }));

    console.log(data)

    // color set for circles
    var color = d3.scaleOrdinal()
        .domain(data)
        .range(['blue', 'purple', 'maroon', '#FF7119'])

    // Creating scales
    const xscale = d3
        .scaleBand()
        .range([0, scatterPlotInnerWidth - 20])
        .domain(data.map((d) => d.country))

    const yscale = d3
        .scaleLinear()
        .range([scatterPlotInnerHeight, 40])
        .domain([0, d3.max(data, (d) => d.count)]);

    // Creating axis'
    const xaxis = d3.axisBottom().scale(xscale);
    const yaxis = d3.axisLeft().scale(yscale);


    const createXaxis = barChartG
        .append("g")
        .call(xaxis)
        .attr("transform", `translate(0, ${scatterPlotInnerHeight})`)
        .attr("color", "#c0c0c0")
        .attr("style", "font-family: noto")

    // create y axis    
    const createYaxis = barChartG
        .append("g")
        .call(yaxis)
        .attr("color", "#c0c0c0")
        .attr("style", "font-family: noto")


    // // 11. Binding data with g element
    var graph = barChartG.selectAll('.graph')
        .data(data)
        .enter()
        .append('g')

    // 12. Append the rectangles
    graph.append('rect')
        .attr('x', (d) => { return xscale(d.country) })
        .attr('y', (d) => scatterPlotInnerHeight - d.count)
        .attr('width', xscale.bandwidth())
        .attr('height', (d) => d.count * 20)




    // // 14. Add transition for the chart
    // barChartG.selectAll('rect')
    //     .transition()
    //     .duration(800)
    //     .attr('y', function (d) {
    //         return yscale(parseInt(d.grade))
    //     })
    //     .attr('height', function (d) {
    //         return innerHeight - yscale(parseInt(d.grade))
    //     })
    //     .delay(function (d, i) {
    //         return i * 100
    //     })

    // // 15. Add transition to change opacity of your label
    // g.selectAll('.dataLabel')
    //     .transition()
    //     .duration(800)
    //     .style('opacity', 1)
    //     .delay(function (d, i) {
    //         return i;
    //     })


})





