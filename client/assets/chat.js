// Connexion au socket
var socket = io.connect(':8080');

// Défini les sons aléatoires du Wizz
// const audio = new Audio("/modules/wizz/sounds/souffle.mp3");
const audio2 = new Audio("/modules/wizz/sounds/wizz-sound.mp3");
const audio3 = new Audio("/modules/wizz/sounds/toctoc.mp3");
const wizzSounds = [audio2, audio3];

// Défini les variables pour le module répondre à
var userReplyTo, textReplyTo;

// Défini la variable pour le comportement du menu burger de la liste des participants et des jeux
var participantMenuShown = false;
var gameMenuShown = false;

// Défini la variable pour sélectionner l'élément de scroll
var messageContainer = document.querySelector("#chat-container>main");

// Demande un pseudo et envoie l'info au serveur
var name = prompt('Quel est votre pseudo ?');
socket.emit('user_enter', name);

// Gestion des événements diffusés par le serveur
socket.on('new_message', receiveMessage);
socket.on('wizz', receiveWizz);
socket.on('update', updateMessage);
socket.on('tagged', receiveTagged);
socket.on('count', updateMessage);
socket.on('update_user_list', updateUserList);

// Action quand on clique sur le bouton "Envoyer"
$('#send-message').click(sendMessage);

// Action quand on clique sur le bouton "Coeur"
$(document).on('click', '.like-button', likeMessage);
$(document).on('click', '.btn-reply-to', showUserReplyingTo);

// Action quand on clique sur la reponse
$(document).on('click', '.hide', displayBlague);

// Action quand on clique sur le bouton start aim game
$(document).on('click', '.start-aim-game', displayAimGame);

// Action quand on clique sur start game
$(document).on('click', '.start-game', startAimGame);

// Action quand on clique sur la première cible
$(document).on('click', '.first-cible', addCible);

// Action quand on clique sur une cible
$(document).on('click', '#cible', addCible);

// Action quand on clique sur fermer
$(document).on('click', '.fermer-aim-game', removeAimeGame);

// Action quand on appuye sur la touche [Entrée] dans le champ de message (= comme Envoyer)
$(document).on('keyup', '#message-input', function(evt)
{
	if (evt.keyCode == 13) // 13 = touche Entrée
		sendMessage();
});

// Action quand on clique sur le bouton "Wizz"
$('#wizz').click(sendWizz);

/**
 * Envoi d'un message au serveur
 */
function sendMessage()
{
	// Récupère le message, puis vide le champ texte
	var input = $('#message-input');
	var message = input.val();
	input.val('');

	//Vide le champ de texte après avoir ajouté un emoji
	//emojisPicker[0].emojioneArea.setText('');

	// On n'envoie pas un message vide
	if (message == '')
		return;
	
	// Envoi le message au serveur pour broadcast
	socket.emit('message', message, textReplyTo);

	// Appelle dans le module replyTo la fonction pour vider les champs
	emptyReplyTo();

	// Réinitialise les valeurs locales du message auquel on répond
	textReplyTo = null;
	userReplyTo = null;
	$("#replyToText").hide();
}


/**
 * Affichage d'un message reçu par le serveur
 */
function receiveMessage(data)
{
	var btnModifyAndDelete ='';
	var btnReplyTo = '<input type="button" class="btn-reply-to"></input>';
	// permet que seule l'envoyer puisse modifier et supprimer son message
	if(data.isMe){
         btnModifyAndDelete =  '<button class="btn-edit-delete" id="'+data.messageId+'"  onclick="showPopUp('+data.messageId+')">'
        + '<i class="fas fa-ellipsis-v"></i>'
    + '</button>';
		btnReplyTo = '';
    } 
    
	// Défini et regarde si on répond à un message ou non
	var answeredMessage;

	if(data.textReplyTo != null)
		answeredMessage = '<div class="replied-text">↱ ' + data.textReplyTo + '</div>';
	else
		answeredMessage = '';

	var likeButton = '<div class="like-container"><span id="like-count' + data.messageId + '" class="like-count"></span><div class="like-button"><svg aria-hidden="true" focusable="false" id="like-icon" data-prefix="fas" data-icon="heart" class="svg-inline--fa fa-heart fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path></svg></div></div>';
	if(data.name == "Poll" || data.name == "Daffy!!" || data.name == "Meteo" || data.name ==  "BlagueBot" || data.name ==  "Youtube"){
		likeButton = '';
	}
	
	//data.message = replaceEmoji(data.message);
	$('#chat-container #messages').append(
		'<div class="message'+(isTagged ? ' tagged' : '')  + (data.isMe ? ' is-me' : '') + '" data-id="'  + data.messageId + '">'
				// Affichage de l'avatar
				+ '<img class="avatar" src="./medias/icon/sbcf-default-avatar.png">'
				+ '<div class="message-container">'
				+ answeredMessage
				+ '<span class="user">' + data.name  + ' :</span> ' 
				+ '<span class="message-text">' + data.message  + '</span>'     
				// Ajout du conteneur de like avec les unique ID
			+ likeButton
			// Ajout du conteneur qui apparait au hover permettant de répondre au message
			+  btnReplyTo
			+ btnModifyAndDelete
			+ '</div>'
	    + '</div>'

	)
	
	.scrollTop(function(){ return this.scrollHeight });  // scrolle en bas du conteneur
	messageContainer.scrollTo(0,messageContainer.scrollHeight);

	isTagged = false;
}

