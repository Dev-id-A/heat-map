//Variables
    const width = 800;
    const height = 500;
    const padding = 100;

//Fetching data
    async function fetchData() {
        try{
            const response = await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json");
            const data = await response.json();
            return data
        }   
        catch(e){
            window.alert("There was an error trying to obtain data.")
        }
    };

//SVG creation
    const createSVG = data => {
        const svg = d3.select("body")
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox",`0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .style("background-color", "wheat");

//Title
        svg.append("text")
            .text("Monthly Global Land-Surface Temperature")
            .attr("id", "title")
            .attr("y", padding/3)
            .attr("x", width/3);

//Description
        svg.append("text")
            .text(`1753 - 2015: base temperature ${data.baseTemperature}℃`)
            .attr("id", "description")
            .attr("y", padding/1.7)
            .attr("x", width/2.7)
            .style("font-size", "14px");

//xScale
        const xScale = d3.scaleLinear()
                            .domain(d3.extent(data.monthlyVariance, d=>d.year))
                            .range([padding, width - padding]);

        const xAxis = d3.axisBottom(xScale)
                            .tickValues(d3.range(1760, 2016, 10))
                            .tickFormat(d3.format("d"));

        svg.append("g")
            .attr("id", "x-axis")
            .attr("transform", `translate(0, ${height - padding * 1.5})`)
            .style("font-size", "7px")
            .call(xAxis)
    
//yScale
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

        const yScale = d3.scaleBand()
                            .domain(months)
                            .range([padding, height - padding * 1.5])
                            .padding(0.1);

        const yAxis = d3.axisLeft(yScale);
                            
        svg.append("g")
            .attr("id", "y-axis")
            .attr("transform", `translate(${padding}, 0)`)
            .call(yAxis);

//Cells 
const dataColors = (d) =>{
    return d <= 4 ? "#4169E1":
    d <= 6 ? "#7EC0EE":
    d <= 8 ? "#E0FFFF":
    d <= 10 ? "#FFA07A" :
    d <= 12 ? "#FF7F50" :
    d > 12 ? "#CD5B45" : "";
    }

const totalYears = d3.max(data.monthlyVariance, d =>d.year) - d3.min(data.monthlyVariance, d => d.year) + 1;

        const cells = svg.selectAll("rect")
                            .data(data.monthlyVariance)
                            .enter()
                            .append("rect")
                            .attr("class", "cell")
                            .attr("x", d => xScale(d.year))
                            .attr("y", d => yScale(months[d.month - 1]))
                            .attr("width", (width - padding * 2) / totalYears)
                            .attr("height", yScale.bandwidth())
                            .attr("fill", d =>{
                                const varTemp = data.baseTemperature + d.variance;
                                return dataColors(varTemp);
                            });

//Cells data
        cells.attr("data-month", d => d.month - 1)
                .attr("data-year", d => d.year)
                .attr("data-temp", d => data.baseTemperature + d.variance);

//Legend
const minTemp = d3.min(data.monthlyVariance, d => data.baseTemperature + d.variance) - 1;
const maxTemp = d3.max(data.monthlyVariance, d => data.baseTemperature + d.variance) + 1;

        const legendScale = d3.scaleLinear()
                                .domain([minTemp, maxTemp])
                                .range([width - padding * 2, width - 20]);

        const legendAxis = d3.axisTop(legendScale);

        const legend = svg.append("g")
                            .attr("id", "legend")
                            .attr("transform", `translate(0, ${padding/2.5})`)
                            .call(legendAxis);
        
        legend.selectAll("rect")
                .data([4, 6, 8, 10, 12, 14])
                .enter()
                .append("rect")
                .attr("x", d => legendScale(d) - 25)
                .attr("y", 0)
                .attr("width", 25)
                .attr("height", 10)
                .attr("fill", d => dataColors(d))
                .attr("stroke", "black");

//Tooltip creation
        const tooltip = d3.select("body")
                            .append("div")
                            .attr("id", "tooltip")

//Tooltip styling
                            .style("position", "absolute")
                            .style("opacity", 0)
                            .style("padding", "1%")
                            .style("border", "2px solid black")
                            .style("font-size", "16px")
                            .style("border-radius", "10px")
                            .style("text-align", "center");

//Tooltip adittion
        cells.attr("data-year", d => d.year)
                .on("mouseover", (e, d) =>{
                    tooltip.style("opacity", 1)
                            .style("display", "block")
                            .style("background-color", dataColors(data.baseTemperature + d.variance))
                            .attr("data-year", d.year)
                            .html(`${d.year} - ${months[d.month - 1]}<br>
                                    ${Math.round((data.baseTemperature + d.variance) * 10)/10} ℃<br>
                                    ${d.variance}` );

                    d3.select(e.currentTarget)
                        .style("stroke", "black");
                })
                .on("mousemove", e =>
                    tooltip.style("left",(e.pageX + 10) + "px")
                            .style("top",(e.pageY + 10) + "px")
                )
                .on("mouseout", e => {
                    tooltip.style("opacity", 0)
                            .attr("display", "none");
                    
                    d3.select(e.currentTarget)
                        .style("stroke", "none")
                        });
    }

    fetchData()
        .then(data => createSVG(data))