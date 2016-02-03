// Restores hidden inputs from chrome storage.
function restore_options() {
  // Use defaults if empty
  chrome.storage.sync.get({
    piholekey: 'Unset',
    piholeurl: 'http://raspberrypi.local/admin/apiext.php',
    pihole_local_admin: 'http://raspberrypi.local/admin/index.php'
  }, function(items) {
    document.getElementById('piholeurl').value = items.piholeurl;
    document.getElementById('piholekey').value = items.piholekey;
    document.getElementById('pihole_local_admin').value = items.pihole_local_admin;
    document.getElementById('pihole_local_admin_href').href= items.pihole_local_admin;


  });
}


$(document).ready(function() {
    // populate the nav dropdown items

  // process the form when button is pressed.
  $('form').submit(function(event) {

    // Disable Input while waiting, pi isnt speedy.
    // Purge and lock the select box, because im an asshole.
    $('#list').attr('disabled', true);
    $('#domain').attr('disabled', true);
    $('#submitbutton').text('Running...').attr('disabled', true).toggleClass('btn-danger', 'btn-default');


    var piholekey = $('input[name=piholekey]').val();
    var piholeurl = $('input[name=piholeurl]').val();
    var pihole_local_admin = $('input[name=pihole_local_admin]').val();
    console.log('key',piholekey);
    console.log('url',piholeurl);
    console.log('pihole_local_admin', pihole_local_admin);
    console.log('Domain Form Submitted');

    // remove old error class and text
    $('.form-group').removeClass('has-error');
    $('.help-block').remove();
    var domaindata = {
      // get the form data
      'piholekey':  piholekey,
      'list':       $('#list option:selected').val(),
      'domain':     $('#domain').val(),
      'action':     'add'
    };
    console.log(domaindata);
    // process the form
    $.ajax({
            type: 'POST',
            url             : piholeurl, // the url where we want to POST
            data            : domaindata, // our data object
            dataType        : 'json', // what type of data do we expect back from the server
            encode          : true
    })
                  // using the done promise callback
    .done(function(data) {
      // log data to the console so we can see
      console.log(data);

        // Unlock the form
        $('#list').attr('disabled', false);
        $('#domain').attr('disabled', false);
        $('#submitbutton').text('Add Entry').attr('disabled', false).toggleClass('btn-danger', 'btn-default');


        // here we will handle errors and validation messages
        if ( ! data.success) {
          console.log('oops!:');
          console.log(data);
          // handle key errors
          if(data.errors.list) {
            console.log('there is a list name error.');
            $('form').append('<div id="alert" name="alert" class="alert alert-danger">' + data.errors.list + '</div>').hide().fadeIn("slow");
            $('#alert').delay(2000).fadeOut("slow", function() {
              $(this).remove();
            });
          }

          if(data.errors.piholekey) {
            console.log('there is a piholekey error.');
            $('form').append('<div id="alert" name="alert" class="alert alert-danger">' + data.errors.piholekey + '</div>').hide().fadeIn("slow");
            $('#alert').delay(2000).fadeOut("slow", function() {
              $(this).remove();
            });
          }
          // handle errors for name ---------------
          if (data.errors.domain) {
            console.log('there is a domain error.');
            $('#domain-list-group').addClass('has-error'); // add the error class to show red input
            $('#domain-list-group').append('<div class="help-block">' + data.errors.domain + '</div>'); // add the actual error message under our input
            $('form').append('<div id="alert" name="alert" class="alert alert-danger">' + data.errors.domain + '</div>').hide().fadeIn("slow");
            $('#alert').delay(2000).fadeOut("slow", function() {
              $(this).remove();
            });
          }
        } else {
          // ALL GOOD! just show the success message!
          console.log(data.response);
          $('form').append('<div id="alert" name="alert" class="alert alert-success">' + data.message + '</div>').hide().fadeIn("slow");
          // Fade Message Out...
          $('#alert').delay(2000).fadeOut("slow", function() {
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











function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };
  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];
    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;
    var domain;
     //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }
    //find & remove port number
    domain = domain.split(':')[0];
    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(domain);
  });
}



function renderStatus(statusText) {
  document.getElementById('domain').value = statusText;
  //document.getElementById('blocklisthost').value = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
      renderStatus(url);
  });
});

document.addEventListener('DOMContentLoaded', restore_options);
