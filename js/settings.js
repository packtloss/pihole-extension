// Saves options to chrome.storage.sync.
function save_options() {
  var piholeurl = document.getElementById('piholeurl').value;
  var piholekey = document.getElementById('piholekey').value;
  var pihole_local_admin = document.getElementById('pihole_local_admin').value;
  chrome.storage.sync.set({
    piholekey: piholekey,
    piholeurl: piholeurl,
    pihole_local_admin: pihole_local_admin
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.innerHTML = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 2000);
  });
}

// Localstorage
function restore_options() {
  // Use defaults
  chrome.storage.sync.get({
    piholekey: '123456789',
    piholeurl: 'http://raspberrypi.local/admin/apiext.php',
    pihole_local_admin: 'http://raspberrypi.local/admin/index.php'
  }, function(items) {
    document.getElementById('piholeurl').value = items.piholeurl;
    document.getElementById('piholekey').value = items.piholekey;
    document.getElementById('pihole_local_admin').value = items.pihole_local_admin;
  });
}

// Empty storage
function clear_options() {
  chrome.storage.sync.clear();
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('clear').addEventListener('click', clear_options);
