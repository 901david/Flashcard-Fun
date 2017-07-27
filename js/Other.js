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
var userGroupInput = "";
var listener = firebase.database().ref();
var variableNumber = 0;
var cardCreatedArray = [];
var fireCreatedArray = [];
var currentVariableName;
var currentIndex = variableNumber - 1;
var currentIndexVal = 1;
var userDirectory;
var userLogged = false;
var randomVarTest;
var key;
var cardCount = 0;
var firebaseSnap;
var firebaseSnapDeeper;
var innerkey;




// Determines what type of card to create based on which button is clicked.
function grabDataAndRun (){
  $(".clickHerePlease").click(function() {
    if ((userLogged === false) && (!($("#groupName").val().trim() === ""))) {
      alert("Sorry, groups are only available for users that are signed in.");
    }
    else {
    if ($("#groupName").val().trim() === "") {
      userGroupInput = "regular";
    }
    else {
      userGroupInput = $("#groupName").val().trim();
    }
    var regGroup = firebase.database().ref("/" + userDirectory + "/" + userGroupInput + "/");
    let questionArg = $("#frontCardData").val().trim();
    let answerArg = $("#backCardData").val().trim();
    let dataArg = $(this).attr("data-Choice");
    if ((dataArg === "cloze") && (!(questionArg.includes(answerArg)))) {
      alert("Your card was not formatted properly");
    }
    $("#frontCardData").val("");
    $("#backCardData").val("");
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
      $("#cardStorage").empty();
      createSideBar();
    };
    whatVariableToUse(questionArg, answerArg);
  }
});
};
function displayYourCard () {
  $("#displayCardsBox").empty().append('<h1>Card ' + currentIndexVal + '</h1><div class="btn btn-success pull-left" id="revealFront">Reveal Front of Card</div><div class="btn btn-danger pull-right" id="revealBack">Reveal Back of Card</div><div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" id="displayCards"><img src="images/indexfront.jpg" alt"Front of Index Card" class="img-responsive pull-left imgBorder" id="cardFrontFlip"><img src="images/indexback.jpg" alt"Back of Index Card" class="img-responsive pull-right imgBorder"></div><div class="btn btn-primary" id="revealNext">Reveal the Next card</div>');
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
// This function will be used for local data
function whatDataToUse () {
  for (let i = 0; i < cardCreatedArray.length;i++){
      $("#cardStorage").append("<div><p>Card " + (i + 1) + "</p><img data-index='" + (i + 1) + "' class='col-xs-3 col-sm-3 col-md-12 col-lg-12 img-responsive showCard' src='images/indexfront.jpg' alt='Index Card Place holder, click to view.'></div>");
  }
    $(".showCard").click(function() {
    currentIndexVal = $(this).attr("data-index");
    displayYourCard();
    });
};
function createSideBar (){
  if(userLogged === false) {
    whatDataToUse();
  }
  else if (userLogged === true) {
    whatDataToUseFire();
  }
};

// This function will be used for firebase data
function whatDataToUseFire () {
  for (key in firebaseSnap) {
    firebaseSnapDeeper = firebaseSnap[key];
    for(innerKey in firebaseSnapDeeper) {
      console.log(key);
      console.log(firebaseSnapDeeper[innerKey]);
      cardCount++;
      $("#cardStorage").append("<div><p>Group: " + key + "</p><p>Card: " + cardCount + "</p><img data-index='" + cardCount + "' class='col-xs-3 col-sm-3 col-md-12 col-lg-12 img-responsive showCard' src='images/indexfront.jpg' alt='Index Card Place holder, click to view.'></div>");
      $(".showCard").click(function() {
      currentIndexVal = $(this).attr("data-index");
      displayYourCard();
      });
    }
  }
};

$(document).ready(function() {
  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    userDirectory = user.uid;
    userLogged = true;
    $("#topStuff").append("<p>" + user.email + "</p><p>You are logged in.</p>");
    $("#topStuff").append('<div class="btn btn-warning pull-right" id="signOutPeriod">Sign Out</div>');
    $("#signOutPeriod").click(function (){
      firebase.auth().signOut().then(function() {
      alert("Sign out Successful");
      location.reload();
      }).catch(function(error) {
      console.log("A fatal error occurred.");
      });
    });

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
listener.on("child_added", function (snapshot) {
  firebaseSnap = snapshot.val();
  whatDataToUseFire();
});
  $("#reviewCardSelector").click(function(){
    displayYourCard();
  });
grabDataAndRun(currentVariableName);
createSideBar();
});
