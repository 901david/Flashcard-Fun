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
var cardCreatedArray = [{ front: "4+4", back: "8", cardType: "basic" }, { front: "4+3", back: "7", cardType: "basic" }, { front: "GW is pres", back: "GW", cardType: "cloze" }];
var currentVariableName;
var currentIndex = variableNumber - 1;
var currentIndexVal = 1


// Determines what type of card to create based on which button is clicked.
function grabDataAndRun (){
  $(".clickHerePlease").click(function() {
    let questionArg = $("#frontCardData").val();
    let answerArg = $("#backCardData").val();
    let dataArg = $(this).attr("data-Choice");
    // Gives us a continuing variable scheme
    function whatVariableToUse (frontArg, backArg) {
      variableNumber++;
      currentVariableName = { front: frontArg, back: backArg, cardType: dataArg };
      cardCreatedArray.push(currentVariableName);
      console.log(cardCreatedArray);
      $("#cardStorage").empty();
      createSideBar();
    };
    if(dataArg === "basic") {
      whatVariableToUse(questionArg, answerArg);
    }
    else if (dataArg === "cloze") {
      whatVariableToUse(questionArg, answerArg);
    }
    else {
      console.log("This means something went fatally wrong.  Error.");
    }

});
};
function displayYourCard () {
  $("#displayCardsBox").empty().append('<h1>Card' + currentIndexVal + '</h1><div class="btn btn-success pull-left" id="revealFront">Reveal Front of Card</div><div class="btn btn-danger pull-right" id="revealBack">Reveal Back of Card</div><div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" id="displayCards"><img src="images/indexfront.jpg" alt"Front of Index Card" class="img-responsive pull-left imgBorder"><img src="images/indexback.jpg" alt"Back of Index Card" class="img-responsive pull-right imgBorder"></div><div class="btn btn-primary" id="revealNext">Reveal the Next card</div>');
  $("#revealFront").click(function(){
    $("#displayCards").prepend("<p>" + cardCreatedArray[currentIndexVal -1].front + "</p>");

  });
  $("#revealBack").click(function(){
    $("#displayCards").prepend("<p>" + cardCreatedArray[currentIndexVal -1].back + "</p>");

  });
  $("#revealNext").click(function(){
    if (currentIndexVal < cardCreatedArray.length){
      $("#displayCards").empty();
      currentIndexVal++;
      displayYourCard();
    }
    else{
      alert("No more cards to show currently");
    }
  });
};
function createSideBar (){
  if(!(cardCreatedArray === "")) {
  for (let i = 0; i < cardCreatedArray.length;i++){
      $("#cardStorage").append("<div><p>Card " + (i + 1) + "</p><img data-index='" + (i + 1) + "' class='col-xs-3 col-sm-3 col-md-12 col-lg-12 img-responsive showCard' src='images/indexfront.jpg' alt='Index Card Place holder, click to view.'></div>");
  }
    $(".showCard").click(function() {
    currentIndexVal = $(this).attr("data-index");
    displayYourCard();
    });
  }
};



$(document).ready(function() {
  $("#reviewCardSelector").click(function(){
    displayYourCard();
  });
grabDataAndRun(currentVariableName);
createSideBar();
});
