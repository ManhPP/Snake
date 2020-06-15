var GameLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {

        this._super();
        var winSize = cc.winSize;

        //background
        bnSpriteSnakeBody = new cc.SpriteBatchNode(res.snake_body, 50);
        bnSpriteFood = new cc.SpriteBatchNode(res.snakefood_png, 50);
        this.addChild(bnSpriteFood);
        this.addChild(bnSpriteSnakeBody);
        spriteBackGround = new cc.Sprite(res.blank_png, cc.rect(0,0,winSize.width-2*cellWidth,winSize.height-6*cellWidth ));
        spriteBackGround.setAnchorPoint(0,0);
        spriteBackGround.setTag(Enum.background);
        backGroundWidth = spriteBackGround.getBoundingBox().width;
        backGroundHeight = spriteBackGround.getBoundingBox().height;

        spriteBackGround.x = (winSize.width - backGroundWidth)/2;
        spriteBackGround.y = (winSize.height - backGroundHeight)/6;

        this.addChild(spriteBackGround);
        backGroundPos = {x:spriteBackGround.x, y:spriteBackGround.y};

        //diem so
        scoreLabel = new cc.LabelTTF(setLabelString(score), "Arial", 32);
        scoreLabel.x = winSize.width / 2;
        scoreLabel.y = winSize.height - (winSize.height - spriteBackGround.y - backGroundHeight)/2;
        this.addChild(scoreLabel);

        //game over
        // var redColor = cc.color(0, 0, 0);
        // gameOverLabel = new cc.LabelTTF("    Game Over \nPress to restart!", "Arial", 38);
        // gameOverLabel.x = winSize.width / 2;
        // gameOverLabel.y = winSize.height / 2;
        // gameOverLabel.fillStyle = redColor
        // this.addChild(gameOverLabel);
        // gameOverLabel.visible = false;

        //khoi tao ran va moi
        this.createSnake();
        this.createFood();

        if ('keyboard' in cc.sys.capabilities) {
            self = this;
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: function (key, event) {
                    var target = event.getCurrentTarget();

                    if(isFinished)
                    {
                        cc.audioEngine.stopMusic();
                        isFinished = false;
                        // gameOverLabel.visible = false;

                        self.removeChild(gameOverLayer, true);
                        cc.director.resume();
                        target.createSnake();
                        target.createFood();
                        return;
                    }
                    if(key == "37" && direction !== "right") dir = "left";
                    else if(key == "38" && direction !== "down") dir = "up";
                    else if(key == "39" && direction !== "left") dir = "right";
                    else if(key == "40" && direction !== "up") dir = "down";

                    actionQueue.unshift(dir);
                }
            }, this);
        }
        // mouse
        if ('mouse' in cc.sys.capabilities) {
            self = this;
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseMove: function(event){
                    var target = event.getCurrentTarget();

                    if (event.getButton() === cc.EventMouse.BUTTON_LEFT) {
                        if(isFinished)
                        {
                            cc.audioEngine.stopMusic();
                            isFinished = false;
                            // gameOverLabel.visible = false;
                            self.removeChild(gameOverLayer, true);
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
            self = this;
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
                            // gameOverLabel.visible = false;
                            self.removeChild(gameOverLayer, true);

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
        // cc.log(speedLevel[level])
        this.schedule(this.gameLoop,0.05);

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
                dir = "right";
            } else if (direction !== "right"){
                dir = "left";
            }
        } else {
            // doc
            if (delta.y > 0 && direction !== "down") {
                dir = "up";
            } else if (direction !== "up") {
                dir = "down";
            }
        }
        actionQueue.unshift(dir);
    },

    //tao ran
    createSnake:function() {
        actionQueue = [];
        score = 0;
        scoreLabel.setString(setLabelString(score));
        direction = "right";

        //neu da ton tai ran roi thi xoa di va tao con moi
        if(( typeof snakeArray != 'undefined' && snakeArray instanceof Array ) && snakeArray.length > 0 )
        {
            for(var i = 0; i< snakeArray.length; i++)
            {
                this.removeChild(snakeArray[i],true);
            }
        }
        snakeArray = [];


        var spriteSnakeCell = new cc.Sprite(res.snakecell_png);
        var spriteSnakeHead = new cc.Sprite(res.snake_head);
        var spriteSnakeTail = new cc.Sprite(res.snake_tail);

        var scaleFactor = cellWidth/spriteSnakeCell.width;
        spriteSnakeCell.setScale(scaleFactor);
        scaleFactor = cellWidth/spriteSnakeHead.width;
        spriteSnakeHead.setScale(scaleFactor);
        scaleFactor = cellWidth/spriteSnakeTail.width;
        spriteSnakeTail.setScale(scaleFactor);

        // spriteSnakeCell.setAnchorPoint(0,0);
        // spriteSnakeHead.setAnchorPoint(0,0);
        // spriteSnakeTail.setAnchorPoint(0,0);
        spriteSnakeCell.setTag(Enum.snakecell);

        var yMov = (spriteBackGround.y+backGroundHeight)-1.5*cellWidth;

        var xMov = (2.5*cellWidth)+backGroundPos.x;
        spriteSnakeHead.x = xMov;
        spriteSnakeHead.y = yMov;

        xMov = (1.5*cellWidth)+backGroundPos.x;
        spriteSnakeCell.x = xMov;
        spriteSnakeCell.y = yMov;

        xMov = (0.5*cellWidth)+backGroundPos.x;
        spriteSnakeTail.x = xMov;
        spriteSnakeTail.y = yMov;

        this.addChild(spriteSnakeCell);
        this.addChild(spriteSnakeHead);
        this.addChild(spriteSnakeTail);
        snakeArray.push(spriteSnakeHead);
        snakeArray.push(spriteSnakeCell);
        snakeArray.push(spriteSnakeTail);

    },
    //tao moi thuc an
    createFood:function() {
        //neu ton tai moi thi loai bo
        if(this.getChildByTag(Enum.snakefood)!=null)
        {
            this.removeChildByTag(Enum.snakefood,true);
        }

        // var spriteSnakeFood = new cc.Sprite(res.snakefood_png);
        var spriteSnakeFood = new cc.Sprite(bnSpriteFood.texture);
        // spriteSnakeFood.setAnchorPoint(0,0);
        spriteSnakeFood.setTag(Enum.snakefood);
        var scaleFactor = cellWidth/spriteSnakeFood.width;
        spriteSnakeFood.setScale(scaleFactor);
        this.addChild(spriteSnakeFood);
        var rndValX = 0;
        var rndValY = 0;
        var maxWidth = backGroundWidth;
        var maxHeight = backGroundHeight;
        var multiple = cellWidth;

        //dat moi vao vi tri ngau nhien
        rndValX = generate(spriteBackGround.x ,maxWidth,multiple);
        rndValY = generate(spriteBackGround.y,maxHeight,multiple);

        while(checkFoodPos(rndValX, rndValY)){
            rndValX = generate(spriteBackGround.x ,maxWidth,multiple);
            rndValY = generate(spriteBackGround.y,maxHeight,multiple);
        }

        snakeFood = {
            x: rndValX ,
            y: rndValY
        };

        spriteSnakeFood.x = snakeFood.x;
        spriteSnakeFood.y = snakeFood.y;
    },
    gameLoop:function (dt) {
        //get the snake head cell 
        var SnakeHeadX = snakeArray[0].x;
        var SnakeHeadY = snakeArray[0].y;

        tmp = actionQueue.pop();
        if (tmp != undefined){
            direction = tmp;
        }
        switch(direction)
        {
            case "right":
                SnakeHeadX = (modeKey==0) ? (SnakeHeadX + cellWidth) : ((SnakeHeadX + cellWidth) - spriteBackGround.x)%backGroundWidth + spriteBackGround.x;
                snakeArray[0].setRotation(0);
                break;
            case "left":
                SnakeHeadX = (modeKey==0) ? (SnakeHeadX - cellWidth) : (backGroundWidth - (spriteBackGround.x - (SnakeHeadX - cellWidth)))%backGroundWidth + spriteBackGround.x;
                snakeArray[0].setRotation(180);
                break;
            case "up":
                SnakeHeadY = (modeKey==0) ? (SnakeHeadY + cellWidth) : ((SnakeHeadY + cellWidth) - spriteBackGround.y)%backGroundHeight + spriteBackGround.y;
                snakeArray[0].setRotation(270);
                break;
            case "down":
                SnakeHeadY = (modeKey==0) ? (SnakeHeadY - cellWidth) : (backGroundHeight - (spriteBackGround.y - (SnakeHeadY - cellWidth)))%backGroundHeight + spriteBackGround.y;
                snakeArray[0].setRotation(90);
                break;
            default:
                cc.log("direction not defind");
        }
        //kiem tra ran co dam vao tuong hoac dam vao chinh no
        if(finishedChecker(SnakeHeadX, SnakeHeadY, snakeArray))
        {
            if (isSound){
                cc.audioEngine.playMusic(res.die);
            }
            isFinished = true;
            // gameOverLabel.visible = true;
            gameOverLayer = new GameOver();
            this.addChild(gameOverLayer);
            cc.director.pause();
            return;
        }

        //kiem tra xem co an duoc moi
        if(SnakeHeadX === snakeFood.x && SnakeHeadY === snakeFood.y)
        {
            // var spriteSnaketail = new cc.Sprite(res.snakecell_png);
            var spriteSnakeBody = new cc.Sprite(bnSpriteSnakeBody.texture);
            // spriteSnakeBody.setAnchorPoint(0,0);
            spriteSnakeBody.setTag(Enum.snakecell);
            var scaleFactor = cellWidth/spriteSnakeBody.width;
            spriteSnakeBody.setScale(scaleFactor);
            this.addChild(spriteSnakeBody);
            if (isSound){
                cc.audioEngine.playMusic(res.eat);
            }

            spriteSnakeBody.x = snakeArray[0].x;
            spriteSnakeBody.y = snakeArray[0].y;
            snakeArray[0].x = SnakeHeadX;
            snakeArray[0].y = SnakeHeadY;
            snakeArray.unshift(snakeArray[0]);
            snakeArray[1] = spriteSnakeBody;

            scoreLabel.setString(setLabelString(score++));

            this.createFood();
        }
        else
        {
            // act = cc.moveBy(0.1, cc.p(cellWidth, cellWidth))
            var spriteSnakeTailCell = snakeArray.pop();
            var spriteSnakeCellLast = snakeArray.pop();
            spriteSnakeTailCell.x = spriteSnakeCellLast.x;
            spriteSnakeTailCell.y = spriteSnakeCellLast.y;

            spriteSnakeCellLast.x = snakeArray[0].x;
            spriteSnakeCellLast.y = snakeArray[0].y;

            snakeArray[0].x = SnakeHeadX;
            snakeArray[0].y = SnakeHeadY;
            snakeArray.unshift(snakeArray[0]);
            snakeArray[1] = spriteSnakeCellLast;
            snakeArray.push(spriteSnakeTailCell);
            // for(var i = 0; i < snakeArray.length; i++)
            // {
            //     snakeArray[i].runAction(act);
            // }
        }

    }
});

//Kiem tra ran co dam vao tuong khong
function finishedChecker(snakeHeadX, snakeHeadY, snakeArray)
{
    if (snakeHeadX < spriteBackGround.x ||
        snakeHeadX > backGroundWidth + cellWidth/2 ||
        snakeHeadY < spriteBackGround.y ||
        snakeHeadY > ((spriteBackGround.y + backGroundHeight) - cellWidth) +cellWidth/2){
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
    var res = Math.floor(Math.random() * ((max - min) / multiple)) * multiple + 0.5*multiple + min;

    return res;
}

function checkFoodPos(x, y) {
    for(var i = 0; i < snakeArray.length; i++)
    {
        if(snakeArray[i].x === x && snakeArray[i].y === y)
        {
            return true;
        }
    }
    return false;
}

function setLabelString(str)
{
    return "Score: " + parseInt(score).toString();
}
