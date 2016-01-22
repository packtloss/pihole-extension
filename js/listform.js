// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use defaults if empty
  chrome.storage.sync.get({
    piholekey: 'Unset',
    piholeurl: 'http://raspberrypi.local/admin/apiext.php'
  }, function(items) {
    document.getElementById('piholeurl').value = items.piholeurl;
    document.getElementById('piholekey').value = items.piholekey;
  });
}

$(document).ready(function() {
  restore_options();
  // process the form
  $('form').submit(function(event) {
    // remove old error class and text
    $('.form-group').removeClass('has-error'); 
    $('.help-block').remove();
    $('.alert').remove();
    var formUrl = $('input[name=piholeurl]').val();
    console.log('formUrl',formUrl)
    var formData = {
      // get the form data
      'piholekey':      $('input[name=piholekey]').val(),
      'name':           $('input[name=name]').val(),
      'email':          $('input[name=email]').val(),
      'superheroAlias': $('input[name=superheroAlias]').val()
    };

    console.log(formData);



    // process the form
    $.ajax({
            type            : 'POST', // define the type of HTTP verb we want to use (POST for our form)
            //url             : 'http://raspberrypi.local/admin/apiext123.php', // the url where we want to POST
            url             : formUrl, // the url
            data            : formData, // our data object
            dataType        : 'json', // what type of data do we expect back from the server
            encode          : true
    })
                  // using the done promise callback
    .done(function(data) {
      // log data to the console so we can see
      console.log(data);
        // here we will handle errors and validation messages
        if ( ! data.success) {
          // handle errors for name ---------------
          if (data.errors.name) {
                  $('#name-group').addClass('has-error'); // add the error class to show red input
                  $('#name-group').append('<div class="help-block">' + data.errors.name + '</div>'); // add the actual error message under our input
          }
          // handle errors for email ---------------
          if (data.errors.email) {
                  $('#email-group').addClass('has-error'); // add the error class to show red input
                  $('#email-group').append('<div class="help-block">' + data.errors.email + '</div>'); // add the actual error message under our input
          }
          // handle errors for superhero alias ---------------
          if (data.errors.superheroAlias) {
                  $('#superhero-group').addClass('has-error'); // add the error class to show red input
                  $('#superhero-group').append('<div class="help-block">' + data.errors.superheroAlias + '</div>'); // add the actual error message under our input
          }
        } else {
          // ALL GOOD! just show the success message!
          // Remove old box
          //$('div').remove(".alert");
          $('form').append('<div class="alert alert-success">' + data.message + '</div>');
          $('div.alert').fadeOut(5000);
          // usually after form submission, you'll want to redirect
          // window.location = '/thank-you'; // redirect a user to another page
        }
    })
    // using the fail promise callback
    .fail(function(data) {
            // show any errors
            // best to remove for production
            console.log(data);
    });
  // stop the form from submitting the normal way and refreshing the page
  event.preventDefault();
  });

});

document.addEventListener('DOMContentLoaded', restore_options);