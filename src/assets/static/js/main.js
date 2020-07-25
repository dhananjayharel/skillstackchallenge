
$(document).ready(function(){
  /* Get iframe src attribute value i.e. YouTube video url
  and store it in a variable */
  var url = $("#demoVideo").attr('src');
  $("#demoVideo").attr('src', '');
  /* Assign empty url value to the iframe src attribute when
  modal hide, which stop the video playing */
  $("#codeDemoModal").on('hide.bs.modal', function(){
      $("#demoVideo").attr('src', '');
  });
  
  /* Assign the initially stored url back to the iframe src
  attribute when modal is displayed again */
  $("#codeDemoModal").on('show.bs.modal', function(){
      $("#demoVideo").attr('src', url);
  });
});

function checkElemIfVisible () {
  const realProj = document.querySelector('.real-project-section');
  window.assignCssClass(realProj, 'fadeInUp');
  const visOff = document.querySelector('.video-interview-section');
  window.assignCssClass(visOff, 'fadeInUp');
  const langSec = document.querySelector('.language-image');
  window.assignCssClass(langSec, 'zoomIn');
  const elemDiv0 = document.querySelector('#products-kk-0 .text');
  window.assignCssClass(elemDiv0, 'pulse');
  const elem0 = document.querySelector('#products-kk-0 .image');
  window.assignCssClass(elem0);
  const elemDiv1 = document.querySelector('#products-kk-1 .text');
  window.assignCssClass(elemDiv1, 'pulse');
  const elem1 = document.querySelector('#products-kk-1 .image');
  window.assignCssClass(elem1 , 'fadeInLeft');
  const elemDiv2 = document.querySelector('#products-kk-2 .text');
  window.assignCssClass(elemDiv2, 'pulse');
  const elem2 = document.querySelector('#products-kk-2 .image');
  window.assignCssClass(elem2);
  const press = document.querySelector('#press');
  window.assignCssClass(press, 'fadeInUp');
  const getStartdBtn = document.querySelector('#get-started-btn');
  window.assignCssClass(getStartdBtn, 'tada');
  const quickDemoBtn = document.querySelector('#quick-demo-btn');
  window.assignCssClass(quickDemoBtn, 'tada');
}

function  assignCssClass (elem, cssClass = 'fadeInRight') {
  if (window.isVisible(elem)) {
    setTimeout( function () {
      elem.classList.remove('visibility-off');
      elem.classList.add(cssClass);
    }, 10);
  }
}
function  isVisible (ele) {
  let { top, bottom } = ele.getBoundingClientRect();
  top = top + 240;
  bottom = bottom + 240;
  const vHeight = (window.innerHeight || document.documentElement.clientHeight);

  return (
    (top > 0 || bottom > 0) &&
    top < vHeight
  );
}

function scrollTo2(id) {
//$('#menuCheckbox').click();
  document.querySelector('#' + id).scrollIntoView({ 
    behavior: 'smooth',
    block: 'start',
  inline: "start"
  });
  return false;
}
function scrollTo3(id) {
$('#menuCheckbox').click();
  document.querySelector('#' + id).scrollIntoView({ 
    behavior: 'smooth',
    block: 'start',
  inline: "start"
  });
//setTimeout(function(){scrollElmVert(document.querySelector('#' + id),-90);},300);
  return false;
}

function goToLogin() {
  window.location.href="app/signup"
}

window.onscroll = function() {window.checkElemIfVisible()};

function toggleMenu(e){
console.log("toggle checked"+e.checked);
if(e.checked){
document.getElementById("navbarNavDropdown").style.display='block';
document.getElementById("navbarNavDropdown").style.height='240px';
}
else
document.getElementById("navbarNavDropdown").style.height='0px';
}


function scrollElmVert(el,num) { // to scroll up use a negative number
var re=/html$/i;
while(!re.test(el.tagName) && (1 > el.scrollTop)) el=el.parentNode;
if(0 < el.scrollTop) el.scrollTop += num;
}

onload=function(){
setTimeout(function(){
document.querySelectorAll("#how-it-works .nav-item a")[0].classList.add("active");
document.querySelectorAll("#how-it-works .nav-item a")[1].classList.remove("active");
document.querySelectorAll("#how-it-works .nav-item a")[2].classList.remove("active");},100);

var tryNowLink = document.querySelectorAll('.js-try-now');
for (var i = 0; i < tryNowLink.length; i++) {
  tryNowLink[i].addEventListener('click', function(event) {
      event.preventDefault();
      if (confirm("Launch the Skillstack Quick Demo Test in a new tab?")) {
        window.open(event.target.href, '_blank');
      }
  });
}
}

var options = {
strings: ["VueJS ^1000", "Angular ^1000", "ReactJS ^1000", "NodeJS ^1000", "PHP ^1000", "Drupal ^1000", "Wordpress ^1000", "Python ^1000", ".NET ^1000"],
typeSpeed: 100,
backDelay: 1000,
loop: true,
showCursor: true,
fadeOut: true
}
var typed = new Typed(".js-language-toggle", options);


