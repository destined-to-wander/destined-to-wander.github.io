// display selected section and hide all others
function showContent(contentID){
    var sections = document.querySelectorAll(".section");
    for (let section of sections){
        if (section.classList.contains("section"+contentID)){
            section.style.display = "block";
            if (contentID == 4){
                gameDynamicResize();
            } else{
                // Switch displayed button
                document.getElementById("gameStopButton").style.display = "none";
                document.getElementById("gameStartButton").style.display = "block";
                // Stop game
                gameStop();
            }
            section.classList.remove("slidein");
            section.classList.add("slidein");
            section.style.opacity = 1;
        } else {
            section.style.opacity = 0;
            section.style.display = "none";
        }
    }
}

// display selected internal navbar and hide all others
function formatInternalNavBar(contentID){
    var sections = document.querySelectorAll(".navbar");
    for (let section of sections){
        if (section.id == "navbar" + contentID){
            section.style.display="flex";
        } else {
            section.style.display = "none";
        }
    }
}

function displaySection(contentID){
    showContent(contentID);
    formatInternalNavBar(contentID);
}

document.getElementById("external").addEventListener("click",function(evt){
    if (evt.target.id == "history"){
        displaySection(1);
    } else if (evt.target.id == "methods") {
        displaySection(2);
    } else if (evt.target.id == "environ") {
        displaySection(3);
    } else if (evt.target.id == "minigameNavButton") {
        displaySection(4);
    }
});

document.getElementById("internalHBMenu").addEventListener("click",function(){
    document.getElementById("internal").style.right = "0";
});

document.addEventListener("click", function(evt){
    if (evt.target.id != "internal" && !document.getElementById("internal").contains(evt.target))
        document.getElementById("internal").style.right = "-250px"; 
});

// run on start for the page:
formatInternalNavBar(1);
var sections = document.querySelectorAll(".section");
for (let section of sections){
    if (!section.classList.contains("section1")){
        section.style.opacity = 0;
        section.style.display = "none";
    }
}

// ==== Game Code ====
//boolean trigger for gamestart
var score = 0;
var timer = 1500;

// Game Object Refernces
var canvas = document.getElementById("gameScreen");
var ctx = canvas.getContext("2d");
var minigame = document.getElementById("minigameFrame");
var scoreboard = document.getElementById("scoreBoard");

//drawing canvas objects: https://jsfiddle.net/m1erickson/RCLtR/
var baseSpawnRate = 200;
var lastSpawn = 0;
var objects = [];

// audio object for fish kill
const popAudio = new Audio("audio/popsound.mp3");

// spear
var spear = {
    x: canvas.width / 2,
    y: 0,
    isFired: false,
    speed: 10
};

// fire spear
canvas.addEventListener("click", function (evt) {
    if (!spear.isFired) {
        let rect = canvas.getBoundingClientRect();
        spear.x = evt.clientX - rect.left;
        spear.y = 0;
        spear.isFired = true;
    }
});

// --- Run on load ---
document.getElementById("gameStopButton").style.display = "none";

// resizes the game for the screen
function gameDynamicResize(){
    if (window.matchMedia("(max-width: 800px)").matches){
        canvas.width = screen.width - 24;
        //dont let gamebg width go past 400
        if (canvas.width > 600){
            canvas.width = 600;
        }
        console.log(minigame.offsetHeight);
        console.log(screen.height);
        //if screen height too small to fit the container
        if (minigame.offsetHeight >= screen.height){
            console.log("working");
            //resize the canvas
            canvas.height = screen.height - scoreboard.offsetHeight*2;
        }
        else{
            canvas.height = 400;
        }
    }
    else{
        canvas.width = 600;
        canvas.height = 400;
    }
}
document.getElementById("minigameFrame").addEventListener("click",function(evt){
    if (evt.target.id == "gameStartButton"){
        // Switch displayed button
        document.getElementById("gameStartButton").style.display = "none";
        document.getElementById("gameStopButton").style.display = "block";
        // Start game
        gameStart();
    } else if (evt.target.id == "gameStopButton"){
        // Switch displayed button
        document.getElementById("gameStopButton").style.display = "none";
        document.getElementById("gameStartButton").style.display = "block";
        // Stop game
        gameStop();
    }
});

