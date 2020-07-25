$(document).ready(function () {

	$('.js-start-demo').click(function (e) {
		e.preventDefault();
		$('.js-screen-1').hide();
		$('.js-screen-2').show();
    $('.fullscreen').html(
      '<iframe id="testWindow" class="d-md-block d-none" frameBorder="0" src="https://stackblitz.com/github/rajeshm101/marvel-superhero" width="100%" height="100%"></iframe>' +
      '<iframe id="testWindow1" class="d-md-none d-block" frameBorder="0" src="https://stackblitz.com/github/rajeshm101/marvel-superhero?embed=1" width="100%" height="100%"></iframe>'
    )
		startCountDown();
	})

	$('.js-view-question').click(function (e) {
		e.preventDefault();
		$('#viewQuestionModal').modal('show')
	})
	$('#test-started').click(function (e) {
		e.preventDefault();
		$('#testHasStardetModal').modal('hide');
		$('#viewQuestionModal').modal('show');
	})
	

	$('.js-finish-test').click(function (e) {
		e.preventDefault();
		$('#finishTestModal').modal('show');
		//var res = confirm('Thank you for trying out the SkillStack demo! Go back to homepage?');
		//if (res) {
		//	window.location.href = 'https://www.skillstack.com'
		//}
	})

	function startCountDown() {
    var deadline = new Date(new Date().getTime() +  10 * 60 * 1000);
    initializeClock('clockdiv', deadline);
    var app = document.getElementById('chromeapp');
    app.style.top = '0px';
  }

  function initializeClock(id, _endtime) {
    //show the test started popup
	setTimeout(function (){$('#testHasStardetModal').modal('show');},10000);
	
    clock = document.getElementById(id);
    hoursSpan = clock.querySelector('.hours');
    minutesSpan = clock.querySelector('.minutes');
    secondsSpan = clock.querySelector('.seconds');
    endtime = _endtime;
    updateClock();
      timeinterval = setInterval(() => {
      updateClock();
    }, 1000);
  }

  function updateClock() {
    var t = getTimeRemaining(endtime);

    hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

    if (t.total <= 0) {
      stopTestCountdown();
    }

    // hack added to set the iframe focused every sec
    try {
        document.getElementById('testWindow').focus();
    } catch (e) { console.log(e); }
  }

  function getTimeRemaining(endtime) {
    var t = Date.parse(endtime) - new Date().getTime();
    var seconds = Math.floor((t / 1000) % 60);
    var minutes = Math.floor((t / 1000 / 60) % 60);
    var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    var days = Math.floor(t / (1000 * 60 * 60 * 24));
    return {
        'total': t,
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
    };
  }

  function stopTestCountdown () {
    window.location.href = 'https://www.skillstack.com'
  }
  
  //$('#testHasStardetModal').modal('show');
 
})

 function showQuestion(e){
    $('#testHasStardetModal').modal('hide');
    $('#viewQuestionModal').modal('show');
  }
  
  function goToHome(){
	 window.location.href = 'https://www.skillstack.com'; 
  }

  function goToSignup(){
	 window.location.href = 'https://www.skillstack.com/app/signup'; 
  }
  
