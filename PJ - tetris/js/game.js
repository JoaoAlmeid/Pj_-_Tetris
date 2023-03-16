const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d"); context.scale(20, 20);

function arenaSweep(){
    let rowCount = 1;
    outer: for (let y = arena.length - 1; y > 0; --y){
        for (let x = 0; x < arena[y].length; ++x){
            if (arena[y][x] === 0){ continue outer; }
        } const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row); ++y;
        // Soma +10 pontos ao score
        player.score += rowCount * 10;
        rowCount *= 2;
    }
}

function collide(arena, player){
    const m = player.matrix;
    const o = player.pos;
    for (let y = 0; y < m.length; ++y){
        for (let x = 0; x < m[y].length; ++x){
            if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0){
                return true;
            }
        }
    }
    return false;
}

function createMatrix(w, h){
    const matrix = [];
    while (h--){
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}
// Cria os Blocos
function createPiece(type){
    if (type === "I"){
        return [

            [0, 1, 0, 0],

            [0, 1, 0, 0],

            [0, 1, 0, 0],

            [0, 1, 0, 0],

        ];

    } else if (type === "L"){
        return [

            [0, 2, 0],

            [0, 2, 0],

            [0, 2, 2],

        ];
    } else if (type === "J"){
        return [

            [0, 3, 0],

            [0, 3, 0],

            [3, 3, 0],

        ];
    } else if (type === "O"){
        return [

            [4, 4],

            [4, 4],

        ];
    } else if (type === "Z"){
        return [

            [5, 5, 0],

            [0, 5, 5],

            [0, 0, 0],

        ];
    } else if (type === "S"){
        return [

            [0, 6, 6],

            [6, 6, 0],

            [0, 0, 0],

        ];
    } else if (type === "T"){
        return [

            [0, 7, 0],

            [7, 7, 7],

            [0, 0, 0],

        ];
    }
}
// Desenha a matriz
function drawMatrix(matrix, offset){
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0){
                context.fillStyle = colors[value];
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}
// Limitações do Campo
function draw(){
    context.fillStyle = "#003"
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawMatrix(arena, { x: 0, y: 0 });
    drawMatrix(player.matrix, player.pos);
}
// Fundir a Arena + Player
function merge(arena, player){
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0){
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}
// Define a rotação da matrix
function rotate(matrix, dir){
    for (let y = 0; y < matrix.length; ++y){
        for (let x = 0; x < y; ++x){
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
    }
    if (dir > 0){
        matrix.forEach((row) => row.reverse());
    } else{
        matrix.reverse();
    }
}
// Move para Baixo
function playerDrop(){
    player.pos.y++;
    if (collide(arena, player)){
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
}
// Move para a D ou E
function playerMove(offset){
    player.pos.x += offset;
    if (collide(arena, player)){
        player.pos.x -= offset;
    }
}
// resetar o jogo
function playerReset(){
const pieces = "TJLOSZI";
player.matrix = createPiece(pieces[(pieces.length * Math.random()) | 0]);
player.pos.y = 0;
player.pos.x =
    ((arena[0].length / 2) | 0) - ((player.matrix[0].length / 2) | 0);
    if (collide(arena, player)){
        arena.forEach((row) => row.fill(0));
        player.score = 0;
        updateScore();
    }
}
// Roda o Bloco para a D ou E
function playerRotate(dir){
const pos = player.pos.x;
let offset = 1;
rotate(player.matrix, dir);
while (collide(arena, player)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > player.matrix[0].length) {
        rotate(player.matrix, -dir);
        player.pos.x = pos;
        return;
    }
}}

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

function update(time = 0) {
    const deltaTime = time - lastTime;
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }
    lastTime = time;
    draw();
    requestAnimationFrame(update);
}
// Atualiza Score
function updateScore() {
    document.getElementById("score").innerText = "Score: " + player.score;
}
// Teclas de movimentação ArrowLeft, ArrowRigth, ArrowDown, A e B
document.addEventListener("keydown", (event) => {
    if (event.keyCode === 37) {
        playerMove(-1);
    } else if (event.keyCode === 39) {
        playerMove(1);
    } else if (event.keyCode === 40) {
        playerDrop();
    } else if (event.keyCode === 65) {
        playerRotate(-1);
    } else if (event.keyCode === 68) {
        playerRotate(1);
    }

});
// Cores dos blocos
const colors = [
    null,
    "#FF0D72",
    "#0DC2FF",
    "#0DFF72",
    "#F538FF",
    "#FF8E0D",
    "#FFE138",
    "#3877FF",
];

const arena = createMatrix(12, 20);
const player = {
    pos: { x: 0, y: 0 },
    matrix: null,
    score: 0,
};

playerReset();
updateScore();
update();


resetButton.addEventListener('click', playerReset);