/**
 * Attribue a lié à chaque client, permet de savoir s'il est tag ou non
 */
var isTagged = false;

function receiveTagged(tagged){
	isTagged = tagged;
}
/**
 * Envoi d'un wizz au serveur
 */
function sendWizz()
{	
	// Envoi le wizz au serveur pour broadcast
    socket.emit('wizz_message');
};

/**
 * Application du wizz sur la fenêtre du chat
 */
function receiveWizz()
{
	// Ajout de la classe wizz contenant l'animation de tremblement
	$('#chat').addClass('wizz');

	// Joue un son aléatoire parmi le tableau wizzSounds
	var soundIndex = Math.floor(Math.random() * wizzSounds.length);
	wizzSounds[soundIndex].play();

	//Désactive le bouton pour éviter le spam
	$('#send-wizz').prop('disabled', true);
	setTimeout(function()
	{
		// Enlève la classe wizz afin de pouvoir la re-appliquer lors du prochain wizz
		$('#chat').removeClass('wizz')
		// Activation du bouton
		$('#send-wizz').prop('disabled', false);
	}, 500)
}

function likeMessage()
{
	// Changement de couleur du btn like
	$(this).toggleClass('like');
	
	// Récupération de l'id unique d'un message
	let messageId = $(this).closest(".message").data("id");
	
	// Vérifie si l'élément à la class "like" ou non
	if ($(this).hasClass('like'))
	{
		socket.emit('like', messageId);
	}
	else 
	{
		socket.emit('unlike', messageId);
	}
};

/**
 * Permet d'afficher et de mettre à jour le nombre de like'
 */
function updateMessage(data) 
{
	// Affiche le nombre de like d'un message en fonction de l'id
	$('#like-count' + data.messageId).text(data.nbLike);

	// Si le compteur est à 0, on remplace par une chaine de caractere vide
	if ($('#like-count' + data.messageId).text() == "0")
	{
		$('#like-count' + data.messageId).text('');
	}
}

/**
 * Permet d'afficher la réponse de la blague
 */
function displayBlague() 
{
	// Toggle la class permettant d'afficher la reponse
	$(this).toggleClass('display');
}

// Initialisation des variables
let compteur = 0;
let temps;
const timer = $(".timer");
/**
 * Permet d'afficher le jeu d'aim
 */
 function displayAimGame() 
 {
	$('.time-code').remove();

	// le timer ira de 15 a 0
	temps = 15;

	$('.start-game').removeClass('remove-start');

	$(".aim-game").toggleClass('display-aim-game');

	timer.append(
		'<div class="time-code">' + temps + '<div>'
	)
 }

 /**
 * Fait apparaitre le timer du jeu
*/	
function startTimer() 
{
	// Gestion du timer
	let interval = setInterval(() => {
		if(temps > -1) {
			$('.time-code').text(temps);
			temps--;
		} else {
			clearInterval(interval);
		}
	}, 1000);
}

  /**
 * Fait apparaitre le compteur du jeu
*/	
function startCompteur() 
{
	$('.compteur').append(
	'<div class="count">' + compteur + '<div>'
	)
}

 /**
 * Permet d'afficher la premiere cible
 */
 function startAimGame() 
 {
	$('.start-game').addClass('remove-start');

	$('.cibles-container').append(
		 '<div class="first-cible"><div>'
	)


	startCompteur();	
	startTimer();

	// A la fin du temps imparti, le jeu s'arrete
	setTimeout(function() {
		
		/**
 			* Termine le jeu et remet à 0 les compteurs
		*/

		$('.aim-game').append(
			'<div class="modal-end"> Votre score est de ' + compteur + 
			'<button class="fermer-aim-game"> Fermer </button>'
			+ '<div>'
		)
		
		// Réinitialisation des parametres
		$('#cible').remove();
		$('.count').remove();
		$('.time-code').remove();
	
		// Envoi le score au serveur pour broadcast
		socket.emit('aim-score', compteur);
	}, 17000);
}

