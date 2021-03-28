// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 40, left: 300};

let NUM_YEARS = 11
let START_POS2 = 0
current_type = "Movie"

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
// let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 250;
// let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 275;
// let graph_3_width = MAX_WIDTH / 2, graph_3_height = 575;
let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 400;
let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 400;
let graph_3_width = 700, graph_3_height = 700;


// Setup for Graph 1
let svg1 = d3.select("#graph1")     
    .append("svg")
    .attr("width", graph_1_width)     
    .attr("height", graph_1_height)     
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);  

let graph1_y_axis = svg1.append("g");
let countRef = svg1.append("g");

let x1 = d3.scaleLinear()
    .domain([])
    .range([0, graph_1_width - margin.left - margin.right]);

let y1 = d3.scaleBand()
    .domain([])
    .range([0, graph_1_height - margin.top - margin.bottom])
    .padding(0.1);

svg1.append("text")
    .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2},
                                    ${(graph_1_height - margin.top - margin.bottom) + 30})`) 
    .style("text-anchor", "middle")
    .text("Number of Titles");

svg1.append("text")
    .attr("transform", `translate(-150, ${(graph_1_height - margin.top - margin.bottom) / 2})`)  
    .style("text-anchor", "middle")
    .text("Genre")

let graph1_title = svg1.append("text")
    .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2}, ${-20})`)  
    .style("text-anchor", "middle")
    .style("font-size", 15)

let tooltip = d3.select("#graph1")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
// End Setup for Graph 1


function setGraph1(type) {
	d3.csv("../data/netflix.csv").then(function(data) {

		graph1_title.text(`Number of Titles Listed per ${type == "TV" ? "TV" : "Movie"} Genre on Netflix`)

		genre_lists = []
		data.map(function(e) {
			all_genres = e.listed_in.split(",")
			if(type == "TV"){
				for(let i = 0; i < all_genres.length; i++){
					g = all_genres[i].trim()
					if(g.includes("TV") || g.includes("series") || g.includes("Shows")){
						if(g in genre_lists){
							genre_lists[g].push(e.title)
						}
						else{
							genre_lists[g] = [e.title]
						}
					}
				}
			}
			else{
				for(let i = 0; i < all_genres.length; i++){
					g = all_genres[i].trim()
					if(!(g.includes("TV") || g.includes("series") || g.includes("Shows"))){
						if(g in genre_lists){
							genre_lists[g].push(e.title)
						}
						else{
							genre_lists[g] = [e.title]
						}
					}
				}
			}
		})

		counts = []
		for (const genre in genre_lists) {
			counts.push({"genre": genre, "count": genre_lists[genre].length})
		}
	    counts.sort((x,y) => y.count - x.count)


		let color = d3.scaleOrdinal()
	        .domain(counts.map(d => d.genre))
	        .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), counts.length));


	    x1.domain([0, d3.max(counts, d => d["count"])]);
	    y1.domain(counts.map(d => d["genre"] ));

	    graph1_y_axis.call(d3.axisLeft(y1).tickSize(0).tickPadding(10));

        let mouseover = function(d) {
            let color_span = `<span style="color: ${color(d.genre)};">`;
            let top3 = genre_lists[d.genre].slice(0, 4)
            let html = `${d.count} titles<br/>
                    ${color_span}listed as ${d.genre}<br>
                    including ${top3[1]}, ${top3[2]}, ${top3[3]} </span>`; 

            tooltip.html(html)
                .style("left", `${(d3.event.pageX) + 50}px`)
                .style("top", `${(d3.event.pageY) - 10}px`)
                .style("box-shadow", `2px 2px 5px ${color(d.genre)}`) 
                .transition()
                .duration(200)
                .style("opacity", 0.9)
        };

        let mouseout = function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", 0);
        };


        let bars = svg1.selectAll("rect").data(counts);

        bars.enter()
        .append("rect")
        .on("mouseover", mouseover) 
        .on("mouseout", mouseout)
        .merge(bars)
        .transition()
        .duration(1000)
        .attr("fill", function(d) {return color(d.genre) })
        .attr("x", x1(0) + 1)
        .attr("y", d => y1(d.genre))
        .attr("width", d => x1(d.count))
        .attr("height",  y1.bandwidth())

        let countMaker = countRef.selectAll("text").data(counts);

        countMaker.enter()
        .append("text")
        .merge(countMaker)
        .transition()
        .duration(1000)
        .attr("x", function(d) {return  x1(d.count) + 10})       
        .attr("y", function(d) { return y1(d.genre) + 10})       
        .style("text-anchor", "start")
        .text(d => d.count);  

        bars.exit().remove();
        countMaker.exit().remove();       

	})
}


// Setup for Graph 2
let svg2 = d3.select("#graph2")     
    .append("svg")
    .attr("width", graph_2_width)     
    .attr("height", graph_2_height)     
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);  

let graph2_y_axis = svg2.append("g");
let countRef2 = svg2.append("g");

let x2 = d3.scaleLinear()
    .domain([])
    .range([0, graph_2_width - margin.left - margin.right]);

