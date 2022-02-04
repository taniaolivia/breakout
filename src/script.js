let canvas;
let context;
let paddle1;
let bricks;
let rightPressed = false;
let leftPressed = false;
let ball1;
let bestPlayers = [];
var score = 0;
let playerName;
let rowcolors = ["#FF1C0A", "#FFFD0A", "#00A308", "#0008DB", "#EB0093"];


/*---------------------------*/
/*   Classe de la raquette   */
/*---------------------------*/
class Paddle
{
    width
    height
    paddleX
    paddleY
  
    constructor(width, height, paddleX, paddleY)
    {
        this.width = width;
        this.height = height;
        this.paddleX = paddleX;
        this.paddleY = paddleY;
    }
    
    /*-------------------------*/
    /* L'affichage de raquette */
    /*-------------------------*/
    drawPaddle()
    {
        context.beginPath();
        context.rect(this.paddleX, this.paddleY, this.width, this.height);
        context.fillStyle = "#363637";
        context.fill();
        
        context.strokeRect(this.paddleX, this.paddleY, this.width, this.height);
        context.strokeStyle = "#f282b3";
        context.lineWidth = 2;
        
        context.closePath();
    }

    /*-------------------------*/
    /* Déplacement de raquette */
    /*-------------------------*/
    movePaddle()
    {
        if(rightPressed) 
        {
            this.paddleX += 10;

            if (this.paddleX + 100 > canvas.width)
            {
                this.paddleX = canvas.width - 100;
            }
        }

        else if(leftPressed) 
        {
            this.paddleX -= 10;

            if (this.paddleX < 0)
            {
                this.paddleX = 0;
            }
        }
    }
    
    getPaddleX()
    {
        return this.paddleX;
    }
    
    getWidth()
    {
        return this.width;
    }
    
    getHeight()
    {
        return this.height;
    }

}


/*---------------------------*/
/*   Classe de la balle      */
/*---------------------------*/

class Ball
{
    x;
    y;
    rayon;
    dx;
    dy;
    HEIGHT;
    WIDTH;
    paddle2;
    
    constructor(x,y,rayon,paddle2)
    {
        this.x = x;
        this.y = y;
        this.rayon = rayon;
        this.dx = 2;
        this.dy = -2;
        this.HEIGHT = $("#canvas").height();
        this.WIDTH = $("#canvas").width();
        this.paddle2 = paddle2;
    }
    
    /*-------------------------*/
    /* L'affichage de la balle */
    /*-------------------------*/
    drawBall()
    {
        context.beginPath();
        context.arc(this.x, this.y, this.rayon, 0, Math.PI*2, true);
        context.fillStyle ='#363637';
        context.fill();
        context.closePath();
    }
    
    /*-------------------------*/
    /* Déplacement de la balle */
    /*-------------------------*/
    moveBall()
    {
        if (this.x + this.dx > this.WIDTH || this.x + this.dx < 0)
        {
                this.dx = -this.dx;
        }
        if (this.y + this.dy < 0)
        {
                this.dy = -this.dy;
        }
            
        else if (this.y + this.dy > this.HEIGHT-22) 
        {
            if (this.x > this.paddle2.getPaddleX() && this.x < this.paddle2.getPaddleX() + this.paddle2.getWidth())
            {
                this.dy = -this.dy;
            }
            else
            {
                delete this.x;
            }
        }
 
        this.x += this.dx;
        this.y += this.dy;
  
    }
    
    getX()
    {
        return this.x;
    }
    
    getY()
    {
        return this.y;
    }
    
    getDy()
    {
        return this.dy;
    }
    
    getWidth()
    {
        return this.WIDTH;
    }

    setDy(valeur)
    {
        this.dy = valeur;
    }

}


/*---------------------------*/
/*      Classe du joueur     */
/*---------------------------*/

class Player
{
    name
    score
  
    constructor(name, score)
    {
        this.name = name;
        this.score = score;
    }
    
    /*-------------------------*/
    /* L'affichage du joueur   */
    /*-------------------------*/
    showPlayer()
    {
        context.font = "16px Arial";
        context.fillStyle = "#363637";
        context.fillText("Player: " + getName(), 470, 30);
    }
    
    /*-------------------------*/
    /* L'affichage du score    */
    /*-------------------------*/
    showScore()
    {
        context.font = "16px Arial";
        context.fillStyle = "#363637";
        context.fillText("Score: " + score, 20, 30);
    }
}


/*---------------------------*/
/*      Classe du brique     */
/*---------------------------*/

class Brick
{
    bricks;
    NROWS;
    NCOLS;
    BRICKWIDTH;
    BRICKHEIGHT;
    PADDING;
    marginTop;
    
    constructor()
    {
        this.NROWS = 5;
        this.NCOLS = 5;
        this.BRICKWIDTH = (ball1.getWidth()/this.NCOLS) - 1;
        this.BRICKHEIGHT = 20;
        this.PADDING = 1;
        this.marginTop = 50;
    }
    
