


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

    //INITIAL MAP RENDERS

    //NEED FUNCTION TO RENDER NEW MAPS WHEN SETTINGS CHANGE
    //NEED TO ACCOUNT FOR SETTINGS 
    //COLOR BY DROPDOWN: Options 1) year, 2) month, 3) time of day 
    //time of day options
    // morning: Morning: 4:01am - 10am
    // Afternoon: 10:01am - 4pm 
    // Evening: 4:01pm - 10pm
    // night: 10:01pm - 4am
    // (End values inclusive)


    // Initialize chart and then show it
    leafletMap = new LeafletMap({ parentElement: '#my-map'}, data);


  })
  .catch(error => console.error(error));
