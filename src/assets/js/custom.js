//detect first touch

var touchable = false;

window.addEventListener('touchstart', function onFirstTouch() {
	
	
	touchable = true;
	
	window.removeEventListener('touchstart', onFirstTouch, false);
}, false);


$('.cci-card').on('mouseenter', function(){
	
	$('.cci-card').each(function(){
		$(this).removeClass('scaled');
	})
	
	$(this).addClass('scaled');	
	
})

//add comma to amounts > 1000

var total = parseInt($('#campaign-donations').text());

$('#total-funds-amt-header').text(total.toLocaleString());
$('#total-funds-amt').text("$" + total.toLocaleString());

$('.story a').on('click',function(e){
	e.preventDefault();
	//
})
