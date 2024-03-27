class Timeline {
    constructor(_config, _data){
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 750,
            containerHeight: _config.containerHeight || 250,
            margin: { top: 30, right: 10, left: 70, bottom: 40 },
            tooltipPadding: _config.tooltipPadding || 15  
        }
    
        this.data = _data;

        this.initVis();
    }

    initVis(){
        console.log('Draw Timeline');

        let vis = this;
        
        // Define 'svg' as a child-element (g) from the drawing area and include spaces
        // Add <svg> element (drawing space)
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);
        
        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left}, ${vis.config.margin.top})`);

        //define Initial Scales
        let timeframe = d3.extent(vis.data, d => d.dateobject);
        console.log(timeframe[0], timeframe[1]);

        // The x scale maps the day on which the sighting happened
        vis.xScale = d3.scaleTime()
                        .domain(timeframe)
                        .range([0, 10]);

        //The y Scale maps the time of day
        vis.yScale = d3.scaleLinear()
                        .domain([(new Date('2000-01-01T00:00')).getHours(), (new Date('2000-01-01T23:59')).getHours()])
                        .range([10, 0]);
        
        vis.yAxis = d3.axisLeft(vis.yScale)
                      .tickValues([0, 4, 8, 12, 16, 20, 23])
                      .tickFormat((d) => {return (String(d) + ':00');});

        //Draw the axes
        vis.xAxisGroup = vis.chart.append('g')
            .attr('class', 'axis x-axis')
            .attr("transform", "translate(0," + vis.height + ")") 
            .call(d3.axisBottom(vis.xScale));
            
        vis.yAxisGroup = vis.chart.append('g')
            .attr('class', 'axis y-axis')
            .call(vis.yAxis);            

        //Add Labels
        vis.xAxisLabel = vis.chart.append('text')
            .attr('class', 'x label')
            .attr("text-anchor", "end")
            .attr("x", vis.config.containerWidth/2 + vis.config.margin.left)
            .attr("y", vis.config.containerHeight + vis.config.margin.top + 20)
            .text("Year");

        vis.yAxisLabel = vis.chart.append('text')
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", -vis.config.margin.left + 20)
            .attr("x", 10)
            .attr("transform", "rotate(-90)")
            .text("Time of Day (24hr time)");

        vis.graphLabel = vis.chart.append('text')
            .attr("class", "graph Label")
            .attr("text-anchor", "end")
            .attr("x", vis.config.containerWidth/2 + vis.config.margin.left)
            .attr("y", 0)
            .text("Year");

        //call updateVis() to finish rendering the timeline
        this.updateVis();    
    }

    updateVis(){
        let vis = this;

        //delete the old axes
        vis.xAxisGroup.remove();
        vis.yAxisGroup.remove();
        vis.xAxisLabel.remove();
        vis.yAxisLabel.remove();
        vis.graphLabel.remove();


        //Calculate the height and width of the visualizations, factoring margins              
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
        
        console.log('width', vis.width);
        console.log('height', vis.height);

        //Redefine the SVG
                
        // Define 'svg' as a child-element (g) from the drawing area and include spaces
        // Add <svg> element (drawing space)
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

        //redefine the graph scales:
        vis.xScale.range([0, vis.width]);
        vis.yScale.range([vis.height, 0]);


        //Redraw the Axes
        vis.xAxisGroup = vis.chart.append('g')
            .attr('class', 'axis x-axis')
            .attr("transform", "translate(0," + vis.height + ")") 
            .call(d3.axisBottom(vis.xScale));
                
        vis.yAxisGroup = vis.chart.append('g')
            .attr('class', 'axis y-axis')
            .call(vis.yAxis);

        
        //Rewrite the labels
        vis.xAxisLabel = vis.chart.append('text')
            .attr('class', 'x label')
            .attr("text-anchor", "end")
            .attr("x", vis.width/2)
            .attr("y", vis.height + vis.config.margin.top)
            .text("Year");

        vis.yAxisLabel = vis.chart.append('text')
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", -50)
            .attr("x", vis.height/2 - 45)
            .attr("transform", "rotate(-90)")
            .text("Time of Day (24hr time)");

        vis.graphLabel = vis.chart.append('text')
            .attr("class", "graph Label")
            .attr("text-anchor", "end")
            .attr("x", vis.width/2)
            .attr("y", -5)
            .text("Timeline");

        //Plot the data on the Chart
        vis.circles = vis.chart.selectAll('circle')
            .data(vis.data)
            .join('circle')
                .attr('fill', 'MidnightBlue')
                .attr('opacity', .75)
                .attr('r', 3)
                .attr('cx', (d) => {/*console.log('cx', vis.xScale(d.dateobject));*/ return vis.xScale(d.dateobject)})
                .attr('cy', (d) => {/*console.log('cy', vis.xScale(d.dateobject.getHours()))*/; return vis.yScale(d.dateobject.getHours())});

                
        vis.circles
        .on('mouseover', function(event,d) { //function to add mouseover event
            d3.select(this).transition() //D3 selects the object we have moused over in order to perform operations on it
              .duration('150') //how long we are transitioning between the two states (works like keyframes)
              .attr("fill", "red") //change the fill
              .attr('r', 4); //change radius

              // Append content to the Detail on Demand column
              vis.addDetailOnDemandContent(d);

          })
              .on('mouseleave', function() { //function to add mouseover event
                vis.clearDetailOnDemandContent();

                d3.select(this).transition() //D3 selects the object we have moused over in order to perform operations on it
                  .duration('150') //how long we are transitioning between the two states (works like keyframes)
                  .attr("fill", "MidnightBlue") //change the fill
                  .attr('opacity', 0.5)
                  .attr('r', 3) //change radius

                  
                //old tooltip code
                // d3.select('#tooltip').style('opacity', 0);//turn off the tooltip

              })
        }

    renderVis(){

    }

    // Function to add content to the Detail on Demand column
    addDetailOnDemandContent(data) {
    let formattedstring = data.dateobject ? data.dateobject.toLocaleString('en-US', {timeZone: 'UTC'}) : '';
        d3.select('.detaildiv[style="background-color: darkseagreen;"]')
          .html(`
            <div><b>Date of Encounter:</b> ${formattedstring}<div>
            <div><b>Country:</b> ${data.country}</div>
            <div><b>City: </b>${data.city}</div>
            <div><b>Date Documented:</b> ${data.date_documented}</div>
            <div><b>Described encounter length:</b> ${data.described_encounter_length}</div>
            <div><b>Description of encounter:</b> ${data.description}</div>
            <div><b>Shape:</b> ${data.shape}</div>
          `);
        }
        
    // Function to clear content from the Detail on Demand column
    clearDetailOnDemandContent() {
        d3.select('.detaildiv[style="background-color: darkseagreen;"]')
            .html('');
    }
}