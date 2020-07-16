var hour = 9;
var ampm = "AM";
var dayEvents = [];

//Function to display current day in header
function displayDate()
{
    var date = moment().format("dddd, MMMM Do YYYY");
    $("#currentDay").text(date);
    $("#currentDay").addClass("font-weight-bold text-info");
}

//function to generate time blocks
function generateTimeBlock(){
    
    for(var i = 0 ; i < 9  ; i++){

        var time = hour + ampm;     //eg. time:9AM

        //Create time block for one hour
        var block = $("<div>").addClass("row mx-auto");

        // Hour Block
        var hourText = $("<h5>").addClass("text-right").text(time);
        var hourBlock = $("<div>").addClass("hour bg-light col-2").append(hourText);

        // TextArea Block
        var textBlock = $("<textarea>").addClass("description overflow-auto text-dark col-8").text("").attr("id",time);
        setTimeBlockBackground(textBlock, hour, ampm);

        // Save Button block
        var saveIcon = $("<span>").addClass("fa fa-save");
        var saveButton = $("<button>").addClass("btn saveBtn time-block col-1").append(saveIcon);

        // Append hourBlock, textBlock and saveButton to one block
        block.append(hourBlock);
        block.append(textBlock);
        block.append(saveButton);

        $("#planner").append(block);    //Append one block to id 'planner'

        // Event listener on save button calls saveCalenderEvent()
        $(saveButton).on("click", saveCalendarEvent);

        //Increment hour by 1
        incrementTimeHour();

    }
}

// function to save calender event in localStorage
function saveCalendarEvent() {
    
    //  var currentDate = moment().format("L");
    // console.log(currentDate);

    var updateNote = false;

    var textArea = $(this).parent().children()[1];  //gets textarea of block whose save button is clicked

    var currentHour = textArea.id;  //text area id is time[eg. 9AM]

    // Object to store in localStorage
    var currentEvent = {
        eventTime: currentHour,
        eventNote: textArea.value
    };

    dayEvents = JSON.parse(localStorage.getItem("dayEvents"));  //Gets dayEvents array if already exists in localStorage

    // If dayEvents exists 
    if(dayEvents){

        //Update event when save button is clicked
        for(var i = 0 ; i < dayEvents.length; i++){
            
            // If event at current hour already exists in dayEvents, then update event
            if(dayEvents[i].eventTime === currentHour){
                
                dayEvents[i].eventNote = textArea.value;
                updateNote = true;
            }         
        } 
        if(!updateNote) {
            if(currentEvent.eventNote === "")   //When save button is clicked and note is empty, then return
            {
                return;
            }
            else{
                dayEvents.push(currentEvent);   //push currentEvent object in dayEvents array
            }
                  
        }
    }
    else{
        if(currentEvent.eventNote === "")
        {
            return;
        }
        else{
            dayEvents = [currentEvent];     //If dayEvents array is not defined, initialize array 
        }
        
    }

    localStorage.setItem("dayEvents", JSON.stringify(dayEvents));   //Save dayEvents array in localStorage: key -> 'dayEvents' value -> dayEvents array
    
}

// function to Load/retrive calender events from  local storage
function loadCalenderEvents(){
   
    dayEvents = JSON.parse(localStorage.getItem("dayEvents"));
    
    if(dayEvents !== null){
        
        var dayEventsLength = dayEvents.length;
        
        for(var i = 0 ;i < dayEventsLength ; i++){
           
            var eventTime = dayEvents[i].eventTime;

            $("#"+eventTime).text(dayEvents[i].eventNote); 

        }
    }
}


//function to increment hour
function incrementTimeHour()
{
    if(hour === 11){
        ampm = "PM";
    }
    if(hour === 12)
    {
        hour = 1;
    }
    else{
        hour++;
    }    
}

// function to set background color to indicate time block is in past, present or future
function setTimeBlockBackground(textBlock, hour, ampm)
{
    var currentHour = parseInt(moment().format("H")); // Gets current hour in 24 hour format
    
    var hour24;

    //convert time in 24 hour format
    if (ampm  === "AM" && hour === 12) {
        
        hour24 = 0;
    
    } else if (ampm === "AM") {
       
        hour24 = hour;
    
    } else if (ampm == "PM" && hour === 12 ) {
        
        hour24 = hour;
    
    } else if (ampm === "PM" && hour >= 1) {
        
        hour24 = hour + 12;
    }

    // Set background    
    if(hour24 < currentHour){
        
        textBlock.addClass("past");
        // textBlock.attr("readOnly", true);

    }
    else if(hour24 > currentHour){
        
        textBlock.addClass("future");
    }
    else if(hour24 === currentHour){
        
        textBlock.addClass("present");
    }

}

displayDate();  // function called to disply date
generateTimeBlock();    // function called to generate blocks
loadCalenderEvents();   // function called to retrive calender events