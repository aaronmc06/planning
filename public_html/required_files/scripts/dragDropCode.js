$(document).ready(function(){

	console.log( "ready!" );
	
	var draggingID;


	$( ".draggable" ).draggable({
		cursor: "crosshair",
		helper: "clone",
		start: function( event, ui) {
			console.log("START DRAGGING");
			
			draggingID = $(this).attr("id");
			console.log(draggingID);
		}
	});
	
	
    $( ".draggable" ).droppable({
      drop: function( event, ui ) {
      
      	console.log(ui);
      	console.log(event);
      	
      	//Flop Styles
        $( this ).css("background-color", "#666666");
        $( this ).css("border", "1px dashed #000000");
        $( this ).html("Drag");
        
        var oldID = "#" + draggingID;
        $(oldID).css("background-color", "#CCCCCC");
        $(oldID).css("border", "1px solid #000000");
		$(oldID).html("Drop");

        //Swap ID's of elements.
        $(oldID).attr("id", $(this).attr("id"));
        $( this ).attr("id", draggingID);
        
      }
    });
    

});