window.onload = () => {
    const window_width = window.innerWidth;
    const window_height = window.innerHeight;
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    context.canvas.height = window_height;
    context.canvas.width = window_width;

    //Объект яблоко
    const pic = new Image();
    pic.src = '../images/apple1.png';

    // анимация глаз
    let number_for_draw_ayes = 2;
    let nextNum = 0;
    let random = 1;
    setInterval(() => {
        if (nextNum >= 0 && nextNum < 2) {
            number_for_draw_ayes--;
            nextNum++;
        } else if (nextNum >= 2) {
            number_for_draw_ayes++;
            if (nextNum == 3) {
                nextNum = 0;
            }
        }
        random = Math.round(Math.random() * 5);
    }, 1000 * random);

    // Получение позиции по отклику и перемещению курсора
    let arr_pos = {
        x: window_width / 2,
        y: window_height / 2
    }

    let getClickPOsition = (context, e) => {
        let rect = context.canvas.getBoundingClientRect()
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    document.addEventListener('touchmove', (evt) => {
        let touches = evt.changedTouches;
        arr_pos = getClickPOsition(context, touches[0]);

    }, false)
    document.addEventListener('mousemove', (e) => {
        arr_pos = getClickPOsition(context, e);
    }, false);



    // Объект змейка
    function Snake() {
        this.size = Math.round(window_width * window_height / 16000);
        this.positionX = Math.round(window_width / 2);
        this.positionY = Math.round(window_height / 2);
        this.speed = 2;
        this.degree = Math.PI;

        this.array_positionX = [this.positionX];
        this.array_positionY = [this.positionY];
        this.item = 0;

        this.fill_style_body = 'black';
        this.stroke_style_body = 'white';
        this.fill_style_ayes = 'red';

        this.count_of_apple = 1;
        this.apple_size = this.size;
        this.applePositionX = Math.round(Math.random() * (window_width + 1));
        this.applePositionY = Math.round(Math.random() * (window_height + 1));

        this.fils_width = Math.round(this.size / 1.5);

        this.text_size = this.size;
        this.text_position_x = this.fils_width;
        this.text_position_y = this.fils_width * 2;
        this.text_color = 'white'

        this.count_of_boumb = 1;
        this.array_of_position_boumb = [{
            x: Math.round(Math.random() * (window_width + 1)),
            y: Math.round(Math.random() * (window_height + 1))
        }];
        this.num = 0;
        this.getPastPosition = (x, y, i) => {
            this.array_positionX[i] = x;
            this.array_positionY[i] = y;

        }

        this.drawSnake = () => {

            let cont = document.createElement("canvas").getContext("2d");
            cont.canvas.width = context.canvas.width;
            cont.canvas.height = context.canvas.height;


            this.drawApple(cont, this.applePositionX, this.applePositionY, this.apple_size);
            this.drawBombs(cont, this.array_of_position_boumb);
            // Получение массива позиций по Х и по У
            if (this.array_positionX[this.item] != this.positionX || this.array_positionY[this.item] != this.positionY) {
                this.item++;
                this.getPastPosition(this.positionX, this.positionY, this.item);

            }

            // отрисовка частей тела
            for (let i = 1; i < this.count_of_apple; i++) {
                var item = this.item - i * 10;
                cont.save();
                cont.strokeStyle = this.stroke_style_body;
                cont.fillStyle = this.fill_style_body;
                cont.beginPath();
                // cont.lineTo()
                cont.arc(this.array_positionX[item], this.array_positionY[item], this.size, 0, Math.PI * 2, true);
                cont.fill();
                cont.arc(this.array_positionX[item], this.array_positionY[item], this.size, 0, Math.PI * 2, true);
                cont.stroke()
            }

            // отрисовка головы
            cont.save();
            cont.translate(this.positionX, this.positionY);
            cont.rotate(-this.degree);
            cont.fillStyle = this.fill_style_body;
            cont.beginPath();
            cont.arc(0, 0, this.size, 0, Math.PI * 2, true);
            cont.fill();

            // отрисовка глаз
            cont.fillStyle = this.fill_style_ayes;
            cont.strokeStyle = 'red';
            cont.beginPath();
            cont.arc(-this.size / 3, this.size / 3, this.size / 4, 0, Math.PI * number_for_draw_ayes, true);
            cont.arc(this.size / 3, this.size / 3, this.size / 4, 0, Math.PI * number_for_draw_ayes, true);
            cont.fill()

            // Сброс текущей матрицы преобразования в единичную матрицу //
            cont.setTransform(1, 0, 0, 1, 0, 0);

            //отрисовка грниц
            cont.save();
            cont.strokeStyle = 'gray';
            cont.lineWidth = this.fils_width;
            cont.beginPath();
            cont.rect(0, 0, window_width, window_height);
            cont.stroke();

            cont.save();
            cont.fillStyle = this.text_color;
            cont.beginPath();
            cont.font = this.text_size + "px Arial";
            cont.fillText(this.count_of_apple + '', this.text_position_x, this.text_position_y, window_width);
            cont.stroke();

            cont.globalCompositeOperation = "destination-in";
            context.clearRect(0, 0, window_width, window_height);

            cont.restore();
            context.drawImage(cont.canvas, 0, 0);

        }

        this.move = () => {
            if (this.positionX != Math.round(arr_pos.x) && this.positionY != Math.round(arr_pos.y)) {
                angel = Math.atan2(arr_pos.x - this.positionX, arr_pos.y - this.positionY);
                this.degree = angel;
                // if(this.positionX > )
                this.positionY += Math.round(this.speed * Math.cos(angel));
                this.positionX += Math.round(this.speed * Math.sin(angel));
            }

        }

        this.getAppleLocation = () => {

            var frameX = window_width - this.size * 2;
            var frameY = window_height - this.size * 2;

            var pos_x = 0;
            var pos_y = 0;
            var pos_apple_x = 0;
            var pos_apple_y = 0;
            if (this.applePositionX > this.size * 2 && this.applePositionY > this.size * 2 && this.applePositionY < frameY && this.applePositionX < frameX) {
                for (var i = 0; i <= 720; i++) {

                    pos_x = Math.round(this.positionX + this.size / 2 * Math.cos(Math.PI / 180 * i) + this.size * Math.cos(Math.PI / 180 * i));
                    pos_y = Math.round(this.positionY + this.size / 2 * Math.sin(Math.PI / 180 * i) + this.size * Math.sin(Math.PI / 180 * i));

                    pos_apple_x = Math.round(this.applePositionX + this.size / 2 * Math.cos(Math.PI / 180 * i));
                    pos_apple_y = Math.round(this.applePositionY + this.size / 2 * Math.sin(Math.PI / 180 * i));

                    if (pos_x == pos_apple_x && pos_y == pos_apple_y) {

                        this.applePositionX = Math.round(Math.random() * (frameX));
                        this.applePositionY = Math.round(Math.random() * (frameY));
                        this.count_of_apple++;
                    }
                }
            } else {
                this.applePositionX = Math.round(Math.random() * (frameX));
                this.applePositionY = Math.round(Math.random() * (frameY));
                this.getAppleLocation();
            }

        }
        this.getPositonBombs = () => {

            var frameX = window_width - this.size * 2;
            var frameY = window_height - this.size * 2;
            this.array_of_position_boumb[this.count_of_boumb - 1] = {
                x: Math.round(Math.random() * (frameX)),
                y: Math.round(Math.random() * (frameY))
            }


        }
        this.getLooseFromBombs = () => {

            var frameX = window_width - this.size * 2;
            var frameY = window_height - this.size * 2;

            for (let i = 0; i < this.count_of_boumb; i++) {

                let x = this.array_of_position_boumb[i].x
                let y = this.array_of_position_boumb[i].y
                if (x > this.size * 2 && y > this.size * 2 && y < frameY && x < frameX) {


                } else {
                    this.getPositonBombs();
                }

            }

            for (let i = 0; i < this.count_of_boumb; i++) {

                let x = this.array_of_position_boumb[i].x
                let y = this.array_of_position_boumb[i].y
                var pos_x = 0;
                var pos_y = 0;
                var pos_bomb_x = 0;
                var pos_bomb_y = 0;
                for (var t = 0; t <= 720; t++) {

                    pos_x = Math.round(this.positionX + this.size / 2 * Math.cos(Math.PI / 180 * t) + this.size * Math.cos(Math.PI / 180 * t));
                    pos_y = Math.round(this.positionY + this.size / 2 * Math.sin(Math.PI / 180 * t) + this.size * Math.sin(Math.PI / 180 * t));

                    pos_bomb_x = Math.round(x + this.size / 2 * Math.cos(Math.PI / 180 * t));
                    pos_bomb_y = Math.round(y + this.size / 2 * Math.sin(Math.PI / 180 * t));




                    if (pos_x == pos_bomb_x && pos_y == pos_bomb_y) {
                        console.log('sllslllllllllll')
                        this.getLooseMenu();
                    }
                }
            }
        }

        this.drawBombs = (cont, array) => {


            if (this.count_of_apple % 5 == 0) {

                if (this.num == 0) {
                    this.num++;
                    this.count_of_boumb++;
                    this.getPositonBombs()

                }
            } else if (this.count_of_apple % 5 > 0) {
                this.num = 0;
            }
            for (let i = 0; i < array.length; i++) {
                cont.fillStyle = 'gray';
                cont.beginPath();
                cont.arc(array[i].x, array[i].y, this.size / 2, 0, Math.PI * 2, true);
                cont.fill();



            }
        }
        this.drawApple = (cont, x, y, size) => {
            //отрисовка яблока
            cont.fillStyle = 'red';
            cont.beginPath();
            cont.arc(x, y, this.size / 2, 0, Math.PI * 2, true);
            cont.fill();
            // cont.drawImage(pic, x, y, size , size);
        }
        this.checkSnakeLife = () => {

        }
        this.getLoose = (item) => {
            for (let i = 0; i < 360; i++) {
                var pos_x = Math.round(this.positionX + this.size * Math.cos(Math.PI / 180 * i));
                var pos_y = Math.round(this.positionY + this.size * Math.sin(Math.PI / 180 * i));
                if (pos_x < this.fils_width / 2 || pos_x > window_width - this.fils_width / 2 || pos_y < this.fils_width / 2 || pos_y > window_height - this.fils_width / 2) {
                    clearInterval(interval)
                    this.getLooseMenu();
                }

            }
        }
        this.getLooseMenu = () => {
            const menu = document.getElementById('menu');
            const body = document.getElementById('body');
            body.className = 'bb'

            menu.className = "menu_loose";

            canvas.style.display = 'none';

            menu.innerHTML =
                '<div id="head" class="head">' +
                '<h1>Поздравляю!</h1>' +
                '<b>Это ваш результат:' + this.count_of_apple + '</p>' +
                '</div>' +
                '<div id="body" class="body">' +
                '<p>Уровень сложности: легко</p>' +
                '<hr>' +
                '</div>' +
                '<div id="table" class="table"> ' +
                '<div class="nav">Ранг</div>' +
                '<div class="nav">Очки</div>' +
                '<div class="nav">Имя</div>' +
                '</div>' +
                '<div id="buttons" class="buttons">' +
                '<button id="click_save" class="click_save">сохранить</button>' +
                '<button id="click_new_game" class="click_new_game">новая игра</button>' +
                '</div>';

            const new_game = document.getElementById('click_new_game');
            const result = document.getElementById('table');
            const click_save = document.getElementById('click_save');

            //creat block of result
            const block_of_results = document.createElement('div');

            block_of_results.id = 'id_block_of_result';
            block_of_results.className = 'class_block_of_result';

            table.append(block_of_results);

            //creat result
            const experience = document.createElement('div');

            experience.innerHTML = this.count_of_apple;
            experience.id = 'experience';
            experience.className = 'nav';

            id_block_of_result.prepend(experience);

            //creat rang
            let array_rang = [];
            const rang = document.createElement('div');
            rang.innerHTML = 0;
            rang.id = 'rang';
            rang.className = 'nav';

            id_block_of_result.prepend(rang)

            //creat input name
            const input_name = document.createElement('input');

            input_name.setAttribute('id', 'input');
            input_name.className = 'input'
            input_name.type = 'text';

            id_block_of_result.append(input_name)

            //Объект игрок
            let gamer_information = {
                name: '',
                result: 0,
                rang: 0
            };

            click_save.addEventListener('click', (e) => {
                console.log(input_name.value)
                gamer_information.name = input_name.value;
                gamer_information.result = this.count_of_apple;


                for (let i = 0; i < localStorage.length; i++) {
                    let item = localStorage.getItem(localStorage.key(i));
                    array_rang[i] = JSON.parse(item).result
                    array_rang.sort().reverse();

                    for (let j = 0; j < array_rang.length; j++) {
                        if (array_rang[j] == gamer_information.result) {
                            gamer_information.rang = j + 1;
                        }
                    }
                }
                localStorage.setItem(input_name.value, JSON.stringify(gamer_information));


                result.innerHTML =
                    '<div class="nav">Ранг</div>' +
                    '<div class="nav">Очки</div>' +
                    '<div class="nav">Имя</div>';

                getBlockOfResult(result);
                console.log(gamer_information)


            });

            getBlockOfResult(result);

            new_game.addEventListener('click', (e) => {
                window.location.reload();
            });

        }
        let getBlockOfResult = (result) => {
            for (let i = 0; i < localStorage.length; i++) {
                let itema = localStorage.getItem(localStorage.key(i));

                result.insertAdjacentHTML('beforeend',
                    '<div id="id_block_of" class="class_block_of_result">' +
                    '<div id="rang" class="nav">' + JSON.parse(itema).rang + '</div>' +
                    '<div id="experience" class="nav">' + JSON.parse(itema).result + '</div>' +
                    '<div class="nav">' + JSON.parse(itema).name + '</div>' +
                    '</div>');


            }
        };
    }

    const snake = new Snake();
    var interval = setInterval(() => {
        snake.move();
        snake.drawSnake();
        snake.getAppleLocation();
        snake.getLoose();
        snake.getLooseFromBombs();
    }, 10)


    console.log(window.navigator.platform)
}