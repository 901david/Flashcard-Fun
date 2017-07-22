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
var loginActive = true;

$(document).ready(function() {
  $("#signInSubmit").click(function (event) {
    event.preventDefault();
    var logEmail = $("#loginEmail").val();
    var logPass = $("#loginPassword").val();
    console.log(logEmail + " " + logPass);
  });
  $("#canISignUp").click(function () {
      let signUpHtml = '<h1>Sign up</h1><div class="form-group"><label for="signUpEmail">Email address</label><input type="email" class="form-control" id="signUpEmail" aria-describedby="emailHelp" placeholder="Enter email"></div><div class="form-group"><label for="signUpPassword">Password</label><input type="password" class="form-control" id="signUpPassword" placeholder="Password"></div><div class="form-group"><label for="signUpPassword2">Verify Password</label><input type="password" class="form-control" id="signUpPassword2" placeholder="Enter Pasword Again"></div><div class="form-check"><label class="form-check-label"><input type="checkbox" class="form-check-input">I am not a Robot.</label></div><div type="submit" class="btn btn-primary" id="signUpSubmit">Submit</div>';
      $(".topText").addClass("hide");
      $("#indexDisplayArea").empty().append(signUpHtml);
      $("#signUpSubmit").click(function (event) {
        event.preventDefault();
        var signEmail = $("#signUpEmail").val();
        var signPass = $("#signUpPassword").val();
        var signPassTwo = $("#signUpPassword2").val();
        if (signPass === signPassTwo) {
          console.log(signEmail + " " + signPass + signPassTwo);
        }
        else {
          alert("Your passwords did not match");
        }
      });
    });
});
