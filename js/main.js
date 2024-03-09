


d3.csv('data/ufoSample.csv')
.then(data => {
    console.log(data[0]);
    console.log(data.length);
    data.forEach(d => {
      console.log(d);
      d.latitude = +d.latitude; //make sure these are not strings
      d.longitude = +d.longitude; //make sure these are not strings
      d.city = d.city_area;
      d.described_encounter_length = d.described_encounter_length;
      d.description = d.description;
    });

    // Initialize chart and then show it
    leafletMap = new LeafletMap({ parentElement: '#my-map'}, data);


  })
  .catch(error => console.error(error));