    initbricks() 
    {
        bricks = new Array(this.NROWS);
        for (let i=0; i < this.NROWS; i++) {
            bricks[i] = new Array(this.NCOLS);
            for (let j=0; j < this.NCOLS; j++) {
                bricks[i][j] = true;
            }
        }
    }
    
    drawbricks() {
        
        for (let i=0; i < this.NROWS; i++) 
        {
          context.fillStyle = "#4F44E8";
          for (let j=0; j < this.NCOLS; j++) 
          {
            if (bricks[i][j] == true) 
            {
              rect((j * (this.BRICKWIDTH + this.PADDING)) + this.PADDING, 
                   (i * (this.BRICKHEIGHT + this.PADDING)) + this.PADDING + this.marginTop,
                   this.BRICKWIDTH, this.BRICKHEIGHT);
            }
          }
        }
      }

    collision()
    {
        let rowheight = this.BRICKHEIGHT + this.PADDING;
        let colwidth = this.BRICKWIDTH + this.PADDING;
        let x = ball1.getX();
        let y = ball1.getY() - 60;
        let dy = ball1.getDy();
        let row = Math.floor(y/rowheight);
        let col = Math.floor(x/colwidth);
        // Si c'est le cas, faire rebondir la balle et marquer la brique comme démolie
        if (y < this.NROWS * rowheight && row >= 0 && col >= 0 && bricks[row][col] == 1)
        {
            ball1.setDy(-dy);
            bricks[row][col] = false;
            score+=10;
        }
    }
}

/*---------------------------*/
/*   Création des briques    */
/*---------------------------*/

function rect(x,y,w,h) 
{
    context.beginPath();
    context.rect(x,y,w,h);
    context.fill();
    context.closePath();
}


/*---------------------------------------------------------------------------*/
/*   Gérer la condition des flèches sur clavier pour déplacer la raquette    */
/*---------------------------------------------------------------------------*/

function keyDown(key) 
{
    if(key.keyCode == "39") 
    {
        rightPressed = true;
    }
    else if(key.keyCode == "37") 
    {
        leftPressed = true;
    }
}

function keyUp(key) 
{
    if(key.keyCode == "39") 
    {
        rightPressed = false;
    }
    else if(key.keyCode == "37") 
    {
        leftPressed = false;
    }
}


/*----------------------------------------*/
/* Récupération du nom de joueur entrée   */
/*----------------------------------------*/
function getName()
{
    playerName = $('#player').val();  
    return playerName;
}


/*------------------------------------*/
/* Mise à jour l'affichage des scores */
/*------------------------------------*/
function refreshScoreBoard()
{
    bestPlayers = [];  
}


/*----------------------------------*/
/* Affichage des 5 meilleurs scores */
/*----------------------------------*/
function best5Players(event)
{
    $("#button2").unbind().click(function()
    {
      refreshScoreBoard(); //mets le contenu de l'array bestPlayers vide
      $.get("http://localhost:3000/bestPlayers/5", function(data)
      {
          for(let i = 0; i < data.length; i++)
          {
                bestPlayers += data[i].nom + ' - ' + data[i].score + '<br>';
          }
          
          $("#score").html("<center>SCORE BOARD</center> <br><br>" + bestPlayers);         
      });

    });
    
}


/*----------------------------------*/
/* Ajout un nouveau score           */
/*----------------------------------*/
function newPlayer(event)
{
    $("#button1").unbind().click(function()
    {
      $.post("http://localhost:3000/newScore",
      {
        nom : player1.name,
        score : score
      },
      function(data){
        data;
      });
    });
}


/*----------------------------------*/
/* Affichage du jeu "Casse briques" */
/*----------------------------------*/

function showGame()
{
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    paddle1.drawPaddle();
    paddle1.movePaddle(); 
    ball1.drawBall();
    ball1.moveBall();
    brick1.drawbricks();
    brick1.collision();
    player1.showScore();
    player1.showPlayer();
}

$(document).ready(function() 
{
    /* Canvas */
    canvas = document.getElementById('canvas'); 
    context = canvas.getContext('2d'); 

    /*-------------------------*/
    /* Création de la raquette */
    /*-------------------------*/
    paddle1 = new Paddle(100, 20 , (canvas.width - 100)/2, canvas.height-22);
    
    /*-------------------------*/
    /* Création de la balle    */
    /*-------------------------*/
    ball1 = new Ball(canvas.width/2, canvas.height-20, 10, paddle1);

    /*-------------------------*/
    /* Création des briques    */
    /*-------------------------*/
    brick1 = new Brick();
    brick1.initbricks();

    /*-------------------------*/
    /* Création du joueur      */
    /*-------------------------*/
    player1 = new Player(getName, score);
    
    /*--------------------------------------*/
    /* Ajout des gestionnaires d'evenements */
    /*--------------------------------------*/
    window.addEventListener('keydown', keyDown, false); 
    window.addEventListener('keyup', keyUp, false);
    window.addEventListener('click',  newPlayer);
    window.addEventListener('click',  best5Players);

    
    setInterval(showGame, 10);
});