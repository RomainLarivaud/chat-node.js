// Crée le canvas et l'ajoute au body
var canvas = document.createElement('canvas');
canvas.id = 'scribblioCanvas';
$('#scribblio').append(canvas);

document.body.style.margin = 0;
canvas.style.width = '100%';
canvas.style.height = '100%';

// Contexte du canvas + application de la bonne taille
var ctx = canvas.getContext('2d');
resize();

window.addEventListener('resize', resize);

/**
 * Méthode appelée lorsque la fenêtre est redimensionnée
 */
function resize()
{
    ctx.canvas.width = $(canvas)[0].offsetWidth;
    ctx.canvas.height = $(canvas)[0].offsetHeight;
}

// Initialisation des variables
var userParams = {x:0, y:0};

// Events liés au canvas
$('#scribblioContainer').on('mousemove', mouseMove);

// Désactivation de l'action du clic droit sur le canvas
$('#scribblioContainer').on('contextmenu', function(e) {
	return false;
});

// Gestion des événements diffusés par le serveur
socket.on('scribblio_move', onScribblioMove);
socket.on('scribblio_refresh_users', refreshUsers);
socket.on('scribblio_hide_word', hideWord);
socket.on('scribblio_start_draw', startDraw);
socket.on('scribblio_start_find', startFind);
socket.on('scribblio_end_game', endGame);

/**
 * Méthode appelée lorsque la souris bouge
 */
let posX;
let posY;
let oldPosX;
let oldPosY;
function mouseMove(e)
{
	if($('#scribblioContainer').hasClass('active'))
	{
		var rightClickPressed = false;
		var leftClickPressed = false;
	
		// Si clic gauche détecté
		if (e.buttons == 1)
		{
			leftClickPressed = true;
			rightClickPressed = false;
		}
		// Si clic droit détecté
		else if (e.buttons == 2)
		{
			leftClickPressed = false;
			rightClickPressed = true;
		}
	
		// Informations de l'utilisateur
		oldPosX = posX;
		oldPosY = posY;
		posX = e.offsetX / $(window).width();
		posY = e.offsetY / $(window).height();
		userParams = {
			oldPosX: oldPosX,
			posX: posX,
			oldPosY: oldPosY,
			posY: posY,
			rightClickPressed: rightClickPressed,
			leftClickPressed: leftClickPressed,
			brushSize: $('#brushSize').val()
		};

		onEnterFrameScribblio();
	}
}

/**
 * Méthode appelée lorque la souris bouge pour envoyer sa position
 */
function onEnterFrameScribblio()
{
	// envoi un événement au serveur en transmettant la position de la souris
	socket.emit('mouseInteraction', userParams);
}

/**
 * Méthode appelée lorsque le serveur met à jour la position de la souris
 */
function onScribblioMove(data)
{
	for (var i in data.othersUserParams)
	{
		var mp = data.othersUserParams[i];
		// Si un des deux clics est détecté
		if(mp.userParams.rightClickPressed == true || mp.userParams.leftClickPressed == true)
		{
			draw(mp);
		}
	}
}

/**
 * Méthode appelée lorsqu'un utilisateur dessine ou efface
 */
function draw(mp)
{
	var color;
	if(mp.userParams.leftClickPressed == true)
	{
		// Couleur de l'utilisateur
		color = mp.color;
	}
	else if(mp.userParams.rightClickPressed == true)
	{
		// Gomme le dessin
		color = '#ffffff';
	}

	// Initialisation du trait
	ctx.beginPath();

	// Style du trait
	ctx.lineWidth = mp.userParams.brushSize;
	ctx.lineCap = 'round';
	ctx.strokeStyle = color;

	// Coordonnées du trait
	ctx.moveTo(mp.userParams.oldPosX * $(window).width(), mp.userParams.oldPosY * $(window).height());
	ctx.lineTo(mp.userParams.posX * $(window).width(), mp.userParams.posY * $(window).height());

	// Application du trait
	ctx.stroke();
}

/**
 * Méthode appelée lorsque le serveur met à jour la liste des utilisateurs
 */
function refreshUsers(data)
{
	$('.playerList').empty();

	for (var i in data.users)
	{
		var user = data.users[i];
		$('.playerList').append('<p style="color: '+user.color+'">'+user.name+'</p>');
	}
}

/**
 * Méthode appelée lorsqu'un mot est défini
 */
function hideWord(data)
{
	let oldhtml = $('div.message:contains("/draw word ' + data.wordToFind + '")').html();
	let regex = new RegExp(data.wordToFind,"g");
	let newhtml = oldhtml.replace(regex, "********");
	$('div.message:contains("/draw word ' + data.wordToFind + '")').html(newhtml);
}

/**
 * Méthode appelée lorsque la partie commence et que l'utilisateur doit dessiner
 */
function startDraw(data)
{
	$('#scribblioContainer').addClass('visible');
	$('#scribblioContainer, .scribblioControls, .scribblioInfos').addClass('active');
	$('#wordToFind span').html(data.wordToFind);

	setTimeout(() => {
		resize();
	}, 500);
}

/**
 * Méthode appelée lorsque la partie commence et que l'utilisateur doit deviner le mot
 */
function startFind()
{
	$('#scribblioContainer').addClass('visible');

	setTimeout(() => {
		resize();
	}, 500);
}

/**
 * Méthode appelée lorsque la partie est terminée
 */
function endGame()
{
	$('#scribblioContainer').removeClass('visible');
	$('#scribblioContainer, .scribblioControls, .scribblioInfos').removeClass('active');

	setTimeout(() => {
		resize();
	}, 500);
}