let y2 = d3.scaleBand()
    .domain([])
    .range([0, graph_2_height - margin.top - margin.bottom])
    .padding(0.1);

let graph2_xaxis = svg2.append("text")
    .attr("transform", `translate(${(graph_2_width - margin.left - margin.right) / 2},
                                    ${(graph_2_height - margin.top - margin.bottom) + 30})`) 
    .style("text-anchor", "middle")
    .text("Average Runtime");

svg2.append("text")
    .attr("transform", `translate(-150, ${(graph_2_height - margin.top - margin.bottom) / 2})`)  
    .style("text-anchor", "middle")
    .text("Release Year")

let graph2_label = svg2.append("text")
    .attr("transform", `translate(${(graph_2_width - margin.left - margin.right) / 2}, ${-20})`)  
    .style("text-anchor", "middle")
    .style("font-size", 15)
    

let tooltip2 = d3.select("#graph2")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
// End Setup for Graph 2

function setGraph2(type) {
	d3.csv("../data/netflix.csv").then(function(data) {
		if(START_POS2 > 33 && type != "Movie"){
			START_POS2 = 33
		}
		current_type = type
		y_unit = (type == "Movie") ? "Minutes" : "Seasons"
		graph2_label.text(`Average Runtime per Release Year for ${type == "Movie" ? "Movies" : "TV Shows"}`)
		graph2_xaxis.text(`Average Runtime in ${y_unit}`)
		runtimes = []
		data.map(function(e) { 
			if(e.type == type){
				runtime_in_min = parseInt(((e.duration).split(" "))[0])
				if(e.release_year in runtimes){
					runtimes[e.release_year].push(runtime_in_min)
				}
				else{
					runtimes[e.release_year] = [runtime_in_min]
				}
			}
		})

		counts = []
		for (const year in runtimes) {
			sum = (runtimes[year]).reduce((x,y) => x + y, 0) 
			len = runtimes[year].length
			aver = sum / len
			counts.push({"year": year, "average": aver})
		}

	    counts.sort((x,y) => y.year - x.year)
	    x2.domain([0, d3.max(counts, d => d.average)]);

		let color = d3.scaleOrdinal()
	        .domain(counts.map(d => d.average))
	        .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), counts.length));

	    counts = counts.slice(START_POS2, START_POS2 + NUM_YEARS)

	    y2.domain(counts.map(d => d.year ));

	    graph2_y_axis.call(d3.axisLeft(y2).tickSize(0).tickPadding(10));

        let mouseover = function(d) {
            let color_span = `<span style="color: ${color(d.average)};">`;
            let html = `Average runtime of ${Math.round(d.average)} ${y_unit}<br/>
                    ${color_span} in the year ${d.year}</span>`; 

            tooltip.html(html)
                .style("left", `${(d3.event.pageX) + 50}px`)
                .style("top", `${(d3.event.pageY) - 10}px`)
                .style("box-shadow", `2px 2px 5px ${color(d.year)}`) 
                .transition()
                .duration(200)
                .style("opacity", 0.9)
        };

        let mouseout = function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", 0);
        };


        let bars = svg2.selectAll("rect").data(counts);

        bars.enter()
        .append("rect")
        .on("mouseover", mouseover) 
        .on("mouseout", mouseout)
        .merge(bars)
        .transition()
        .duration(1000)
        .attr("fill", function(d) {return color(d.average) })
        .attr("x", x2(0) + 1)
        .attr("y", d => y2(d.year))
        .attr("width", d => x2(d.average))
        .attr("height",  y2.bandwidth())


        let countMaker = countRef2.selectAll("text").data(counts);

        countMaker.enter()
        .append("text")
        .merge(countMaker)
        .transition()
        .duration(1000)
        .attr("x", function(d) {return  x2(d.average) + 10})       
        .attr("y", function(d) { return y2(d.year) + 10})       
        .style("text-anchor", "start")
        .text(d => Math.round(d.average));  

        bars.exit().remove();
        countMaker.exit().remove();  	
    })
}


// Setup for Graph 3
let svg3 = d3.select("#graph3")     
    .append("svg")
    .attr("width", graph_3_width)     
    .attr("height", graph_3_height)     
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
    

let tooltip3 = d3.select("#graph3")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

function makeLonger(str){
    str =  str.length == 1 ? "0" + str : str;
}

function randomNegative(limit){
    random = Math.random()
    posOrNeg = random <= 0.5 ? -1 : 1
    return Math.floor(Math.random()*limit) * posOrNeg
}

function randomBlue(){
    redVal = (102 + randomNegative(70)).toString(16)
    makeLonger(redVal)
    greenVal =  (160 + randomNegative(70)).toString(16)
    makeLonger(greenVal)
    blueVal =  (226 + randomNegative(25)).toString(16)
    makeLonger(blueVal)
    console.log("#" + redVal + greenVal + blueVal)

    return "#" + redVal + greenVal + blueVal
}
// End Setup for Graph 3

