// Restores hidden inputs from chrome storage.
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

// Get Whitelisted domains when user presses button...
  $('#getwhitelist').click(function(event) {
    var piholekey = $('input[name=piholekey]').val();
    var piholeurl = $('input[name=piholeurl]').val();
    console.log('key',piholekey);
    console.log('button pushed.');

    var whitelistdata = {
      'piholekey': piholekey,
      'list': 'white',
      'action': 'getlist'
    }

    $.ajax({
      type:'POST',
      url: piholeurl,
      data: whitelistdata,
      dataType: 'json',
      success: function( json ) {
        $('#whitedomainlist').attr('disabled', false);
        // Purge and reset the list.  
        $('#whitedomainlist').empty().append('<option>Select a Domain</option');

        $.each(json['domains'], function(key, value) {
          console.log('dafuck');
          $('#whitedomainlist').append($('<option>').text(value).attr('value', value));
        });
      }
    });
  });
  // Got Whitelisted domains

  // process the form when button is pressed.
  $('form').submit(function(event) {

    var piholekey = $('input[name=piholekey]').val();
    var piholeurl = $('input[name=piholeurl]').val();
    console.log('key',piholekey);
    console.log('url',piholeurl);
    console.log('Form Submitted');
    
    // remove old error class and text
    $('.form-group').removeClass('has-error'); 
    $('.help-block').remove();
    var deletedata = {
      // get the form data
      'piholekey':  piholekey,
      'list': 'white', 
      'domain':     $('#whitedomainlist option:selected').text(),
      'action':     'delete' 
    };
    console.log(deletedata);
    // process the form
    $.ajax({
            type: 'POST',
            url             : piholeurl, // the url where we want to POST
            data            : deletedata, // our data object
            dataType        : 'json', // what type of data do we expect back from the server
            encode          : true
    })
                  // using the done promise callback
    .done(function(data) {
      // log data to the console so we can see
      console.log(data);
        // here we will handle errors and validation messages
        if ( ! data.success) {
          console.log('oops!:');
          console.log(data);
          // handle key errors
          if(data.errors.list) {
            console.log('there is a list name error.');
            $('form').append('<div id="alert" name="alert" class="alert alert-danger">' + data.errors.list + '</div>').hide().fadeIn("slow"); 
            $('#alert').delay(2000).fadeOut(5000, function() {
              $(this).remove();
            });
          }

          if(data.errors.piholekey) {
            console.log('there is a piholekey error.');
            $('form').append('<div id="alert" name="alert" class="alert alert-danger">' + data.errors.piholekey + '</div>').hide().fadeIn("slow"); 
            $('#alert').delay(2000).fadeOut(5000, function() {
              $(this).remove();
            });
          }
          // handle errors for name ---------------
          if (data.errors.domain) {
            console.log('there is a domain error.');
            $('#domain-list-group').addClass('has-error'); // add the error class to show red input
            $('#domain-list-group').append('<div class="help-block">' + data.errors.domain + '</div>'); // add the actual error message under our input
            $('form').append('<div id="alert" name="alert" class="alert alert-danger">' + data.errors.domain + '</div>').hide().fadeIn("slow"); 
            $('#alert').delay(2000).fadeOut(5000, function() {
              $(this).remove();
            });
          }
        } else {
          // ALL GOOD! just show the success message!
          console.log(data.response);
          $('form').append('<div id="alert" name="alert" class="alert alert-success">' + data.message + '</div>').hide().fadeIn("slow"); 
          // Fade Message Out...
          $('#alert').delay(2000).fadeOut(5000, function() {
            $(this).remove();
          });
          // Purge and lock the select box, because im an asshole.
          $('#whitedomainlist').attr('disabled', true);
          $('#whitedomainlist').empty().append('<option>Select a Domain</option');
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