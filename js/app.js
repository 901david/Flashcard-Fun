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
  var listener = firebase.database().ref();
  var currentVariableName;
  var userGroupInput = "";
  var userDirectory;
  var firebaseSnap;
  var cardCreatedArray = [];
  var currentIndexVal = 1;
  function whatDataToUse () {
    for (let i = 0; i < cardCreatedArray.length;i++){
        $("#cardStorage").append("<div><p>Card " + (i + 1) + "</p><img data-index='" + (i + 1) + "' class='col-xs-3 col-sm-3 col-md-12 col-lg-12 img-responsive showCard' src='images/indexfront.jpg' alt='Index Card Place holder, click to view.'></div>");
    }
      $(".showCard").click(function() {
      currentIndexVal = $(this).attr("data-index");
      displayYourCard();
      });
  };
  function displayYourCard () {
    $("#displayCardsBox").empty().append('<h1>Group: ' + cardCreatedArray[currentIndexVal-1].group + '</h1><h1>Card ' + currentIndexVal + '</h1><div class="btn btn-success pull-left" id="revealFront">Reveal Front of Card</div><div class="btn btn-danger pull-right" id="revealBack">Reveal Back of Card</div><div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" id="displayCards"><img src="images/indexfront.jpg" alt"Front of Index Card" class="img-responsive pull-left imgBorder" id="cardFrontFlip"><img src="images/indexback.jpg" alt"Back of Index Card" class="img-responsive pull-right imgBorder"></div><div class="btn btn-primary" id="revealNext">Reveal the Next card</div><div class="btn btn-primary" id="revealPrev">Reveal the Previous card</div>');
    $("#revealFront").click(function(){
      if (cardCreatedArray[currentIndexVal-1].cardType === "basic") {
      $("#displayCards").prepend("<p>" + cardCreatedArray[currentIndexVal -1].front + "</p>");
      }
      else {
        $("#displayCards").prepend("<p>" + (cardCreatedArray[currentIndexVal -1].front).replace(cardCreatedArray[currentIndexVal -1].back, "...") + "</p>");
        };
      });
    $("#revealBack").click(function(){
      cardCreatedArray[currentIndexVal -1].back;
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
    $("#revealPrev").click(function () {
      if (currentIndexVal === 1){
        alert("You are already at the beginning.");
      }
      else{
        $("#displayCards").empty();
        currentIndexVal--;
        displayYourCard();
      }
    });
  };
  function BuildArrays (front, back, type, group) {
      this.front = front;
      this.back = back;
      this.type = type;
      this.group = group;
  };
  function grabDataAndRun (){
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
      console.log(userGroupInput);
      if ((dataArg === "cloze") && (!(questionArg.includes(answerArg)))) {
        alert("Your card was not formatted properly");
      }
      $("#frontCardData").val("");
      $("#backCardData").val("");
      function whatVariableToUse (frontArg, backArg, typeArg, catArg) {
        currentVariableName = { front: frontArg, back: backArg, cardType: dataArg, name: catArg };
          regGroup.push(currentVariableName);
          console.log(currentVariableName);
      };
      whatVariableToUse(questionArg, answerArg, dataArg, userGroupInput);

  });
  };
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
    console.log(cardCreatedArray);
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
    firesbaseGrabAndDistr();
  });
  grabDataAndRun();
  $("#reviewCardSelector").click(function(){
    currentIndexVal = 1;
    displayYourCard();
  });
});
