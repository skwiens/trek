$(document).ready(() => {
  // JQUERY VARIABLES
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
    const failTrips = (response) => {
      console.log(response);
      $fail.html('<h4> Your request was unsuccessful.... if this makes you sad, <a href="https://www.boredpanda.com/cute-smiling-animals/"> click here </a> to feel happy again! </h4>');
    };

    $.get(tripsurl, successTrips)
      .fail(failTrip);
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
    const failTrip = (response) => {
      console.log(response);
      $fail.html('<h4>Request was unsuccessful.... if this makes you sad, <a href="https://www.boredpanda.com/cute-smiling-animals/"> click here </a> to feel happy again!</h4>');
    };

    $.get(tripurl, successTrip)
      .fail(failTrip);
  };

  const postReservation = (url, formData) => {
    const successPost = (response) => {
      alert(`Congratulations! Reservation successfully made for ${response.name}.`);
      $reservationForm.hide();
      $reservationForm.each(function clearForm() {
        this.reset();
      });
    };
    const failPost = (response) => {
      console.log(response);
      $fail.html('<h4>Request was unsuccessful.... if this makes you sad, <a href="https://www.boredpanda.com/cute-smiling-animals/"> click here </a> to feel happy again!</h4>');
    };

    $.post(url, formData, successPost)
      .fail(failPost);

    // $.post(url, formData, (response) => {
    //   alert(`Congratulations! Reservation successfully made for ${response.name}.`);
    //   $reservationForm.hide();
    //   $reservationForm.each(function clearForm() {
    //     this.reset();
    //   });
    // });
  };

  // ACTIONS

  // Button to get all trips
  $allTripsBtn.on('click', () => {
    $trips.empty();
    getTrips();
  });

  // Individual trip info embedded into all trips when header for trip is clicked
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

  $reservationForm.submit(function submit(e) {
    e.preventDefault();

    const url = $(this).attr('action');
    const formData = $(this).serialize();

    postReservation(url, formData);
  });
});
