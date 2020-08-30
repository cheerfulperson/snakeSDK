window.onload = () => {

    let $ = (id) => {
        return document.getElementById(id);

    };

    let context = $('canvas').getContext('2d');

    context.canvas.height = window.innerHeight;
    context.canvas.width = window.innerWidth;

    let height = window.cont.arc( -this.size / 3, this.size / 3, this.size / 4, 0, Math.PI * number_for_draw_ayes, true);
    cont.arc(this.size / 3, this.size / 3, this.size / 4, 0, Math.PI * number_for_draw_ayes, true);
    cinnerHeight;
    let width = window.innerWidth;

    setInterval(function () {
        worier.getMove();
        worier.draw();
        console.log("lockalX:" + worier.lockalX,"x:" + map.x)
    console.log(worier.lockalY,map.y)

    }, 1000 / 60);


    //<<<<<<<<<<<<<<<<<<<<|mouse position on mousemove|>>>>>>>>>>>>>>>>>>>>>//
    let mousePosOnMouseMove = {
        x: width / 2,
        y: height / 2
    };

    function getMousePosOnMove(context, e) {
        let rect = context.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    addEventListener('mousemove', function (e) {
        mousePosOnMouseMove = getMousePosOnMove(context, e);
    }, false);
    //<<<<<<<<<<<<<<<<<<<<|mouse position on mousemove|>>>>>>>>>>>>>>>>>>>>>//


    //<<<<<<<<<<<<<<<<<<<<|mouse position on click|>>>>>>>>>>>>>>>>>>>>>//
    let mousePosOnMouseClick = {
        x: width / 2,
        y: height / 2
    };

    function getMousePosOnClick(context, e) {
        let rect = context.canvas.getBoundingClientRect()
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    document.addEventListener('click', (e) => {
        mousePosOnMouseClick = getMousePosOnClick(context, e)
    }, false)
    //<<<<<<<<<<<<<<<<<<<<|mouse position on click|>>>>>>>>>>>>>>>>>>>>>//


    //<<<<<<<<<<<<<<<<<<<<|Map|>>>>>>>>>>>>>>>>>>>>>//
    function Map() {
        this.x = 100;
        this.y = 100;
        this.sizeX = 5000;
        this.sizeY = 5000;
        this.paddingRight = this.sizeX;
        this.paddingDown = this.sizeY;
        this.w = this.sizeX;
        this.h = this.sizeY;
        this.angel = 180 / Math.PI * Math.atan2(mousePosOnMouseMove.x - worier.lockalX, mousePosOnMouseMove.y - worier.lockalY);
    }
    //<<<<<<<<<<<<<<<<<<<<|Map|>>>>>>>>>>>>>>>>>>>>>//




    //<<<<<<<<<<<<<<<<<<<<|Worier on the field|>>>>>>>>>>>>>>>>>>>>>//
    function Person() {
        this.w = 100;
        this.h = 100;
        this.center = 2000;
        this.x = width / 2 - this.w / 2;
        this.y = height / 2 - this.h / 2;
        this.lockalX = this.x + this.w / 2;
        this.lockalY = this.y + this.h / 2;
        this.speedX = 10;
        this.speedY = 10;
    }
    //<<<<<<<<<<<<<<<<<<<<|Worier on the field|>>>>>>>>>>>>>>>>>>>>>//

    Map.prototype.getMoveLeft = function () {
        if (this.x >= width / 2) {
            return true;
        }
        // worier.lockalY = this.y
        
        this.x += worier.speedY;
        worier.lockalX += worier.speedX;
        this.paddingRight += worier.speedX;


    }

    Map.prototype.getMoveRight = function () {
        if (this.x - width / 2 <= -this.sizeX) {
            this.x = -this.sizeX + width / 2;
            return true;
        }

        

        this.x -= worier.speedX;
        worier.lockalX -= worier.speedX;
        this.paddingRight = this.sizeX + this.x;
    }

    Map.prototype.getMoveTop = function () {
        if (this.y >= height / 2) {
            return true;
        }
        this.y += worier.speedY;
        worier.lockalY += worier.speedY;
        this.paddingDown += worier.speedY;
    }
    Map.prototype.getMoveDown = function () {
        if (this.y - height / 2 <= -this.sizeY) {
            this.y = -this.sizeY + height / 2;
            return true;
        }

        this.y -= worier.speedY;
        worier.lockalY -= worier.speedY;
        this.paddingDown = this.sizeY + this.y;
    }

    Person.prototype.draw = function () {
        let degree = this.getDegree();

        let cont = document.createElement("canvas").getContext("2d");
        cont.canvas.width = context.canvas.width;
        cont.canvas.height = context.canvas.height;

        cont.save();
        cont.translate(this.lockalX, this.lockalY);
        cont.rotate(Math.PI / 180 * degree);
        cont.fillStyle = 'black';
        cont.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
        cont.globalCompositeOperation = "destination-in";
        context.clearRect(0, 0, width, height);

        context.fillStyle = 'green';
        context.fillRect(map.x, map.y + 10, map.w, map.h - 20);
        context.fillStyle = 'red';
        context.fillRect(this.x + 2000, this.y, this.w, this.h);
        // getField();

        cont.restore();
        context.drawImage(cont.canvas, 0, 0);
        this.getMiniMap();

    }

    Person.prototype.getDegree = function () {
        return degree = 180 / Math.PI * Math.atan2(mousePosOnMouseMove.y - this.lockalY, mousePosOnMouseMove.x - this.lockalX);
    }
    Person.prototype.getMiniMap = function () {
        //miniMap  
        let miniMap = document.createElement("canvas").getContext("2d");
        miniMap.canvas.width = context.canvas.width;
        miniMap.canvas.height = context.canvas.height;

        let relation = 20;

        let windowSizeX = (map.sizeX + width) / relation;
        let windowSizeY = (map.sizeY + height) / relation;
        let windowX = width - windowSizeX;
        let windowY = height - windowSizeY;
        miniMap.save();

        miniMap.globalAlpha = 0.3;
        miniMap.fillRect(windowX - 17, windowY - 17, windowSizeX + 4, windowSizeY + 4);

        miniMap.globalAlpha = 0.8;
        miniMap.fillRect(windowX - 17 + (worier.lockalX - map.x + width / 2) / 20, windowY - 17 + (worier.lockalY - map.y + height / 2) / (width / height + 20), map.sizeX / 500, map.sizeY / 500);
        miniMap.fillStyle = 'black';

        miniMap.fillStyle = 'white';
        miniMap.globalAlpha = 0.6;
        miniMap.fillRect(windowX - map.x / relation + width / 70, windowY - map.y / relation, width / relation, height / relation);

        miniMap.fillStyle = 'black';
        miniMap.globalAlpha = 0.3;
        miniMap.fillRect(windowX - 15, windowY - 15, windowSizeX, windowSizeY);


        miniMap.restore();

        context.drawImage(miniMap.canvas, 0, 0);
        //miniMap
    }

    Person.prototype.getMove = function () {

        if (mousePosOnMouseClick.x != Math.round(this.lockalX) && mousePosOnMouseClick.y != Math.round(this.lockalY)) {

            angel = 180 / Math.PI * Math.atan2(mousePosOnMouseClick.x - this.lockalX, mousePosOnMouseClick.y - this.lockalY);

            this.lockalX += this.speedX * Math.sin(angel * (Math.PI / 180));
            this.lockalY += this.speedY * Math.cos(angel * (Math.PI / 180));


            if (this.lockalX <= map.x) {
                this.lockalX = map.x;
            } else if (map.paddingRight <= this.lockalX) {
                this.lockalX = map.paddingRight;
            }

            if (this.lockalY <= map.y) {
                this.lockalY = map.y;
            } else if (map.paddingDown <= this.lockalY) {
                this.lockalY = map.paddingDown;
            }

        }

        //move map on X
        if (mousePosOnMouseMove.x > width - width / 20) {
            map.getMoveRight();
        } else if (mousePosOnMouseMove.x < width / 20) {
            map.getMoveLeft();
        } else  if (mousePosOnMouseMove.y > height - height / 20) {
            map.getMoveDown();
        } else if (mousePosOnMouseMove.y < height / 20) {
            map.getMoveTop();
        }

        //move map on Y
       
    };

    let worier = new Person();
    let map = new Map();


    function getField() {
        // let color = [10, 100, 200, 150];
        // for (let i = 0; i < width; i++) {
        //     for (let j = 0; j < height; j++) {
        //         context.fillStyle = 'rgb(0,' + color[Math.round(Math.random() * 4)] + ', 0)';
        //         context.fillRect(i * 5, j * 5, 5, 5);;

        //     }
        // }0
    }

    function getDerection(keyCode) {
        //<<<<<<<<------w--------->>>>>>>>>
        if (keyCode === 87) {

            //<<<<<<<<------s--------->>>>>>>>>
        } else if (keyCode === 83) {

            //<<<<<<<<------d--------->>>>>>>>>
        } else if (keyCode === 68) {

            //<<<<<<<<------a--------->>>>>>>>>
        } else if (keyCode === 65) {


        }
    }


    addEventListener('keydown', (e) => {
        getDerection(e.keyCode)
    })

    ////////////////////////////////////////////////////////////////////////////////

    








}