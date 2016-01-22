<?php
/*
Add this to /etc/sudoers (at your own risk - but needed for this):

User_Alias WWW_USER = www-data
Cmnd_Alias WWW_COMMANDS = /usr/local/bin/gravity.sh, /usr/local/bin/whitelist.sh, /usr/local/bin/blacklist.sh
WWW_USER ALL = (ALL) NOPASSWD: WWW_COMMANDS
*/

// Some key to protect API. Not very secure.
$apiKey = "123456789";


/*
* Paths to stuff. Change if non-standard.
*/
//White
$whiteListFile = "/etc/pihole/whitelist.txt";
$whiteListScript = "/usr/local/bin/whitelist.sh";
//Black
$blackListFile = "/etc/pihole/blacklist.txt";
$blackListScript = "/usr/local/bin/blacklist.sh";

$errors = array();
$data   = array();


// Check Key
$userKey = (isset($_REQUEST['piholekey']) && !empty($_REQUEST['piholekey'])) ? $_REQUEST['piholekey'] : 0;
if($userKey != $apiKey) {
    $data['success'] = false;
    $data['errors']['piholekey'] = "API ERR: Key Auth Fail. Check your Settings.";
    echo json_encode($data);
    exit();
}

// Verify There's something to do...
$userAction = strtolower((isset($_REQUEST['action']) && !empty($_REQUEST['action'])) ? $_REQUEST['action'] : 'none');
if($userAction == 'none') {       
    $data['status'] = false;
    $data['errors']['action'] = "API ERR: No Action Requested.";
    print json_encode($data);
    exit();
}

// Verify there's a list to work with...
$userList = strtolower((isset($_REQUEST['list']) && !empty($_REQUEST['list'])) ? $_REQUEST['list'] : 'none');
if($userList != "black" && $userList != "white") {
    $data['success'] = false;
    $data['errors']['list'] = "API ERR: Invalid List Specified";
    print json_encode($data);
    exit();
}

// Perform actions that don't require a domain..
if($userAction == "getlist") {
    $result['success'] = "ok";
    $result['action'] = "getlist";
    $result['list'] = $userList;
    $result['domains'] = getList($userList);
    echo json_encode($result);
    exit();
}

// So, Add/Remove options are left.

// Check the domain being submitted...
$userDomain = (isset($_REQUEST['domain']) && !empty($_REQUEST['domain'])) ? $_REQUEST['domain'] : 0;
if(!validateDomain($userDomain)) {
    $result['success'] = false;
    $result['message'] = "Invalid Domain Pattern";
    $result['domain'] = $userDomain;
    print json_encode($result);
    exit();
}

//Nothing Left to do, except for add/remove...
if($userAction == "add" || $userAction == "delete") {
    $data['success'] = true;
    $data['message'] = "Action ".$userAction." on list ".$userList." domain ".$userDomain." executed";
    $data['action'] = $userAction;
    $data['list'] = $userList;
    $data['response'] = handleList($userDomain,$userAction,$userList);
    print json_encode($data);
    exit();
} else {
        echo "nope.";
}


// Helpers
function handleList($domain = 'null', $action = 'add', $list = 'white') {
    global $whiteListFile, $blackListFile, $whiteListScript, $blackListScript;
    if($domain == 'null') {
        return false;
    }
    if($list != 'black' && $list != 'white') {
        return false;
    } else {
        $command = 'sudo ' . ($list == 'white' ? $whiteListScript : $blackListScript) . ($action == 'delete' ? ' -d ' : ' ') . $domain;
    }
    exec($command,$result);
    return $result;
}

function getList($list = 'white') {
    global $whiteListFile, $blackListFile;
    if($list == 'white') {
        $output = file($whiteListFile, FILE_IGNORE_NEW_LINES);
    } else {
        $output = file($blackListFile, FILE_IGNORE_NEW_LINES);
    }
    return $output;
}



function validateDomain($domain) {
    if(!preg_match("/^([a-z0-9][a-z0-9-]{0,62}\.)+([a-z]{2,4})$/i", $domain)) {
        return false;
    }
    return true;
}