function setGraph3() {
	d3.csv("../data/netflix.csv").then(function(data) {

    svg3.selectAll("circle").remove();
    svg3.selectAll("line").remove();

        start_year = document.getElementById("year").value
        genre = document.getElementById("genre").value
        country = document.getElementById("country").value
        cap = document.getElementById("cap").value
        if(start_year != "all"){
           data = data.filter(x =>  parseInt(x.release_year) >= parseInt(start_year))
        }
        if(genre != "all"){
            data = data.filter( x => (x.listed_in.split(",").map(x => x.trim())).includes(genre))
        }
        if(country != "all"){
            data = data.filter( x => (x.country.split(",").map(x => x.trim())).includes(country))
        }

		data = data.slice(0,parseInt(cap))
		last_used_id = 0
		id_map = {}
		actor_links = []
		data.map(function(e) { 
			actors_in_mov = (e.cast).split(",")

			for(let i = 0; i < actors_in_mov.length; i++){
				actor = actors_in_mov[i].trim()
				if(!(actor in id_map)){
					id_map[actor] = last_used_id + 1
					last_used_id = last_used_id + 1
				} 
			}

			for (let i = 0; i < actors_in_mov.length; i++) {
			    for (let j = i + 1; j < actors_in_mov.length; j++) {
			      actor_links.push({"source": id_map[actors_in_mov[i].trim()], "target": id_map[actors_in_mov[j].trim()]});
			    }
			}
		})

		actor_nodes = []
		for (const [name, id] of Object.entries(id_map)) {
			actor_nodes.push({"id": id, "name": name})
		}


  let link = svg3
    .selectAll("line")
    .data(actor_links)
    
    let linkEnter = link.enter()
    .append("line")
    .style("stroke", "#aaa")

    let mouseover = function(d) {
            let html = `${d.name}<br/>`; 
            console.log(d.name)

            tooltip3.html(html)
                .style("left", `${(d3.event.pageX) - 300}px`)
                .style("top", `${(d3.event.pageY) - 1100}px`)
                .style("fill", "white")
                .style("box-shadow", `2px 2px 5px white`) 
                .transition()
                .duration(200)
                .style("opacity", 100)
        };

        let mouseout = function(d) {
            tooltip3.transition()
                .duration(200)
                .style("opacity", 0);
        };


  let node = svg3
    .selectAll("circle")
    .data(actor_nodes)

    let nodeEnter = node.enter()
    .append("circle")
    .on("mouseover", mouseover) 
    .on("mouseout", mouseout)
      .attr("r", 5)
      .style("fill", () => {return randomBlue()})
      .attr("r", 5)

  var simulation = d3.forceSimulation(actor_nodes)                
      .force("link", d3.forceLink(actor_links).id(d => d.id))
      .force("charge", d3.forceManyBody())        
      .force("center", d3.forceCenter(graph_3_width *.12, graph_3_height *.45))   
      .force("x", d3.forceX())
     .force("y", d3.forceY())  
     .on("tick", function(){
     linkEnter
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

     nodeEnter
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
    });

        link.exit().remove();
        node.exit().remove();  


	})
}



function changeRuntimeNum(type){
	START_POS2 = type ? (START_POS2 > 50 ? START_POS2 : START_POS2 + 1) : ((START_POS2 == 0) ? START_POS2 : START_POS2 - 1)
	setGraph2(current_type)
}

function setYear(){
	intended_year = document.getElementById("yearinput").value
	if(current_type == "Movie"){
		if(1960 <= parseInt(intended_year) && parseInt(intended_year) <= 2020){
			START_POS2 = 2020 - document.getElementById("yearinput").value
			setGraph2(current_type)
		}
	}
	else{
		if(1988 <= parseInt(intended_year) && parseInt(intended_year) <= 2020){
			START_POS2 = 2020 - document.getElementById("yearinput").value
			setGraph2(current_type)
		}	
	}
}


function setDropdownOptions() {
    d3.csv("../data/netflix.csv").then(function(data) {
    genre_lists = []
        data.map(function(e) {
            all_genres = e.listed_in.split(",")
                for(let i = 0; i < all_genres.length; i++){
                    g = all_genres[i].trim()
                        if(g in genre_lists){
                            genre_lists[g].push(e.title)
                        }
                        else{
                            genre_lists[g] = [e.title]
                        }
                }
        })
    country_lists = []
        data.map(function(e) {
            all_countries = e.country.split(",")
                for(let i = 0; i < all_countries.length; i++){
                    g = all_countries[i].trim()
                        if(g in country_lists){
                            country_lists[g].push(e.country_lists)
                        }
                        else{
                            country_lists[g] = [e.country_lists]
                        }
                }
        })


        // setting up genre dropdown
    var genreDrop = document.getElementById("genre")
    for(const genre in genre_lists) {
        var option = document.createElement('option');
        option.text = option.value = genre;
        genreDrop.add(option, 0);
    }
         // setting up country dropdown
    var genreDrop = document.getElementById("country")
    for(const country in country_lists) {
        var option = document.createElement('option');
        option.text = option.value = country;
        genreDrop.add(option, 0);
    } 

    })
}

setGraph1(current_type);
setGraph2(current_type);
setGraph3();
setDropdownOptions();

