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
                            .tickValues(d3.range(1760, 2015, 10))
                            .tickFormat(d3.format("d"));

        svg.append("g")
            .attr("id", "x-axis")
            .attr("transform", `translate(0, ${height - padding*1.5})`)
            .style("font-size", "7px")
            .call(xAxis)
    
//yScale
const months = ["December", "November", "October", "September", "August", "July", "June", "May", "April", "March", "February", "January" ]
        const yScale = d3.scaleBand()
                            .domain(months)
                            .range([height - padding*1.5, padding])

        const yAxis = d3.axisLeft(yScale);
                            
        svg.append("g")
            .attr("id", "y-axis")
            .attr("transform", `translate(${padding}, 0)`)
            .call(yAxis);


        
    }

    fetchData()
        .then(data => {
            createSVG(data)
            console.log(data);
            console.log(data.monthlyVariance[5]);
            console.log(data.monthlyVariance[67].year);
        })