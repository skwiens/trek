$(document).ready(() => {
  // JQUERY VARIABLES
  const $tripsTable = $('#trips');
  const $allTripsBtn = $('#allTripsBtn');
  const $fail = $('#fail');
  const $main = $('#main');

  // Clear the screen
  $tripsTable.hide();

  // FUNCTIONS
  // Function to request all trips from API and put data into tripsTable
  const getTrips = () => {
    const tripsurl = 'https://trektravel.herokuapp.com/trips';
    const successTrips = (response) => {
      response.forEach((trip) => {
        const row = `
          <tr><td class="name" data-id=${trip.id}>${trip.name}</td>
          <td>${trip.continent}</td>
          <td>${trip.weeks}</td>
          <tr id="trip-info"><tr>`;
        // console.log(row);
        $tripsTable.append(row);
        $tripsTable.show();
      }); // end of forEach trip loop
    }; // end of successCallback

    $.get(tripsurl, successTrips);
  }; // end of get trips function

  // Function to show invididual trip details
  const loadTrip = (id) => {
    const tripurl = `https://trektravel.herokuapp.com/trips/${id}`;
    const successTrip = (response) => {
      const tripInfo = `
      <p>ID: ${response.id}</p>
      <p>Name: ${response.name}</p>
      <p>Continent: ${response.continent}</p>
      <p>About: ${response.about}</p>
      <button data-id=${response.id}>Reserve Trip</button>`;

      console.log(tripInfo);
      $main.html(tripInfo);
    };

    $.get(tripurl, successTrip);
  };

  // ACTIONS
  // Button to get all trips
  $allTripsBtn.on('click', () => {
    $tripsTable.empty();
    getTrips();
  });

  $('#trips').on('click', '.name', function getTrip() {
    console.log('entering');
    console.log($(this));
    console.log($(this).attr('data-id'));
    $main.empty();
    const tripID = $(this).attr('data-id')
    loadTrip(tripID);
  });

  // no padding!
}); // end of document.ready
