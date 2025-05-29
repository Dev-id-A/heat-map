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


        
    }

    fetchData()
        .then(data => {
            createSVG(data)
            console.log(data);
            console.log(data.monthlyVariance[5]);
            console.log(data.monthlyVariance[67].year);
        })