$(document).ready(() => {

  const successCallback = (response) => {
    console.log(response);
  }; // end of successCallback

  const url = 'https://trektravel.herokuapp.com/trips';


  $.get(url, successCallback);

  // no padding!
}); // end of document.ready
