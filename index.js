$(document).ready(() => {
  // JQUERY VARIABLES
  const $document = $(document);
  const $trips = $('#trips');
  const $allTripsBtn = $('#allTripsBtn');
  const $fail = $('#fail');
  const $main = $('#main');
  const $reserveBtn = $('#reserveBtn');
  const $reservationForm = $('#reservation-form');
  const $message = $('#message');
  const tripsurl = 'https://trektravel.herokuapp.com/trips';

  // Clear from screen
  $reservationForm.hide();

  // FUNCTIONS

  // Clear messages based on any click
  const clearMessages = () => {
    $fail.empty();
  };

  // Generic API fail function
  const failResponse = (response) => {
    console.log(response);
    $fail.html('<h4> Your request was unsuccessful.... if this makes you sad, <a href="https://www.boredpanda.com/cute-smiling-animals/"> click here </a> to feel happy again! </h4>');
  };

  // get all trips from API
  const getTrips = () => {
    // const tripsurl = 'https://trektravel.herokuapp.com/trips';
    const successTrips = (response) => {
      $message.html('Trek your way around the world!');
      response.forEach((trip) => {
        const card = `
        <div class="card" id=trip-${trip.id}>
          <div class="card-divider" data-id=${trip.id}>
            <button class="trip-button"><h2 class="trip-name">${trip.name}</h2></button>
          </div>
          <div class="card-section">
          </div>
        </div>`;
        $trips.append(card);
        $trips.show();
      });
    }; // end of successCallback

    $.get(tripsurl, successTrips)
      .fail(failResponse);
    // .fail(failTrip);
  };

  // Get individual trip details from API
  const loadTrip = (id) => {
    const tripurl = `${tripsurl}/${id}`;
    const successTrip = (response) => {
      const $cardSection = $(`#trip-${response.id} .card-section`);
      const tripInfo = `
        <button class="button" id="reserveBtn" data-id=${response.id}>Reserve Trip</button>
        <p>Continent: ${response.continent}</p>
        <p>About: ${response.about}</p>
        <p>Cost: $${response.cost}</p>
        `;

      $cardSection.html(tripInfo);
    };

    $.get(tripurl, successTrip)
      .fail(failResponse);
    // .fail(failTrip);
  };

  const postReservation = (url, formData) => {
    const successPost = (response) => {
      alert(`Congratulations! Reservation successfully made for ${response.name}.`);
      $reservationForm.hide();
      $reservationForm.each(function clearForm() {
        this.reset();
      });
    };

    $.post(url, formData, successPost)
      .fail(failResponse);
    // .fail(failPost);
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
    const $tripCard = $(`#trip-${tripID}`);
    const url = `${tripsurl}/${tripID}/reservations`;

    $reservationForm.attr('action', url);
    $reservationForm.appendTo($tripCard);
    $reservationForm.show();
  });

  // Reservation form submit to post to a new trip
  $reservationForm.submit(function submit(e) {
    e.preventDefault();

    const url = $(this).attr('action');
    const formData = $(this).serialize();

    postReservation(url, formData);
  });

  // Clear messages when there is a click on any part of the document
  $document.on('click', clearMessages);
});
