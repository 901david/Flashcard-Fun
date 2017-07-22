// Initialize Firebase
  var config = {
    apiKey: "AIzaSyAZKSitFq3hRDPbGwjniZp6FKtxzKULXDE",
    authDomain: "flashcard-fun.firebaseapp.com",
    databaseURL: "https://flashcard-fun.firebaseio.com",
    projectId: "flashcard-fun",
    storageBucket: "",
    messagingSenderId: "519025195872"
  };
  firebase.initializeApp(config);

var variableNumber = 0;
var cardCreatedArray = [];
var currentVariableName;
var currentIndex = variableNumber - 1;


// Determines what type of card to create based on which button is clicked.
function grabDataAndRun (){
  $(".clickHerePlease").click(function() {
    console.log("You clicked me");
    let questionArg = $("#frontCardData").val();
    let answerArg = $("#backCardData").val();
    let dataArg = $(this).attr("data-Choice");
    console.log(dataArg);
    // Gives us a continuing variable scheme
    function whatVariableToUse (frontArg, backArg) {
      variableNumber++;
      currentVariableName = { front: frontArg, back: backArg, cardType: dataArg };
      cardCreatedArray.push(currentVariableName);
      console.log(cardCreatedArray);
    };
    if(dataArg === "basic") {
      console.log("You clicked me");
      whatVariableToUse(questionArg, answerArg);
    }
    else if (dataArg === "cloze") {
      console.log("You clicked me");
      whatVariableToUse(questionArg, answerArg);
    }
    else {
      console.log("This means something went fatally wrong.  Error.");
    }

});
};



// <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" id="displayCards">
//
// <img src="images/indexfront.jpg" alt"Front of Index Card" class="img-responsive pull-left imgBorder">
// <img src="images/indexback.jpg" alt"Back of Index Card" class="img-responsive pull-right imgBorder">
// </div>
$(document).ready(function() {
grabDataAndRun(currentVariableName);

});
