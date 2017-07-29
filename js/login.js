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

$(document).ready(function() {
  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log(user);
    window.location.href="mainPage.html";

  } else {
    console.log("No user found");

  }
});
  $("#signInSubmit").click(function (event) {
    event.preventDefault();
    var email = $("#loginEmail").val();
    var password = $("#loginPassword").val();
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {

      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(error.code + " " + error.message);

    });
  });
  $("#canISignUp").click(function () {
      let signUpHtml = '<h1>Sign up</h1><div class="form-group"><label for="signUpEmail">Email address</label><input type="email" class="form-control" id="signUpEmail" aria-describedby="emailHelp" placeholder="Enter email"></div><div class="form-group"><label for="signUpPassword">Password</label><input type="password" class="form-control" id="signUpPassword" placeholder="Password"></div><div class="form-group"><label for="signUpPassword2">Verify Password</label><input type="password" class="form-control" id="signUpPassword2" placeholder="Enter Pasword Again"></div><div class="form-check"><label class="form-check-label"><input type="checkbox" class="form-check-input">I am not a Robot.</label></div><a href="../mainPage.html"><div type="submit" class="btn btn-primary" id="signUpSubmit">Sign Up</div></a>';
      $(".topText").addClass("hide");
      $("#logSpace").empty();
      $("#indexDisplayArea").empty().append(signUpHtml);
      $("#signUpSubmit").click(function (event) {
        event.preventDefault();
        let email = $("#signUpEmail").val();
        let password = $("#signUpPassword").val();
        let signPassTwo = $("#signUpPassword2").val();
        if (password === signPassTwo) {
          firebase.auth().createUserWithEmailAndPassword(email, password)
            .catch(function(error) {
            console.log()
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode == 'auth/weak-password') {
              alert('The password is too weak.');
            } else {
              alert(errorMessage);
              }
              console.log(error);
            });
        }
        else {
          alert("Your passwords did not match");
        }
      });
    });
});
