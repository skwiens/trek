$(document).ready(() => {
  // JQUERY VARIABLES
  const $document = $(document);
  const $trips = $('#trips');
  const $allTripsBtn = $('#allTripsBtn');
  const $fail = $('#fail');
  const $reserveBtn = $('#reserveBtn');
  const $reservationForm = $('#reservation-form');
  const $message = $('#message');
  const $body = $('html, body')
  const tripsurl = 'https://trektravel.herokuapp.com/trips';
  const tripsRecord = {};

  // Clear from screen
  $reservationForm.hide();

  // FUNCTIONS

  // Clear messages based on any click
  const clearMessages = () => {
    $fail.empty();
    $message.empty();
  };

  // Generic API fail function
  const failResponse = (response) => {
    $fail.html('Your request was unsuccessful.... if this makes you sad, <a href="https://www.boredpanda.com/cute-smiling-animals/"> click here </a> to feel happy again!')
    $body.animate({ scrollTop: 0 }, 'fast');
  };

  // get all trips from API
  const getTrips = () => {
    const successTrips = (response) => {
      // $message.html('Choose a trip to get started!');
      response.forEach((trip) => {
        const card = `
        <div class="card border columns small-12" id=trip-${trip.id}>
          <div class="card-divider" data-id=${trip.id}>
            <button class="trip-button"><h2 class="text-center trip-name">${trip.name}</h2></button>
          </div>
          <div class="card-section">
          </div>
        </div>`;
        $trips.append(card);
        $trips.show();
        tripsRecord[`${trip.id}`] = trip.name;
      });
      console.log(tripsRecord);
    }; // end of successCallback

    $.get(tripsurl, successTrips)
      .fail(failResponse);
  };

  // Get individual trip details from API
  const loadTrip = (id) => {
    const tripurl = `${tripsurl}/${id}`;
    const successTrip = (response) => {
      const $cardSection = $(`#trip-${response.id} .card-section`);
      const tripInfo = `
        <button class="button border" id="reserveBtn" data-id=${response.id}><h2>Reserve Trip</h2></button>
        <p>Continent: ${response.continent}</p>
        <p class="text-justify">About: ${response.about}</p>
        <p>Cost: $${response.cost.toFixed(2)}</p>
        <button class="button border" id="reserveBtn" data-id=${response.id}><h2>Reserve Trip</h2></button>
        `;
      $cardSection.html(tripInfo);
    };

    $.get(tripurl, successTrip)
      .fail(failResponse);
  };

  const postReservation = (url, formData) => {
    const successPost = (response) => {
      const tripName = tripsRecord[response.trip_id];

      $message.html(`Congratulations ${response.name}! You have successfully booked a trip for ${tripName}`);
      $reservationForm.hide();
      $reservationForm.each(function clearForm() {
        this.reset();
      });
      $body.animate({ scrollTop: 0 }, 'fast');
    };

    $.post(url, formData, successPost)
      .fail(failResponse);
  };

  // ACTIONS

  // Button to get all trips
  $allTripsBtn.on('click', () => {
    $trips.empty();
    getTrips();
  });

  // Click trip header to see trip detail information
  $trips.on('click', '.card .card-divider', function getTrip() {
    const tripID = $(this).attr('data-id');
    const $cardSection = $(`#trip-${tripID} .card-section`);

    loadTrip(tripID);
    $cardSection.toggle();
  });

  // Button to show reservation form
  $trips.on('click', '#reserveBtn', function makeReservation() {
    const tripID = $(this).attr('data-id');
    // const tripName = $(this).attr('data-name');
    const $tripCard = $(`#trip-${tripID}`);
    const url = `${tripsurl}/${tripID}/reservations`;

    $reservationForm.attr('action', url);
    // $reservationForm.attr('tripName', tripName);
    $reservationForm.appendTo($tripCard);
    $reservationForm.show();
  });

  // Reservation form submit to post to a new trip
  $reservationForm.submit(function submit(e) {
    e.preventDefault();

    const url = $(this).attr('action');
    // const tripName = $(this).attr('tripName');
    const formData = $(this).serialize();

    postReservation(url, formData);
  });

  // Clear messages when there is a click on any part of the document
  $document.on('click', clearMessages);
});
