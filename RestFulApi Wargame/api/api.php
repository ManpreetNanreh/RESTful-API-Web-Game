<?php
//Switch the database connection to using PDO instead of pg_connect.
//Switch from using md5 to password_hash.
$method = $_SERVER['REQUEST_METHOD'];
parse_str(file_get_contents('php://input'), $input);

//This is the array that is sent to the frontend with information.
$reply = array();

//Database connection string.
$dbhost = ""; //Database host location.
$dbname = ""; //Database name.
$dbuser = ""; //Database username.
$dbpass = ""; //Database password.
$conn_string="host=" . $dbhost . " dbname=" . $dbname . " user=" . $dbuser . " password=" . $dbpass;

$dbconn = pg_connect($conn_string);

switch ($method) {
	//Putting user information into the database.
	case 'PUT':

		if($input["type"] == 0){
			$md5_pwd = md5($input["userpass"]);
			$query = pg_prepare($dbconn, "myQuery1", "INSERT INTO wwuserinfo (username, userpass, firstname, lastname, email) VALUES ($1, $2, $3, $4, $5)") ;

			$query = pg_execute($dbconn, "myQuery1", array($input["id"], $md5_pwd, $input["firstname"], $input["lastname"], $input["email"]));

			// Populate the reply array with the number of rows affected by the query
			$reply["id"] = pg_affected_rows($query);

			if($reply["id"] > 0){
				http_response_code(200);
			}else{
				http_response_code(404);
			}
		}elseif ($input["type"] == 1){

			$md5_pwd = md5($input["userpass"]);

			$query = pg_prepare($dbconn, "myQuery1", "INSERT INTO highscore (uid, score) VALUES 
				((SELECT uid from wwuserinfo where username=$1 AND userpass=$2), $3)");

			$query = pg_execute($dbconn, "myQuery1", array($input["userid"], $md5_pwd, $input["currentScore"]));

			// Populate the reply array with the number of rows affected by the query.
			$reply["id"] = pg_affected_rows($query);
		}
		break;

	case 'GET':

		if($_REQUEST["type"] == 0){

			$md5_pwd = md5($_REQUEST["userpass"]);

			// If there's a user, count will give 1, otherwise it will give 0.
			$query = pg_prepare($dbconn, "myQuery1", "SELECT COUNT(*) from wwuserinfo where username=$1 AND userpass=$2") ;

			$query = pg_execute($dbconn, "myQuery1", array($_REQUEST["id"], $md5_pwd));

			$row = pg_fetch_row($query);

			$reply["id"] = $row[0];

			//We found the user in database.
			if($reply["id"] > 0){
				header($_SERVER["SERVER_PROTOCOL"]." 200 OK");
			}else{
			//We didn't find the user in database.
				header($_SERVER["SERVER_PROTOCOL"]." 404 NOT FOUND");
			}		
		}elseif($_REQUEST["type"] == 1){
			$md5_pwd = md5($_REQUEST["userpass"]);

			// If there's a user, count will give 1, otherwise it will give 0
			$query = pg_prepare($dbconn, "myQuery1", "SELECT firstname, lastname, email from wwuserinfo where username=$1 AND userpass=$2") ;

			$query = pg_execute($dbconn, "myQuery1", array($_REQUEST["id"], $md5_pwd));

			$row = pg_fetch_row($query);

			$reply["firstname"] = $row[0];
			$reply["lastname"] = $row[1];
			$reply["email"] = $row[2];

			//We found the user in database.
			header($_SERVER["SERVER_PROTOCOL"]." 200 OK");
		}elseif($_REQUEST["type"] == 2){
			$query = pg_prepare($dbconn, "myQuery1", "SELECT username, score from highscore natural join wwuserinfo order by score desc limit 10");

			$query = pg_execute($dbconn, "myQuery1", array());
			
			$counter = 0;
			while($row = pg_fetch_assoc($query)){
				$reply[$counter] = $row;
				$counter = $counter + 1;
			}

			header($_SERVER["SERVER_PROTOCOL"]." 200 OK");
		}
		break;

	case 'POST':

		$md5_pwd = md5($_REQUEST["userpass"]);
		
		$query = pg_prepare($dbconn, "myQuery1", "UPDATE wwuserinfo SET userpass=$1, firstname=$2, lastname=$3, email=$4 WHERE username=$5");

		$query = pg_execute($dbconn, "myQuery1", array($md5_pwd, $_REQUEST["firstname"], $_REQUEST["lastname"], $_REQUEST["email"], $_REQUEST["username"]));

		header($_SERVER["SERVER_PROTOCOL"]." 200 OK");
		break;

	case 'DELETE':

		$md5_pwd = md5($input["userpass"]);
		
		$query1 = pg_prepare($dbconn, "myQuery1", "DELETE from highscore where uid=(SELECT uid from wwuserinfo WHERE username=$1 AND userpass=$2)");

		$query1 = pg_execute($dbconn, "myQuery1", array($input["username"], $md5_pwd));

		$query2 = pg_prepare($dbconn, "myQuery2", "DELETE from wwuserinfo where username=$1 AND userpass=$2");

		$query2 = pg_execute($dbconn, "myQuery2", array($input["username"], $md5_pwd));

		header($_SERVER["SERVER_PROTOCOL"]." 200 OK");

		$reply["id"] = "DELETED";
		break;
}

pg_close($dbconn);
header('Content-Type: application/json');
echo json_encode($reply);
?>