function UpdateScoreBoard(){
    if (timer <= 0) gameStop();
    scoreboard.innerHTML = "Score: " + score + "<br>Time: " + Math.floor(timer/100) + ":" + timer%100;
}
// interval id for animate calls
var gameAnimateID;
//continuously call animate
function gameStart(){
    score = 0;
    timer = 1500;
    UpdateScoreBoard()
    //start continuous animate calls
    gameAnimateID = setInterval(animate, 10);
    //scroll to center of  the canvas
    canvas.scrollIntoView({behavior:"instant", block:"center"});
}
function gameStop(){
    //reset timer
    timer = 1500;
    //stop calling the animate func
    clearInterval(gameAnimateID);
    //clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //remove all objects
    objects.splice(0, objects.length);
}

function spawnRandomObject() {
    var spawnLineX;
    var moveVel;
    if (Math.random() < 0.50){
        spawnLineX = 0;
        moveVel = (Math.random() * 0.5) + 0.25;
    } else {
        spawnLineX = canvas.width;
        moveVel = -((Math.random() * 0.5) + 0.25);
    }

    var object = {
        type: "#" + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, "0").toUpperCase(),
        y: Math.random() * (canvas.height - 45) + 25,
        x: spawnLineX,
        xVelocity: moveVel
    };

    // add the new object to the objects[] array
    objects.push(object);
}

function animate() {
    timer -= 1;
    // see if its time to spawn a new fish
    if (lastSpawn <= 0) {
        lastSpawn = ((Math.random() * 0.5) + 0.75) * baseSpawnRate;
        spawnRandomObject();
        if (Math.random() < 0.75){
            spawnRandomObject();
        } else if (Math.random() < 0.5){
            spawnRandomObject();
            spawnRandomObject();
        } else if (Math.random() < 0.25){
            spawnRandomObject();
            spawnRandomObject();
            spawnRandomObject();
        }
    } else lastSpawn--;

    // clear lingering objects
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // render spear
    if (spear.isFired) {
        spear.y += spear.speed;

        // Spear goes offscreen
        if (spear.y > canvas.height) {
            spear.isFired = false;
        }
    } else {
        spear.y = 0;
    }

    // move each object across the canvas
    for (var i = 0; i < objects.length; i++) {
        //get object
        var object = objects[i];
        // check spear collision
        if (spear.isFired) {
            let dx = object.x - spear.x;
            let dy = object.y - spear.y;
            //check distance to fish
            if ( Math.pow(dx,2)+Math.pow(dy,2) < 100) {
                // Remove fish and update score
                objects.splice(i, 1);
                i--;
                score++;
                popAudio.play();
                continue;
            }
        // check out of bound
        } else if (object.x < -20 || object.x > canvas.width + 20) {
            objects.splice(i, 1);
            i--; // Adjust index since array length changed
            continue;
        }

        // move object across the screen
        object.x += object.xVelocity;

        // Determine direction
        let dir = object.xVelocity >= 0 ? 1 : -1;

        // set fish color
        ctx.fillStyle = object.type;

        // Fish body
        ctx.beginPath();
        ctx.arc(object.x, object.y, 10, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();

        // Tail (flips based on direction)
        ctx.beginPath();
        ctx.moveTo(object.x - 6 * dir, object.y);
        ctx.lineTo(object.x - 14 * dir, object.y - 10);
        ctx.lineTo(object.x - 14 * dir, object.y + 10);
        ctx.closePath();
        ctx.fill();
    }
    // spear shaft
    ctx.fillStyle = "#824A00";
    ctx.fillRect(spear.x - 3, spear.y, 6, 50);
    // spear point
    ctx.fillStyle = "grey";
    ctx.beginPath();
    ctx.moveTo(spear.x, spear.y + 60);
    ctx.lineTo(spear.x - 7, spear.y + 50);
    ctx.lineTo(spear.x + 7, spear.y + 50);
    ctx.closePath(); 
    ctx.fill();

    UpdateScoreBoard();

    if (timer <= 0){
        gameStop();
    }
}