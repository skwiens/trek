$(document).ready(() => {

  const successCallback = (response) => {
    console.log(response[0]);
    response.forEach((trip) => {
      const $tripsTable = $('#trips');
      const row = `
        <tr><td>${trip.name}</td>
        <td>${trip.continent}</td>
        <td>${trip.weeks}</td>`;
      console.log(row);
      $tripsTable.append(row);
    });
  }; // end of successCallback

  const url = 'https://trektravel.herokuapp.com/trips';


  $.get(url, successCallback);

  // no padding!
}); // end of document.ready
