// public/js/custom.js
$(document).ready(function () {
    // Event listener for the country dropdown
    $('#country').change(function () {
      const selectedCountry = $(this).val();
  
      // Fetch states based on the selected country
      $.get(`/states/${selectedCountry}`, function (data) {
        // Update the state dropdown
        const stateDropdown = $('#state');
        stateDropdown.empty();
        data.states.forEach(state => {
            console.log(state)
          stateDropdown.append($('<option>').text(state).attr('value', state));
        });
  
        $.get(`/cities/${data.states[0]}`, function (data) {
            // Update the city dropdown
            const cityDropdown = $('#city');
            cityDropdown.empty();
            data.cities.forEach(city => {
              cityDropdown.append($('<option>').text(city).attr('value', city));
            });
          });
      });
    });
  
    // Event listener for the state dropdown
    $('#state').change(function () {
      const selectedState = $(this).val();
  
      // Fetch cities based on the selected state
      $.get(`/cities/${selectedState}`, function (data) {
        // Update the city dropdown
        const cityDropdown = $('#city');
        cityDropdown.empty();
        data.cities.forEach(city => {
          cityDropdown.append($('<option>').text(city).attr('value', city));
        });
      });
    });
  });
  