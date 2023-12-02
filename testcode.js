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
    .style("box-shadow", "0 0 15px 2px #c0c0c055")
    .style("border-radius", "4px")

// add paddings in svg
var innerWidth = width - padding;
var innerHeight = height - padding;


// Add Title
svgCh5
    .append("text")
    .attr("text-anchor", "center")
    .attr("x", innerWidth / 3.5)
    .attr("y", 15)
    .text("Top 5 Channels' Quarterly Income")
    .style("fill", "#fff")
    .style("font-size", 17)
    .style("letter-spacing", 0.8)


// Create the first group to add the chart
var gbhG = svgCh5.append('g')
    .attr('transform', 'translate(50, 30)')

// Read data
d3.csv("data/top_100_youtubers.csv").then((data) => {

    const stackedBarChartData = [];
    const topFiveYouTubers = [];
    const totalEarningsGraph = [];
    const topFive = data.slice(0, 5);
    const maxEarnings = []

    // topFive.forEach((d) => {
    //     const totalIncome =
    //         parseFloat(d["Income q1"]) +
    //         parseFloat(d["Income q2"]) +
    //         parseFloat(d["Income q3"]) +
    //         parseFloat(d["Income q4"]);
    //     const roundedTotal = +totalIncome.toFixed(2);
    //     stackedBarChartData.push({
    //         channelName: d.ChannelName,
    //         total: roundedTotal,
    //     });
    // });

    // extract quarterly incomes
    let q1Values = topFive.map(d => +d["Income q1"])
    console.log(q1Values)
    let q2Values = topFive.map(d => +d["Income q2"])
    let q3Values = topFive.map(d => +d["Income q3"])
    let q4Values = topFive.map(d => +d["Income q4"])
    console.log(q1Values)

    let subGroups = [
        { Q1: q1Values },
        { Q2: q2Values },
        { Q3: q3Values },
        { Q4: q4Values },
    ]

    console.log(subGroups)


    // stackedBarChartData.forEach((d) => totalEarningsGraph.push(d.total));
    // topFive.forEach((y) => topFiveYouTubers.push(y.ChannelName));
    // const quarterlyEarningsKey = data.columns.slice(19);
    // const stackedEarnings = d3.stack().keys(quarterlyEarningsKey)(topFive);

    // create xScale
    const xScale = d3
        .scaleLinear()
        .domain(d3.extent([...q1Values, ...q2Values, ...q3Values, ...q4Values]))
        .range([0, innerWidth - 20])

    // create bottom axis
    const xAxis = d3
        .axisBottom()
        .scale(xScale)

    /// append bottom axis to group
    gbhG.append("g")
        .attr("transform", "translate(0, " + innerHeight + ")")
        .call(xAxis.tickFormat((d) => d / 1000 + "k"))
        .style("color", "#c0c0c0")
        .selectAll("text")
        .style("font-size", "12px")
    // .attr("transform", "rotate(-25)");

    // create scale and axis and append
    const yScale = d3
        .scaleBand()
        .range([innerHeight, 0])
        .domain(["Q1", "Q2", "Q3", "Q4"])
        .paddingOuter([0.5])
        .paddingInner([0.5])

    const yAxis = d3.axisLeft().scale(yScale);

    gbhG.append("g")
        .call(yAxis)
        .style("color", "#c0c0c0")
        .selectAll("text")
        .style("font-size", "12px");

    gbhG.append("g")
        .append("text")
        .text("Total Earnings")
        .attr("class", "side-axis")
        .attr("fill", "#333")
        .style("transform", "rotate(-90deg)")
        .attr("x", -115)
        .attr("y", -35)
        .style("font-size", "10px");

    // create color list for bars
    const color = d3
        .scaleOrdinal()
        .domain(topFive.map((d) => d["ChannelName"]))
        .range(['maroon', 'blue', 'purple', '#D4Af37', '#FF7119']);


    // create subGroups for the bars
    const barsGroup = gbhG.append("g")
        .selectAll('g')
        .data(topFive)
        .attr("transform", `translate(0, d=> d["ChannelName"]})`)


    gbhG.append('g')
        .selectAll('g')
        .data(topFive)
        .join('g')
        .attr('transform', `translate(20, 0)`)
        .selectAll('rect')
        .data(function (d) {
            console.log(subGroups.map(function (key) {
                return {
                    'quarter': key, 'sales': d[key]
                }
            }))
            return subGroups.map(function (key) {
                return {
                    'quarter': key, 'income': d[key]

                }

            });
        })
        .join('rect')
        .attr('x', 20)
        .attr('y', d => yScale(d["ChannelName"]))
        .attr('width', d => xScale(d["Income q1"]))
        .attr('height', 20)
        .attr('fill', d => color(d.quarter))


    // gbhG.append("g")
    //     .selectAll("g")
    //     .data(stackedEarnings)
    //     .join("g")
    //     .attr("fill", (d) => color(d.key))
    //     .selectAll("rect")
    //     .data((d) => d)
    //     .join("rect")
    //     .attr("x", (d) => xScale(d.data.ChannelName))
    //     .attr("y", (d) => yScale(d[1]))
    //     .attr("width", xScale.bandwidth())
    //     .attr("height", (d) => yScale(d[0]) - yScale(d[1]));




})