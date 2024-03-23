class Timeline {
    constructor(_config, _data){
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 750,
            containerHeight: _config.containerHeight || 250,
            margin: { top: 10, right: 50, left: 50, bottom: 40 }
        }
    
        this.data = _data;

        this.initVis();
    }

    initVis(){
        console.log('Draw Timeline');

        let vis = this;

        //set up the width and height of the area where visualizations will go- factoring in margins               
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        console.log('width', vis.width);
        console.log('height', vis.height);
        
        // Define 'svg' as a child-element (g) from the drawing area and include spaces
        // Add <svg> element (drawing space)
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);
        
        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left}, ${vis.config.margin.top})`);

        //define scales
        let timeframe = d3.extent(vis.data, d => d.dateobject);
        console.log(timeframe[0], timeframe[1]);

        // The x scale maps the day on which the sighting happened
        /*
        vis.xScale = d3.scaleTime()
                        .domain(timeframe)
                        .range([0, vis.width]);
                        */

        vis.xScale = d3.scaleLinear()
                        .domain([0, 500])
                        .range([0, vis.width]);

        //The y Scale maps the time of day
        /*
        vis.yScale = d3.scaleTime()
                        .domain([(new Date('2000-01-01T00:00')).getMinutes(), (new Date('2000-01-01T23:59')).getMinutes()])
                        .range([0, vis.height]);
                        */

        vis.yScale = d3.scaleLinear()
                        .domain([0, 500])
                        .range([0, vis.height]);

        //Draw the axes
        vis.xAxisGroup = vis.chart.append('g')
            .attr('class', 'axis x-axis')
            //.attr("transform", "translate(0," + vis.height + ")") 
            .call(d3.axisTop(vis.xScale));
            

        vis.yAxisGroup = vis.chart.append('g')
            .attr('class', 'axis y-axis')
            .call(d3.axisLeft(vis.yScale));
            

        //Plot the data on the Chart
        vis.circles = vis.chart.selectAll('circle')
            .data(vis.data)
            .join('circle')
                .attr('fill', 'MidnightBlue')
                //.attr('opacity', .75)
                .attr('r', 3)
                .attr('cx', (d) => {/*console.log('cx', vis.xScale(d.dateobject));*/ return vis.xScale(d.dateobject)})
                .attr('cy', (d) => {/*console.log('cy', vis.xScale(d.dateobject.getMinutes()));*/ return vis.xScale(d.dateobject.getMinutes())});

    }

    updateVis(){

    }

    renderVis(){

    }
}