


d3.csv('data/worldCities.csv')
.then(data => {
    console.log(data[0]);
    console.log(data.length);
    data.forEach(d => {
      console.log(d);
      d.latitude = +d.lat; //make sure these are not strings
      d.longitude = +d.lng; //make sure these are not strings
    });

    // Initialize chart and then show it
    leafletMap = new LeafletMap({ parentElement: '#my-map'}, data);


  })
  .catch(error => console.error(error));
