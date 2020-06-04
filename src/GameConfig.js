var Enum = {snakecell:0, snakefood:1 , background:2};
var snakeLength = 1; //Length of the snake
var scoreLabel = null;
var gameOverLabel = null;
var isFinished = false;
var snakeArray = null;
var snakeFood = null;
var backGroundPos;
var spriteBackGround = null;
var backGroundWidth = 0;;
var backGroundHeight = 0;
var score = 0;
var cellWidth = 30;
var speedLevel = {1: 10, 2: 20, 3: 30};
var level = 1;
var isSound = true;