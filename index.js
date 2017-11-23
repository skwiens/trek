$(document).ready(() => {
  // JQUERY VARIABLES
  const $tripsTable = $('#trips');
  const $allTripsBtn = $('#allTripsBtn');
  const $fail = $('#fail');
  const $main = $('#main');
  const $reserveBtn = $('#reserveBtn');
  const $reservationForm = $('#reservation-form');
  const $message = $('#message');

  // Clear the screen
  $tripsTable.hide();
  $reservationForm.hide();

  // FUNCTIONS
  // Function to request all trips from API and put data into tripsTable
  const getTrips = () => {
    const tripsurl = 'https://trektravel.herokuapp.com/trips';
    const successTrips = (response) => {
      $message.html('Trek your way around the world!');
      const headers = `
        <thead>
        <tr><th>Name</th>
        <th>Continent</th>
        <th>Length</th></tr>
        </thead>
        <tbody>`;
      $tripsTable.append(headers);
      response.forEach((trip) => {
        const row = `
          <tr><td class="name" data-id=${trip.id}>${trip.name}</td>
          <td>${trip.continent}</td>
          <td>${trip.weeks}</td>
          <tr id="trip-info"><tr>`;
        // console.log(row);
        $tripsTable.append(row);
        $tripsTable.show();
      });
      // $tripsTable.append('</tbody>'); // end of forEach trip loop
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
    $tripsTable.empty();
    getTrips();
  });

  $tripsTable.on('click', '.name', function getTrip() {
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