/**
 * Fait pop des cibles random
*/	
function addCible() 
{
	// A chaque cible cliqué, on ajoute 1 au compteur
	compteur+=1;
	$('.count').text(compteur);
	var cibleSize = $('#cible').height();

	// On calcule la taille de la fenetre de jeu - la cible
	var aimWidth = $('.cibles-container').width()  - (cibleSize);
 	var aimHeight = $('.cibles-container').height() - (cibleSize);

	// Quand une cible est cliqué on la retire
	$(this).remove();

	// Calcule de la position de la prochaine cible
    let currentWidth = (Math.floor(Math.random() * aimWidth));
    let currentHeight = (Math.floor(Math.random() * aimHeight));

	// Création de la nouvelle cible
	$('.cibles-container').append(
		'<div id="cible"><div>'
	)
	
	// Positionnement de la cible selon la position definie au prealable
	document.getElementById('cible').style.top = currentHeight + "px";
	document.getElementById('cible').style.left = currentWidth + "px";
}

/**
 * Quittte la fenetre de jeu
*/
function removeAimeGame() {
	$(".aim-game").toggleClass('display-aim-game');

	$('.modal-end').remove();

	compteur = 0;
}

// Affiche au client local l'utilisateur auquel il répond, et défini les variables qui seront envoyées au serveur
function showUserReplyingTo()
{
	// Récupération de l'utilisateur auquel on répond
	userReplyTo = $(this).closest('.message').find('.message-container .user').text();

	// Récupération du message auquel on répond
	textReplyTo = $(this).closest('.message').find('.message-container').text();

	// On retire l'utilisateur du texte afin de garder seulement le message
	messageReplyTo = textReplyTo.replace(userReplyTo + ' ', '');

	$("#replyToText").show();

	// Appel de la fonction montrant au client à qui il va répondre
	displayAnsweredMessage(userReplyTo);
}

// Toggle le mode jour/nuit
$('#btn-light-dark').click(function()
{
	$('body').toggleClass("dark");
})

// Affiche en mobile le menu burger "participants"
$('#btn-participants').click(function()
{
	$('#liste-participants-container').animate({left: '30vw'}, "fast", function(){
		participantMenuShown = true;
	});
})

// Affiche en mobile le menu burger "jeux"
$('#btn-game').click(function()
{
	$('#jeux-container').animate({left: '10vw'}, "fast", function(){
		gameMenuShown = true;
	});
})

// Met à jour la liste des utilisateurs connectés
function updateUserList(userList)
{
	$('#liste-participants-container>main').empty();
	userList.userList.forEach(element => {
		$('#liste-participants-container>main').append(
			'<div class="participant">'
			+ '<img src="./medias/icon/sbcf-default-avatar.png">'
			+ '<p>' + element + '</p></div>')
	});
	$('.nb-participants').text(userList.userList.length);
}

// Affiche la barre d'outils au clic
$('#btn-toolbar').on('click',  displayToolbar);

function displayToolbar()
{
    $('#toolbar').toggle();
}

// Comportement si le même utilisateur parle plusieurs fois de suite
$('.message').each(sameUserMessage);
var previousMessage;

function sameUserMessage()
{
    if (previousMessage && previousMessage == $(this).data('id-user'))
    {
        $(this).css('margin-top','5px');
        $(this).children('.message-container').children('.user').hide();
        if ($(this).prev().attr('class') != 'message isMe')
            $(this).prev().css('margin-left','40px').children('.avatar').hide();
    }

    previousMessage = $(this).data('id-user');
}

// Ferme les menus burger quand on clic en dehors
$(document).on("click", function(e)
{
	if($(e.target).closest("#liste-participants-container").length == 0 && participantMenuShown == true)
	{
		$('#liste-participants-container').animate({left: '100vw'}, "fast");
		participantMenuShown = false;
	} else if($(e.target).closest("#jeux-container").length == 0 && gameMenuShown == true)
	{
			$('#jeux-container').animate({left: '100vw'}, "fast");
			gameMenuShown = false;
	};
  });

// Gère les différents boutons de la barre d'outils
$("#btn-meteo").click(function()
{
	$('#message-input').val("meteo:ville")
})

$("#btn-poll").click(function()
{
	$('#message-input').val("?poll:question")
})

$("#btn-youtube").click(function()
{
	$('#message-input').val("yt:recherche")
})

$("#btn-blague").click(function()
{
	$('#message-input').val(":blague");
	sendMessage();
})

$("#btn-daffy").click(function()
{
	$('#message-input').val("daffy");
	sendMessage();
})

$("#play-game-aim").click(function()
{
	displayAimGame();
})

$("#play-game-draw").click(function()
{
	$('#message-input').val("/draw start");
	sendMessage();
})