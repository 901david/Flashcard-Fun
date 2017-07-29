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
  function grabDataAndRun (){
    $(".clickHerePlease").click(function() {
      var regGroup = firebase.database().ref("/" + userDirectory + "/" + userGroupInput + "/");
      let questionArg = $("#frontCardData").val().trim();
      let answerArg = $("#backCardData").val().trim();
      let dataArg = $(this).attr("data-Choice");
      let cardNumArg = 0;
      if ($("#groupName").val().trim() === "") {
        userGroupInput = "standard";
      }
      else {
        userGroupInput = $("#groupName").val().trim();
      }
      console.log(userGroupInput);
      if ((dataArg === "cloze") && (!(questionArg.includes(answerArg)))) {
        alert("Your card was not formatted properly");
      }
      $("#frontCardData").val("");
      $("#backCardData").val("");
      // Gives us a continuing variable scheme
      function whatVariableToUse (frontArg, backArg, typeArg, numArg) {
        currentVariableName = { front: frontArg, back: backArg, cardType: dataArg, name: numArg };
          regGroup.push(currentVariableName);
          console.log(currentVariableName);
        $("#cardStorage").empty();
        // createSideBar();
      };
      whatVariableToUse(questionArg, answerArg, dataArg, cardNumArg);

  });
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
  grabDataAndRun();
});
