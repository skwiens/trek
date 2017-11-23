$(document).ready(() => {
  // JQUERY VARIABLES
  const $trips = $('#trips');
  const $allTripsBtn = $('#allTripsBtn');
  const $fail = $('#fail');
  const $main = $('#main');
  const $reserveBtn = $('#reserveBtn');
  const $reservationForm = $('#reservation-form');
  const $message = $('#message');

  // Clear the screen
  $trips.hide();
  $reservationForm.hide();

  // FUNCTIONS
  const getTrips = () => {
    const tripsurl = 'https://trektravel.herokuapp.com/trips';
    const successTrips = (response) => {
      $message.html('Trek your way around the world!');
      response.forEach((trip) => {
        console.log('entering');
        const card = `
        <div class="card">
          <div class="card-divider name" id=${trip.id} data-id=${trip.id}
          <h2>${trip.name}</h2>
        </div>`;
        $trips.append(card);
        $trips.show();
      });
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
      <button id="reserveBtn" data-id=${response.id}>Reserve Trip</button>`;

      $main.html(tripInfo);
    };

    $.get(tripurl, successTrip);
  };

  // ACTIONS
  // Button to get all trips
  $allTripsBtn.on('click', () => {
    console.log('entering');
    $trips.empty();
    getTrips();
  });

  $trips.on('click', '.name', function getTrip() {
    const tripID = $(this).attr('data-id');
    loadTrip(tripID);
  });

  $main.on('click', '#reserveBtn', function makeReservation() {
    $reservationForm.show();
    const tripID = $(this).attr('data-id');
    const url = `https://trektravel.herokuapp.com/trips/${tripID}/reservations`;
    $reservationForm.attr('action', url);
  });

  $reservationForm.submit(function(e) {
    e.preventDefault();

    const url = $(this).attr('action');
    const formData = $(this).serialize();

    $.post(url, formData, (response) => {
      console.log(response);
    });
  });

  // no padding!
}); // end of document.ready
