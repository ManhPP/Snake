

var GameLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {

        this._super();
        var winSize = cc.winSize;

        //background
        spriteBackGround = new cc.Sprite(res.blank_png, cc.rect(0,0,winSize.width-2*cellWidth,winSize.height-4*cellWidth ));
        spriteBackGround.setAnchorPoint(0,0);
        spriteBackGround.setTag(Enum.background);
        BackGroundWidth = spriteBackGround.getBoundingBox().width;
        BackGroundHeight = spriteBackGround.getBoundingBox().height;

        spriteBackGround.x = (winSize.width - BackGroundWidth)/2;
        spriteBackGround.y = (winSize.height - BackGroundHeight)/2;

        this.addChild(spriteBackGround);
        BackGroundPos = {x:spriteBackGround.x, y:spriteBackGround.y};

        //diem so
        ScoreLabel = new cc.LabelTTF(setLabelString(score), "Arial", 38);
        ScoreLabel.x = winSize.width / 2;
        ScoreLabel.y = winSize.height - cellWidth;
        this.addChild(ScoreLabel);

        //game over
        var redColor = cc.color(0, 0, 0);
        GameOverLabel = new cc.LabelTTF("    Game Over \nPress to restart!", "Arial", 38);
        GameOverLabel.x = winSize.width / 2;
        GameOverLabel.y = winSize.height / 2;
        GameOverLabel.fillStyle = redColor
        this.addChild(GameOverLabel);
        GameOverLabel.visible = false;

        //khoi tao ran va moi
        this.createSnake();
        this.createFood();

        if ('keyboard' in cc.sys.capabilities) {
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: function (key, event) {
                    var target = event.getCurrentTarget();

                    if(isFinished)
                    {
                        cc.audioEngine.stopMusic();
                        isFinished = false;
                        GameOverLabel.visible = false;
                        cc.director.resume();
                        target.createSnake();
                        target.createFood();
                        return;
                    }
                    if(key == "37" && direction !== "right") direction = "left";
                    else if(key == "38" && direction !== "down") direction = "up";
                    else if(key == "39" && direction !== "left") direction = "right";
                    else if(key == "40" && direction !== "up") direction = "down";
                }
            }, this);
        }
        // mouse
        if ('mouse' in cc.sys.capabilities) {
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseMove: function(event){
                    var target = event.getCurrentTarget();

                    if (event.getButton() === cc.EventMouse.BUTTON_LEFT) {
                        if(isFinished)
                        {
                            cc.audioEngine.stopMusic();
                            isFinished = false;
                            GameOverLabel.visible = false;
                            cc.director.resume();
                            target.createSnake();
                            target.createFood();
                        }
                        event.getCurrentTarget().processEvent(event);
                    }
                }
            }, this);
        }

        // touch
        if ('touches' in cc.sys.capabilities) {
            cc.eventManager.addListener({
                prevTouchId: -1,
                event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                onTouchesMoved:function (touches, event) {
                    var target = event.getCurrentTarget();

                    var touch = touches[0];

                    if (this.prevTouchId !== touch.getID()) {
                        this.prevTouchId = touch.getID();
                    } else {
                        if(isFinished)
                        {
                            cc.audioEngine.stopMusic();
                            isFinished = false;
                            GameOverLabel.visible = false;
                            cc.director.resume();
                            target.createSnake();
                            target.createFood();
                        }
                        event.getCurrentTarget().processEvent(touches[0]);
                    }
                }
            }, this);
        }
        
        //This is the main game loop
        this.schedule(this.gameLoop,1/speed);

        return true;
    },

    processEvent: function(event) {
        var delta = event.getDelta();
        var minDelta = 10;

        if (Math.abs(delta.x) < minDelta && Math.abs(delta.y) < minDelta) {
            return;
        }

        if (Math.abs(delta.x) > Math.abs(delta.y)) {
            // ngang
            if (delta.x > 0 && direction !== "left") {
                direction = "right";
            } else if (direction !== "right"){
                direction = "left";
            }
        } else {
            // doc
            if (delta.y > 0 && direction !== "down") {
                direction = "up";
            } else if (direction !== "up") {
                direction = "down";
            }
        }
    },

    //tao ran
    createSnake:function() {
        score = 0;
        ScoreLabel.setString(setLabelString(score));
        direction = "right";

        //neu da ton tai ran roi thi xoa di va tao con moi
        if(( typeof SnakeArray != 'undefined' && SnakeArray instanceof Array ) && SnakeArray.length > 0 )
        {
            for(var i = 0; i< SnakeArray.length; i++)
            {
                this.removeChild(SnakeArray[i],true);
            }
        }
        SnakeArray = [];

        for(var i = snakeLength-1; i>=0; i--)
        {
            var spriteSnakeCell = new cc.Sprite(res.snakecell_png);
            spriteSnakeCell.setAnchorPoint(0,0);
            spriteSnakeCell.setTag(Enum.snakecell);

            var xMov = (i*cellWidth)+BackGroundPos.x;
            var yMov = (spriteBackGround.y+BackGroundHeight)-cellWidth;
            spriteSnakeCell.x = xMov;
            spriteSnakeCell.y = yMov;

            this.addChild(spriteSnakeCell);
            SnakeArray.push(spriteSnakeCell);
        }
    },
    //tao moi
    createFood:function() {
        //neu ton tai moi thi loai bo
        if(this.getChildByTag(Enum.snakefood)!=null)
        {
            this.removeChildByTag(Enum.snakefood,true);
        }

        var spriteSnakeFood = new cc.Sprite(res.snakefood_png);
        spriteSnakeFood.setAnchorPoint(0,0);
        spriteSnakeFood.setTag(Enum.snakefood);
        this.addChild(spriteSnakeFood);
        var rndValX = 0;
        var rndValY = 0;
        var maxWidth = BackGroundWidth;
        var maxHeight = BackGroundHeight;
        var multiple = cellWidth;

        //dat moi vao vi tri ngau nhien
        rndValX = generate(spriteBackGround.x ,maxWidth,multiple);
        rndValY = generate(spriteBackGround.y,maxHeight,multiple);
        var irndX = rndValX+BackGroundPos.x;
        var irndY = rndValY+BackGroundPos.y;
        SnakeFood = {
            x: irndX ,
            y: irndY
        };

        spriteSnakeFood.x = SnakeFood.x;
        spriteSnakeFood.y = SnakeFood.y;
    },
    gameLoop:function (dt) {
        //get the snake head cell 
        var SnakeHeadX = SnakeArray[0].x;
        var SnakeHeadY = SnakeArray[0].y;
        switch(direction)
        {
            case "right":
                SnakeHeadX+=cellWidth;
                break;
            case "left":
                SnakeHeadX-=cellWidth;
                break;
            case "up":
                SnakeHeadY+=cellWidth;
                break;
            case "down":
                SnakeHeadY-=cellWidth;
                break;
            default:
                cc.log("direction not defind");
        }
        //kiem tra ran co dam vao tuong hoac dam vao chinh no
        if(finishedChecker(SnakeHeadX, SnakeHeadY, SnakeArray))
        {
            cc.audioEngine.playMusic(res.die);
            isFinished = true;
            GameOverLabel.visible = true;
            cc.director.pause();
            return;
        }
        //kiem tra xem co an duoc moi
        if(SnakeHeadX === SnakeFood.x && SnakeHeadY === SnakeFood.y)
        {
            var spriteSnaketail = new cc.Sprite(res.snakecell_png);
            spriteSnaketail.setAnchorPoint(0,0);
            spriteSnaketail.setTag(Enum.snakecell);
            this.addChild(spriteSnaketail);
            cc.audioEngine.playMusic(res.eat);

            spriteSnaketail.x = SnakeHeadX;
            spriteSnaketail.y = SnakeHeadY;
            SnakeArray.unshift(spriteSnaketail);

            ScoreLabel.setString(setLabelString(score++));

            this.createFood();
        }
        else
        {
            var spriteSnakeCellLast = SnakeArray.pop();
            spriteSnakeCellLast.x = SnakeHeadX;
            spriteSnakeCellLast.y = SnakeHeadY;
            SnakeArray.unshift(spriteSnakeCellLast);
        }

    }
});

//Kiem tra ran co dam vao tuong khong
function finishedChecker(snakeHeadX, snakeHeadY, snakeArray)
{
    if(snakeHeadX < spriteBackGround.x ||
        snakeHeadX > BackGroundWidth ||
        snakeHeadY < spriteBackGround.y ||
        snakeHeadY > ((spriteBackGround.y+BackGroundHeight)-cellWidth))
    {
        return true;
    }
    for(var i = 0; i < snakeArray.length; i++)
    {
        if(snakeArray[i].x === snakeHeadX && snakeArray[i].y === snakeHeadY)
        {
            return true;
        }
    }
    return false;
}

function generate(min, max, multiple)
{
    var res = Math.floor(Math.random() * ((max - min) / multiple)) * multiple + min;
    return res;
}

function setLabelString(str)
{
    return parseInt(score).toString();
}