class LeafletMap {

  /**
   * Class constructor with basic configuration
   * @param {Object}
   * @param {Array}
      */
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
    }
    this.data = _data;
        this.initVis();
  }
  
  /**
   * We initialize scales/axes and append static elements, such as axis titles.
   */
  initVis() {
    let vis = this;

    //ESRI
    vis.esriUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    vis.esriAttr = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';

    //TOPO
    vis.topoUrl ='https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
    vis.topoAttr = 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'

    //Thunderforest Outdoors- requires key... so meh... 
    vis.thOutUrl = 'https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey={apikey}';
    vis.thOutAttr = '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    //Stamen Terrain
    vis.stUrl = 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}';
    vis.stAttr = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    //this is the base map layer, where we are showing the map background
    vis.base_layer = L.tileLayer(vis.esriUrl, {
      id: 'esri-image',
      attribution: vis.esriAttr,
      ext: 'png'
    });

    vis.theMap = L.map('my-map', {
      center: [30, 0],
      zoom: 2,
      layers: [vis.base_layer]
    });

    //if you stopped here, you would just have a map

    //initialize svg for d3 to add to map
    L.svg({clickable:true}).addTo(vis.theMap)// we have to make the svg layer clickable
    vis.overlay = d3.select(vis.theMap.getPanes().overlayPane)
    vis.svg = vis.overlay.select('svg').attr("pointer-events", "auto")

    //these are the city locations, displayed as a set of dots 
    vis.Dots = vis.svg.selectAll('circle')
                    .data(vis.data) 
                    .join('circle')
                        .attr("fill", "steelblue")
                        .attr("original-fill", "steelblue") // Store the original fill color as an attribute
                        .attr("stroke", "black")
                        //Leaflet has to take control of projecting points. Here we are feeding the latitude and longitude coordinates to
                        //leaflet so that it can project them on the coordinates of the view. Notice, we have to reverse lat and lon.
                        //Finally, the returned conversion produces an x and y point. We have to select the the desired one using .x or .y
                        .attr("cx", d => vis.theMap.latLngToLayerPoint([d.latitude,d.longitude]).x)
                        .attr("cy", d => vis.theMap.latLngToLayerPoint([d.latitude,d.longitude]).y) 
                        .attr("r", 3)
                        .on('mouseover', function(event,d) { //function to add mouseover event
                            d3.select(this).transition() //D3 selects the object we have moused over in order to perform operations on it
                              .duration('150') //how long we are transitioning between the two states (works like keyframes)
                              .attr("fill", "red") //change the fill
                              
                              .attr('r', 3 + ((vis.theMap.getZoom() - 2) * 0.6) + 1); //change radius

                              // Append content to the Detail on Demand column
                              vis.clearDetailOnDemandContent();
                              vis.addDetailOnDemandContent(d);

                              //old tooltip code
                              // // Construct tooltip content
                              //   const tooltipContent = `
                              //   <div>City: ${d.city}</div>
                              //   <div>Described encounter length: ${d.described_encounter_length}</div>
                              //   <div>Description of encounter: ${d.description}</div>   
                              //  `;

                              
                            //old tooltip code
                            //create a tool tip
                            // d3.select('#tooltip')
                            //     .style('opacity', 1)
                            //     .style('z-index', 1000000)
                            //       // Format number with million and thousand separator
                            //     .html(tooltipContent);

                          })
                        .on('mousemove', (event) => {
                          //old tooltip code
                            // //position the tooltip
                            // d3.select('#tooltip')
                            //  .style('left', (event.pageX + 10) + 'px')   
                            //   .style('top', (event.pageY + 10) + 'px');
                         })              
                        .on('mouseleave', function() { //function to add mouseover event
                            // vis.clearDetailOnDemandContent();

                            d3.select(this).transition() //D3 selects the object we have moused over in order to perform operations on it
                              .duration('150') //how long we are transitioning between the two states (works like keyframes)
                              .attr("fill", function() {
                                return d3.select(this).attr("original-fill"); // Get the original-fill attribute value
                              })
                              .attr('r', 3 + ((vis.theMap.getZoom() - 2) * 0.6)) //change radius

                              
                            //old tooltip code
                            // d3.select('#tooltip').style('opacity', 0);//turn off the tooltip

                          })
                        .on('click', (event, d) => { //experimental feature I was trying- click on point and then fly to it
                           // vis.newZoom = vis.theMap.getZoom()+2;
                           // if( vis.newZoom > 18)
                           //  vis.newZoom = 18; 
                           // vis.theMap.flyTo([d.latitude, d.longitude], vis.newZoom);
                          });
    
    //handler here for updating the map, as you zoom in and out           
    vis.theMap.on("zoomend", function(){
      vis.updateVis();
    });

  }

  updateVis() {
    let vis = this;

    //want to see how zoomed in you are? 
    console.log(vis.theMap.getZoom()); //how zoomed am I
    
    //want to control the size of the radius to be a certain number of meters? 
     // Calculate the radius size based on the zoom level
    // You can adjust this formula to be bigger or smaller as needed
    vis.radiusSize = 3 + ((vis.theMap.getZoom() - 2) * 0.6);

    // Redraw based on new zoom - need to recalculate on-screen position
    vis.Dots
      .attr("cx", d => vis.theMap.latLngToLayerPoint([d.latitude, d.longitude]).x)
      .attr("cy", d => vis.theMap.latLngToLayerPoint([d.latitude, d.longitude]).y)
      .attr("r", vis.radiusSize);

    // if( vis.theMap.getZoom > 15 ){
    //   metresPerPixel = 40075016.686 * Math.abs(Math.cos(map.getCenter().lat * Math.PI/180)) / Math.pow(2, map.getZoom()+8);
    //   desiredMetersForPoint = 100; //or the uncertainty measure... =) 
    //   radiusSize = desiredMetersForPoint / metresPerPixel;
    // }
   
   //redraw based on new zoom- need to recalculate on-screen position
  

  }

  

    // Function to add content to the Detail on Demand column

    addDetailOnDemandContent(data) {
      let formattedstring = data.dateobject ? data.dateobject.toLocaleString('en-US') : '';
      d3.select('.detaildiv[style="background-color: #e2e2ed;"]')
        .html(`
          <div><b><u>Detail On Demand</u></b></div>
          <div><b>Date of Encounter:</b> ${formattedstring}<div>
          <div><b>Unformatted date of encounter (for debugging):</b> ${data.datetime}</div>
          <div><b>Time of day:</b> ${data.timeofday}</div>
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
      d3.select('.detaildiv[style="background-color: #e2e2ed;"]')
        .html('<div><b><u>Detail On Demand</u></b></div>');
    }

    //update dot color functions
    updateColorBy(selectedAttribute) {
      let vis = this;
    
      // Update the color of the points based on the selected attribute
      switch (selectedAttribute) {
        case "Default":
          // Reset to default color
          vis.Dots.attr("fill", "steelblue")
            .attr("original-fill", "steelblue"); // Set original-fill attribute
          break;
        case "Year":
          // Color by year
          const colorScaleYear = d3.scaleSequential(d3.interpolateRainbow)
            .domain(d3.extent(vis.data, d => d.dateobject.getFullYear()));
    
          // Apply colors based on the year extracted from the dateobject
          vis.Dots.attr("fill", function(d) {
            const color = colorScaleYear(d.dateobject.getFullYear());
            d3.select(this).attr("original-fill", color); // Update original-fill attribute
            return color;
          });
          break;
        case "Month":
          // Color by month
          const colorScaleMonth = d3.scaleSequential(d3.interpolateRainbow)
            .domain([0, 11]); // Month ranges from 0 to 11 (January to December)
    
          // Apply colors based on the month extracted from the dateobject
          vis.Dots.attr("fill", function(d) {
            const color = colorScaleMonth(d.dateobject.getMonth());
            d3.select(this).attr("original-fill", color); // Update original-fill attribute
            return color;
          });
          break;
        case "Time of day":
          // Color by time of day
          const timeOfDayColorScale = d3.scaleOrdinal(d3.schemeCategory10)
            .domain(["Morning", "Afternoon", "Evening", "Night"]); // Define your categories
    
          // Assuming each data point has a "timeOfDay" property containing the time of day category
          vis.Dots.attr("fill", function(d) {
            const color = timeOfDayColorScale(d.timeofday);
            d3.select(this).attr("original-fill", color); // Update original-fill attribute
            return color;
          });
          break;
        case "UFO Shape":
          // Color by UFO shape
          const ufoShapeColorScale = d3.scaleOrdinal(d3.schemeCategory10)
            .domain([...new Set(vis.data.map(d => d.shape))]); // Assuming data has a "shape" property
    
          // Apply colors based on the UFO shape category
          vis.Dots.attr("fill", function(d) {
            const color = ufoShapeColorScale(d.shape);
            d3.select(this).attr("original-fill", color); // Update original-fill attribute
            return color;
          });
          break;
        default:
          // Handle unknown option
          console.log("Unknown option for color by:", selectedAttribute);
      }
    }
  renderVis() {
    let vis = this;

    //not using right now... 
 
  }

  
}