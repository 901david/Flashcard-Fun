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
var currentIndexVal = 1;
var userDirectory;
var userLogged;




// Determines what type of card to create based on which button is clicked.
function grabDataAndRun (){
  $(".clickHerePlease").click(function() {
    var regGroup = firebase.database().ref("/" + userDirectory + "/regular/");
    let questionArg = $("#frontCardData").val();
    let answerArg = $("#backCardData").val();
    let dataArg = $(this).attr("data-Choice");
    // Gives us a continuing variable scheme
    function whatVariableToUse (frontArg, backArg) {
      variableNumber++;
      currentVariableName = { front: frontArg, back: backArg, cardType: dataArg };
      if (userLogged === true) {
        regGroup.push(currentVariableName);
      }
      else {
      cardCreatedArray.push(currentVariableName);
      }
      console.log(cardCreatedArray);
      $("#cardStorage").empty();
      createSideBar();
    };
    whatVariableToUse(questionArg, answerArg);
});
};
function displayYourCard () {
  $("#displayCardsBox").empty().append('<h1>Card ' + currentIndexVal + '</h1><div class="btn btn-success pull-left" id="revealFront">Reveal Front of Card</div><div class="btn btn-danger pull-right" id="revealBack">Reveal Back of Card</div><div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" id="displayCards"><img src="images/indexfront.jpg" alt"Front of Index Card" class="img-responsive pull-left imgBorder"><img src="images/indexback.jpg" alt"Back of Index Card" class="img-responsive pull-right imgBorder"></div><div class="btn btn-primary" id="revealNext">Reveal the Next card</div>');
  $("#revealFront").click(function(){
    if (cardCreatedArray[currentIndexVal-1].cardType === "basic") {
    $("#displayCards").prepend("<p>" + cardCreatedArray[currentIndexVal -1].front + "</p>");
    }
    else {
      $("#displayCards").prepend("<p>" + (cardCreatedArray[currentIndexVal -1].front).replace(cardCreatedArray[currentIndexVal -1].back, "...") + "</p>");
      };
    });
  $("#revealBack").click(function(){
    if (cardCreatedArray[currentIndexVal-1].cardType === "basic") {
    $("#displayCards").prepend("<p>" + cardCreatedArray[currentIndexVal -1].back + "</p>");
    }
    else {
      $("#displayCards").prepend("<p>" + cardCreatedArray[currentIndexVal -1].front + "</p>");
    }
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
  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    userDirectory = user.uid;
    userLogged = true;
    console.log(userDirectory);
    $("#topStuff").append("<p>" + user.email + "</p><p>You are logged in.</p>");

  }
  else {
    console.log("No user found");
    userLogged = false;
    $("#topStuff").append('<div class="btn btn-warning pull-right" id="signInSecondary">Sign in Here</div>');
    $("#signInSecondary").click(function () {
      window.location.href="index.html";
    });

  }
});
  $("#reviewCardSelector").click(function(){
    displayYourCard();
  });
grabDataAndRun(currentVariableName);
createSideBar();
});
