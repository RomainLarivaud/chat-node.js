// Ecouteur evenment dans le DOM sur tout selecteur qui correspond a '.yt-choice'
$(document).on('click', '.yt-choice', onClickYoutubeLoad);
$(document).on('click', 'body>h1', bonusRound);

/**
 * Envoi d'un message special au serveur pour creer une video Youtube
 */
function onClickYoutubeLoad()
{
    let youtubeId = $(this).data('id');
    console.log(youtubeId);

    socket.emit('ytChoice', youtubeId);
}

/**
 * Bonus pour ceux qui vont penser a clicker sur le titre
 */
 function bonusRound()
 {
	 var KICKASSVERSION='2.0';
	 var s = document.createElement('script');
	 s.type='text/javascript';
	 document.body.appendChild(s);
	 s.src='https://hi.kickassapp.com/kickass.js';
	 void(0);
 }