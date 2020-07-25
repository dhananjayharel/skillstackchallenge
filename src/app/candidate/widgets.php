<?php
//echo "REF::".$_SERVER['HTTP_REFERER'];

///djrequire_once(dirname(dirname(dirname(__FILE__))) . "/engine/start.php");
$srcpath=$_GET["examplepath"];
$courseid=$_GET["courseid"];

$username;
if(isset($_COOKIE['SIDKK'])||!empty($_COOKIE['SIDKK'])){
$username=$_COOKIE['SIDKK'];
}

?>




<!DOCTYPE HTML>
<html>
<head>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script type='text/javascript'>
var examplePath='<?php echo $srcpath ?>';
var courseId='<?php echo $courseid ?>';

$(document).ready(function(){
	
	$.ajax({url: "http://ec2-52-91-49-244.compute-1.amazonaws.com:3000/api/RunningContainers/getavailablecontainerhttp",
  type: "GET",
  data: {courseid : courseId},
  dataType: "json", success: function(result){
  
   console.log("'https://www.skillstack.com/"+result.nginxPath+"/'");
   //$("#testWindow").src="'https://www.skillstack.com/"+result.nginxPath+"/'";
   document.getElementById("testWindow").src="https://www.skillstack.com/"+result.nginxPath+"/#/home/project/mark_trego_python_beginners/part9";
   checkIframe();
  }});
	
	
})
onload=function(){
	
}
</script>
<script type='text/javascript' src='CookieUtility.js' ></script>
<style>
#footer{
position: absolute;
bottom: 5%;
font-family: Verdana;
font-size: 11px;
/* left: 0px; */
width: 23%;
display: none;
text-align: right;
right: 4px;
}
#footer a{
text-decoration:none;
color:rgb(28, 97, 216);
}
#content{
background-color:#f3f3f3;
height: 100%;
position: absolute;
width: 100%;
}
</style>
<script type="text/javascript">
 function checkIframe() {
        console.log("in check iframe");
        const myiframe = document.getElementById('testWindow');
        const loadingIndicator = document.querySelector('#theia-mini-browser-load-indicator');
	
        if (window.navigator.userAgent.search(/Firefox/)) {
            myiframe.onload = function () {
				console.log("myiframe.onload done");
                console.log('firefox...');
                loadingIndicator.style.display = 'none';
            };
        } else {
            myiframe.onreadystatechange = function () {
				console.log("myiframe.readyState"+myiframe.readyState);
                if (myiframe.readyState == 'complete') {
                    loadingIndicator.style.display = 'none';
                }
            }
        }

    }
</script>
	<!-- Google Analytics -->

</head>
<body> 

	<div id="theia-mini-browser-load-indicator">
Loading the code widget ...
</div>
<iframe id="testWindow" src="" width="100%" height="500"></iframe>
</body>
</html>