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

var total = $('#campaign-donations').text();

//var total = $('#total-funds-total').text();
if(total != "0") {
	total = total.slice(0,-2);
	total = parseInt(total);

	$('#total-funds-amt').empty().text(total.toLocaleString());
	$('#total-funds-amt-header').text("$" + total.toLocaleString());
	
} else if(total == "0") {
	$('#total-funds-amt').empty().text(total);
	$('#total-funds-amt-header').empty().text(total);
} else {
	$('#total-funds-amt').empty().text("0");
	$('#total-funds-amt-header').empty().text("0");
}
