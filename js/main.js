


d3.csv('data/ufoSample.csv')
.then(data => {
    console.log(data[0]);
    console.log(data.length);
    data.forEach(d => {
      console.log(d);
      d.datetime = d.date_time
      //process datetime into javascript date object
      d.dateobject = new Date(d.date_time);
      d.latitude = +d.latitude; //make sure these are not strings
      d.longitude = +d.longitude; //make sure these are not strings
      d.city = d.city_area;
      d.country = d.country;
      d.described_encounter_length = d.described_encounter_length;
      d.description = d.description;
      d.shape = d.ufo_shape;
      d.datedocumented = d.date_documented




    });

    // Initialize chart and then show it
    leafletMap = new LeafletMap({ parentElement: '#my-map'}, data);


  })
  .catch(error => console.error(error));
