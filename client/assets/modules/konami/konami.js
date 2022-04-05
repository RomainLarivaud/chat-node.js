// Liste des touches à utiliser pour le Konami Code
var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    65: 'a',
    66: 'b'
  };
  
  // Séquence à utiliser pour lancer l'easter egg
  var konamiCode = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a'];
  
  // Position dans la séquence
  var konamiCodePosition = 0;
  
  // Ajout d'un Event Listener sur les touches
  $(document).keydown(function(e) 
  {
    // Obtient la valeur de la touche par rapport à la liste définit plus haut
    var key = allowedKeys[e.keyCode];

    // Récupère la valeur de la touche nécessaire du code Konami
    var requiredKey = konamiCode[konamiCodePosition];
  
    // Si la touche sur laquelle on a appuyé correspond a celle du code Konami
    if (key == requiredKey) 
    {
      // On avance de 1 dans la séquence
      konamiCodePosition++;
  
      // Si tout le code Konami est bon, alors on transmet l'information au serveur
      if (konamiCodePosition == konamiCode.length) 
      {
        socket.emit('konami');
        konamiCodePosition = 0;
      }
    } 
    else 
    {
      konamiCodePosition = 0;
    }
  });

socket.on('all_konami', activateKonami);

/**
 * Activation du code Konami.
 */
 function activateKonami() 
 {
  // On ajoute une image au background
  document.body.style.backgroundImage = "url('/modules/konami/src/background.gif')";

  // On récupère l'audio puis on le joue
  var audio = new Audio('/modules/konami/src/audio.mp3');
  audio.play();

  // Après 10 secondes, on stop l'audio, et on retire l'image de fond.
  setTimeout(function() 
  {
    audio.pause();
    document.body.style.backgroundImage = "none";
  }, 10000);
}   