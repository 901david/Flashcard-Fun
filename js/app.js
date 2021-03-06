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
// variable declarations
var userDirectory = null;
var firebaseSnap;
var cardCreatedArray = [];
var currentIndexVal = 1;
// Controls how cards are displayed in groups in sidebar
function whatDataToUse () {
  let prevGroup = null;
  $("#cardStorage").empty();
  for (let i = 0; i < cardCreatedArray.length;i++){
    if (cardCreatedArray[i].group === prevGroup){
      $("#cardStorage").append("<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'><p class='cardSidebarText'>Card " + (i + 1) + "</p><img data-index='" + (i + 1) + "' class='col-xs-3 col-sm-3 col-md-8 col-lg-8 img-responsive showCard' src='images/indexfront.jpg' alt='Index Card Place holder, click to view.'></div>");
    }
    else {
      $("#cardStorage").append("<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'><p class='cardSidebarGroup'>Group: " + cardCreatedArray[i].group + "<p class='cardSidebarText'>Card " + (i + 1) + "</p><img data-index='" + (i + 1) + "' class='col-xs-3 col-sm-3 col-md-8 col-lg-8 img-responsive showCard' src='images/indexfront.jpg' alt='Index Card Place holder, click to view.'></div>");
      prevGroup = cardCreatedArray[i].group;
    }
  }
  $(".showCard").click(function() {
    $(".showCard").removeClass("animated flip cardBorder");
    currentIndexVal = $(this).attr("data-index");
    $(this).addClass("animated flip cardBorder");
    displayYourCard();
  });
};
// Controls display while reviewing cards
function displayYourCard () {
  $("#displayCardsBox").empty().append('<div id="moreQuestionsPlease"><span class="glyphicon glyphicon-menu-left"></span>Create More Cards</div><div id="displayAnsRight"></div><div class="row"><p class="topDisplayText">Group: ' + cardCreatedArray[currentIndexVal -1].group + '</p><p class="topDisplayTextTwo">Card ' + currentIndexVal + '</p><div class="col-xs-12 col-sm-12 col-md-6 col-lg-6" id="leftSideCards"><div class="btn btn-success topDisplayButt" id="revealFront">Reveal Front of Card</div><div id="displayAnsLeft"></div><div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" id="displayCardsLeft"><img src="images/indexfront.jpg" alt="Front of Index Card" class="img-responsive imgBorder" id="cardFrontFlip"></div><div class="btn btn-primary" id="revealPrev">Reveal the Previous card</div></div><div class="col-xs-12 col-sm-12 col-md-6 col-lg-6" id="rightSideCards"><div class="btn btn-danger topDisplayButtTwo" id="revealBack">Reveal Back of Card</div><div id="displayAnsRight"></div><div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" id="displayCardsRight"><img src="images/indexback.jpg" alt="Back of Index Card" class="img-responsive imgBorderTwo" id="cardBackFlip"></div><div class="btn btn-primary" id="revealNext">Reveal the Next card</div></div></div>');
  $("#moreQuestionsPlease").click(()=>{
    window.location.href="mainPage.html";
  });
  $("#revealFront").click(function(){
    setTimeout(()=>{
      if (cardCreatedArray[currentIndexVal-1].type === "basic") {
        $("#displayCardsLeft").prepend("<div class='cardAnswerBoxLeft'><p class='answerDisplay'>" + cardCreatedArray[currentIndexVal -1].front + "</p></div>");
      }
      else {
        $("#displayCardsLeft").prepend("<div class='cardAnswerBoxLeft'><p class='answerDisplay'>" + (cardCreatedArray[currentIndexVal -1].front).replace(cardCreatedArray[currentIndexVal -1].back, "______") + "</p></div>");
      };
    }, 800);
    $("#cardFrontFlip").addClass("animated flip");
    setTimeout(()=>{$("#cardFrontFlip").addClass("hide")}, 800);
  });
  $("#revealBack").click(function(){

    setTimeout(()=>{
      if (cardCreatedArray[currentIndexVal-1].type === "basic") {
        $("#displayCardsRight").prepend("<div class='cardAnswerBoxRight'><p class='answerDisplay'>" + cardCreatedArray[currentIndexVal -1].back + "</p></div>");
      }
      else {
        $("#displayCardsRight").prepend("<div class='cardAnswerBoxRight'><p class='answerDisplay'>" + cardCreatedArray[currentIndexVal -1].front + "</p></div");
      }
    }, 800);
    $("#cardBackFlip").addClass("animated flip");
    setTimeout(()=>{$("#cardBackFlip").addClass("hide")}, 800);
  });

  $("#revealNext").click(function(){
    $(".showCard").removeClass("animated flip cardBorder");
    if (currentIndexVal < cardCreatedArray.length){
      $("#displayCardsLeft").empty();
      $("#displayCardsRight").empty();
      currentIndexVal++;
      $('*[data-index=' + currentIndexVal + ']').addClass("animated flip cardBorder");
      displayYourCard();
    }
    else{
      alert("No more cards to show currently");
      $('*[data-index=' + currentIndexVal + ']').addClass("cardBorder");
    }
  });
  $("#revealPrev").click(function () {
    $(".showCard").removeClass("animated flip cardBorder");
    if (currentIndexVal <= 1){
      alert("You are already at the beginning.");
      $('*[data-index=' + currentIndexVal + ']').addClass("cardBorder");
    }
    else{
      $("#displayCardsLeft").empty();
      $("#displayCardsRight").empty();
      currentIndexVal--;
      $('*[data-index=' + currentIndexVal + ']').addClass("animated flip cardBorder");
      displayYourCard();
    }
  });
};
// Constructor function to build card arrays
function BuildArrays (front, back, type, group) {
  this.front = front;
  this.back = back;
  this.type = type;
  this.group = group;
};
// A one time listener that gives us the cards for that user
function listenAndSnap () {
  let listener = firebase.database().ref("/" + userDirectory);
  listener.once("value", function (snapshot) {
    firebaseSnap = snapshot.val();
    firesbaseGrabAndDistr();
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
};
// Grabs data from forms and constructs a card and pushes to firebase
function grabDataAndRun (){
  let userGroupInput = "";
  $(".clickHerePlease").click(function() {
    let questionArg = $("#frontCardData").val().trim();
    let answerArg = $("#backCardData").val().trim();
    let dataArg = $(this).attr("data-Choice");
    if ($("#groupName").val().trim() === "") {
      userGroupInput = "standard";
    }
    else {
      userGroupInput = $("#groupName").val().trim();
    }
    let regGroup = firebase.database().ref("/" + userDirectory + "/" + userGroupInput + "/");
    if ((dataArg === "cloze") && (!(questionArg.includes(answerArg)))) {
      alert("Your card was not formatted properly");
    }
    $("#frontCardData").val("");
    $("#backCardData").val("");
    function whatVariableToUse (frontArg, backArg, typeArg, catArg) {
      let currentVariableName = { front: frontArg, back: backArg, cardType: dataArg, name: catArg };
      regGroup.push(currentVariableName);
    };
    whatVariableToUse(questionArg, answerArg, dataArg, userGroupInput);
    cardCreatedArray = [];
    listenAndSnap();
  });
};
// This function takes our firebase snap and appropriatly pushes it to a local variable
function firesbaseGrabAndDistr () {
  // let prevKey = null;
  for (key in firebaseSnap) {
    firebaseSnapDeeper = firebaseSnap[key];
    for(innerKey in firebaseSnapDeeper) {
      let currentCard = new BuildArrays(firebaseSnapDeeper[innerKey].front, firebaseSnapDeeper[innerKey].back, firebaseSnapDeeper[innerKey].cardType, firebaseSnapDeeper[innerKey].name);
      cardCreatedArray.push(currentCard);
    }
  }
  whatDataToUse();
};
$(document).ready(function() {
  // Determining if we have a logged in user
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      userDirectory = user.uid;
      listenAndSnap(userDirectory);
      $("#topStuff").append("<p>" + user.email + "</p><p>You are logged in.</p>");
      $("#topStuff").append('<div class="btn btn-warning" id="signOutPeriod">Sign Out</div>');
      // If a user wants to sign out
      $("#signOutPeriod").click(function (){
        firebase.auth().signOut().then(function() {
          alert("Sign out Successful");
          window.location.href="index.html";
        }).catch(function(error) {
          console.log("A fatal error occurred.");
        });
      });
    }
    else {
      console.log("No user found");
    }
  });
  grabDataAndRun();
  $("#reviewCardSelector").click(function(){
    if (cardCreatedArray.length > 0) {
      currentIndexVal = 1;
      $('*[data-index=' + currentIndexVal + ']').addClass("animated flip cardBorder");
      displayYourCard();
    }
    else {
      alert("No cards to review");
    }
  });
});
