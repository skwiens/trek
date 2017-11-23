$(document).ready(() => {
  // JQUERY VARIABLES
  const $trips = $('#trips');
  const $allTripsBtn = $('#allTripsBtn');
  const $fail = $('#fail');
  const $main = $('#main');
  const $reserveBtn = $('#reserveBtn');
  const $reservationForm = $('#reservation-form');
  const $message = $('#message');

  // Clear from screen
  $reservationForm.hide();

  // FUNCTIONS
  const getTrips = () => {
    const tripsurl = 'https://trektravel.herokuapp.com/trips';
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

    $.get(tripsurl, successTrips);
  }; // end of get trips function

  // Function to show invididual trip details
  const loadTrip = (id) => {
    const tripurl = `https://trektravel.herokuapp.com/trips/${id}`;
    const successTrip = (response) => {
      const $cardSection = $(`#trip-${response.id} .card-section`);
      // console.log($cardSection);
      const tripInfo = `
      <button class="button" id="reserveBtn" data-id=${response.id}>Reserve Trip</button>
      <p>Continent: ${response.continent}</p>
      <p>About: ${response.about}</p>
      <p>Cost: $${response.cost}</p>
      `;

      $cardSection.html(tripInfo);
    };

    $.get(tripurl, successTrip);
  };

  // ACTIONS
  // Button to get all trips

  $allTripsBtn.on('click', () => {
    $trips.empty();
    getTrips();
  });

  $trips.on('click', '.card .card-divider', function getTrip() {
    const tripID = $(this).attr('data-id');
    const $cardSection = $(`#trip-${tripID} .card-section`);

    loadTrip(tripID);
    $cardSection.toggle();
  });

  $trips.on('click', '#reserveBtn', function makeReservation() {
    const tripID = $(this).attr('data-id');

    const $cardSection = $(`#trip-${tripID} .card-section`);
    $reservationForm.appendTo(`#trip-${tripID}`);
    $reservationForm.show();

    const url = `https://trektravel.herokuapp.com/trips/${tripID}/reservations`;
    $reservationForm.attr('action', url);
  });

  $reservationForm.submit(function submit(e) {
    e.preventDefault();

    const url = $(this).attr('action');
    const formData = $(this).serialize();

    $.post(url, formData, (response) => {
      alert(`Congratulations! Reservation successfully made for ${response.name}.`);
      $reservationForm.hide();
      $reservationForm.each(function clearForm() {
        this.reset();
      });
    });
  });

  // no padding!
}); // end of document.ready
