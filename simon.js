$(document).ready(function() {
  // Boolean is simon on/off
  var isSimonOn = false;
  // Elements that turn on/off
  var htmlElements = ["#count", "#slider"];
  var colors = ["green", "red", "yellow", "blue"];
  var sounds = {greenSound: new Howl({urls: ["https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"], volume: 1}),
                redSound: new Howl({urls: ["https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"], volume: 1}),
                yellowSound: new Howl({urls: ["https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"], volume: 1}),
                blueSound: new Howl({urls: ["https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"], volume: 1}),
                winSound: new Howl({urls: ["https://res.cloudinary.com/santiago-g-mez/video/upload/v1468106293/Ta_Da-SoundBible.com-1884170640_mkltoe.mp3"], volume: 0.5}),
                looseSound: new Howl({urls: ["http://res.cloudinary.com/santiago-g-mez/video/upload/v1468106294/fail-trombone-02_pwswzz.mp3"]}),
                onSound: new Howl({urls: ["http://res.cloudinary.com/santiago-g-mez/video/upload/v1468106651/Magic_Wand_Noise-SoundBible.com-375928671_e4kksm.mp3"], volume: 0.3}),
                offSound: new Howl({urls: ["http://res.cloudinary.com/santiago-g-mez/video/upload/v1468106647/Crowd_Boo_1-SoundBible.com-183064743_n54ame.mp3"], volume: 0.3}),
               errorSound: new Howl({urls: ["http://res.cloudinary.com/santiago-g-mez/video/upload/v1468349333/Buzz-SoundBible.com-1790490578_oufb5l.wav"], sprite: {error: [0, 250]}})};
 
  // Random sequence
  var sequence = [];
  // Next to play 0 AI/ 1 User.
  var turn ;
  // Number of guess
  var playNumber;
  var strict;
  var userSequence = [];
  
  
  // Function generates a random sequence.
  function generateSequence(){
    sequence = [];
    while (sequence.length < 20) {
      sequence.push(colors[Math.floor(Math.random() * 4)]);
    }
  }
  
  // Function shows color illuminate and displays its sound.
  function showColor(color) {
    // Makes pushed div brighter.
    $("#" + color).css("filter", "brightness(200%)");
    sounds[color + "Sound"].play();
    setTimeout(function() {
      // Makes pushed div original bright.
      $("#" + color).css("filter", "brightness(100%)");
    }, 1000);
  }
  
  // Function shows random sequence until the current playNumber.
  function displaySequence() {
    var i = 0;
    function showSequence(){
      if (i <= playNumber && isSimonOn) {
      showColor(sequence[i]);
      setTimeout(showSequence, 1000);
      i++;
      }
      else {
        // Finished displaying, now user can play.
        turn = 1;
      }
    }
    showSequence();
}
  
  function updateCounter() {
    $("#count").text(playNumber < 9 ? "0" + (playNumber + 1): playNumber + 1);
  }
  
  function userPlay(element) {
    userSequence.push(element);
    for (var i = 0; i < userSequence.length; i++) {
      if (userSequence[i] !== sequence[i]) {
        if (strict) {
          turn = 0;
          sounds["looseSound"].play();
          setTimeout(function(){
            newGame();
          }, 4500);  
        }
        else {
          sounds["errorSound"].play("error");
          turn = 0;
          userSequence = [];
          setTimeout(function (){
            displaySequence();
          }, 2000);
        }
      }
    }
    if (userSequence.length === playNumber + 1) {
      if (playNumber < 19) {
        playNumber++;
        updateCounter();
        turn = 0;
        userSequence = [];
        setTimeout(function(){
          displaySequence();
        }, 2000);
      }
      else {
        sounds["winSound"].play();
        newGame();
      }
    }
  }
  
  function newGame() {
    userSequence = [];
    playNumber = 0;
    turn = 0;
    generateSequence();
    updateCounter();
    displaySequence();
    $("#green, #red, #yellow, #blue ").unbind(); // "What's happening is that your #green, #yellow, ... was already attached to the "click" event ! And you're attaching to the "click" event when you lose the game in strict mode. So when you click just one time on your tile, it triggers, in fact many clicks (for the computer) ! So the sequence is wrong  Got it ?"- @thomlom 
    $("#green, #red, #yellow, #blue ").on("click", function (){
      if (turn === 1) {
        showColor(this.id);
        userPlay(this.id);
      }
    }); 
  }

  // Function to turn Simon on/off
  $("#slider").on("click", function() {
    if ($(this).hasClass("on")) {
     for (var element = 0; element < htmlElements.length; element++) {
       console.log(htmlElements[element]);
       $(htmlElements[element]).removeClass("on");
       $(htmlElements[element]).addClass("off");
      
     }
      isSimonOn = false;
      $("#count").text("--");
       sounds["offSound"].play();
       $("#strict-indicator").removeClass("on");
       $("#strict-indicator").addClass("off");
    }
    else {
      for (element = 0; element < htmlElements.length; element++) {
       $(htmlElements[element]).removeClass("off");
       $(htmlElements[element]).addClass("on");
     }
      isSimonOn = true;
       sounds["onSound"].play();
    }  
  });
  
  // Function (des)activates strict mode.
  $("#strict").on("click", function() {
    if (isSimonOn) {
      if ($("#strict-indicator").hasClass("on")) {
        $("#strict-indicator").removeClass("on");
        $("#strict-indicator").addClass("off");
        strict = false;
      }
      else {
        $("#strict-indicator").removeClass("off");
        $("#strict-indicator").addClass("on");
        strict = true;
      }
    }
  });
  // Function starts new game.
  $("#start").on("click", function(){
    if (isSimonOn) {
      newGame();
    }
  });
})
