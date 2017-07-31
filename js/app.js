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
  var prevGroup = null;
  function whatDataToUse () {

    for (let i = 0; i < cardCreatedArray.length;i++){
        if (cardCreatedArray[currentIndexVal -1].group === prevGroup){
          $("#cardStorage").append("<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'><p>Card " + (i + 1) + "</p><img data-index='" + (i + 1) + "' class='col-xs-3 col-sm-3 col-md-8 col-lg-8 img-responsive showCard' src='images/indexfront.jpg' alt='Index Card Place holder, click to view.'></div>");
        }
        else {
          $("#cardStorage").append("<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'><p>Group: " + cardCreatedArray[currentIndexVal -1].group + "<p>Card " + (i + 1) + "</p><img data-index='" + (i + 1) + "' class='col-xs-3 col-sm-3 col-md-8 col-lg-8 img-responsive showCard' src='images/indexfront.jpg' alt='Index Card Place holder, click to view.'></div>");
          prevGroup = cardCreatedArray[currentIndexVal -1].group;
        }
    }
      $(".showCard").click(function() {
      $(".showCard").removeClass("animated flip cardBorder");
      currentIndexVal = $(this).attr("data-index");
      $(this).addClass("animated flip cardBorder");
      displayYourCard();
      });
  };
  function displayYourCard () {
    $("#displayCardsBox").empty().append('<div class="row"><span class="topDisplayText">Group: ' + cardCreatedArray[currentIndexVal -1].group + '</span><span class="topDisplayTextTwo">Card ' + currentIndexVal + '</span></div><div class="row"><div class="btn btn-success topDisplayButt" id="revealFront">Reveal Front of Card</div><div class="btn btn-danger topDisplayButtTwo" id="revealBack">Reveal Back of Card</div></div><div class="row"></div><div class="row"><div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" id="displayCards"><img src="images/indexfront.jpg" alt"Front of Index Card" class="img-responsive pull-left imgBorder" id="cardFrontFlip"><img src="images/indexback.jpg" alt"Back of Index Card" class="img-responsive imgBorderTwo pull-left" id="cardBackFlip"></div></div><div class="row"><div class="btn btn-primary" id="revealNext">Reveal the Next card</div><div class="btn btn-primary" id="revealPrev">Reveal the Previous card</div></div>');
    $("#revealFront").click(function(){
      setTimeout(()=>{
        if (cardCreatedArray[currentIndexVal-1].cardType === "basic") {
        $("#displayCards").prepend("<p>" + cardCreatedArray[currentIndexVal -1].front + "</p>");
        }
        else {
          $("#displayCards").prepend("<p>" + (cardCreatedArray[currentIndexVal -1].front).replace(cardCreatedArray[currentIndexVal -1].back, "...") + "</p>");
          };
      }, 1000);
      $("#cardFrontFlip").addClass("animated flip");
      });
    $("#revealBack").click(function(){
      
      setTimeout(()=>{
        if (cardCreatedArray[currentIndexVal-1].cardType === "basic") {
        $("#displayCards").prepend("<p>" + cardCreatedArray[currentIndexVal -1].back + "</p>");
        }
        else {
          $("#displayCards").prepend("<p>" + cardCreatedArray[currentIndexVal -1].front + "</p>");
        }
      }, 1000);
      $("#cardBackFlip").addClass("animated flip");
    });
    $("#revealNext").click(function(){
      $(".showCard").removeClass("animated flip cardBorder");
      if (currentIndexVal < cardCreatedArray.length){
        $("#displayCards").empty();
        currentIndexVal++;
        $('*[data-index=' + currentIndexVal + ']').addClass("animated flip cardBorder");
        displayYourCard();
      }
      else{
        alert("No more cards to show currently");
      }
    });
    $("#revealPrev").click(function () {
      $(".showCard").removeClass("animated flip cardBorder");
      if (currentIndexVal === 1){
        alert("You are already at the beginning.");
      }
      else{
        $("#displayCards").empty();
        currentIndexVal--;
        $('*[data-index=' + currentIndexVal + ']').addClass("animated flip cardBorder");
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
      if ((dataArg === "cloze") && (!(questionArg.includes(answerArg)))) {
        alert("Your card was not formatted properly");
      }
      $("#frontCardData").val("");
      $("#backCardData").val("");
      function whatVariableToUse (frontArg, backArg, typeArg, catArg) {
        currentVariableName = { front: frontArg, back: backArg, cardType: dataArg, name: catArg };
          regGroup.push(currentVariableName);
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
      $("#topStuff").append('<div class="btn btn-warning" id="signOutPeriod">Sign Out</div>');
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
