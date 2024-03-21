




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
      
      //calculate and assign time of day to datapoint
      const hour = d.dateobject.getHours();

      // Determine time of day based on hour
      // time of day options
      // Morning: Morning: 4:01am - 10am
      // Afternoon: 10:01am - 4pm 
      // Evening: 4:01pm - 10pm
      // Night: 10:01pm - 4am
      if (hour >= 4 && hour < 10) {
        d.timeofday = 'Morning';
      } else if (hour >= 10 && hour < 16) {
        d.timeofday = 'Afternoon';
      } else if (hour >= 16 && hour < 22) {
        d.timeofday = 'Evening';
      } else {
        d.timeofday = 'Night';
      }

    });

    // Initialize chart and then show it
    // maybe need new properties for settings? Need to figure out how we want to handle setting change logic
    leafletMap = new LeafletMap({ parentElement: '#my-map'}, data);


    

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


    

  })
  .catch(error => console.error(error));

    // Add an event listener to the settings button using D3
    d3.select("#detailSettingsButton").on("click", function() {
      // Show the modal when the button is clicked
      document.getElementById("myModal").style.display = "block";
    });

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      document.getElementById("myModal").style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      var modal = document.getElementById("myModal");
      if (event.target == modal) {
          modal.style.display = "none";
      }
    }
