const state = {
    score:{
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites:{
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards:{
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    playerSides:{
        player: "player-cards",
        playerBox: document.getElementById("player-cards"),
        computer: "computer-cards",
        computerBox: document.getElementById("computer-cards"),
    },
    actions:{
        button: document.getElementById("next-duel"),
    }
};

const imagesPath = "./src/assets/icons/";

const cardData = [
    {
        id:0,
        name: "Mão branca das unhas azuis",
        type: "Paper",
        img: imagesPath+"f3.jpg",
        winOf:[1],
        loseOf:[2],
    },
    {
        id:1,
        name: "Punho negro",
        type: "Rock",
        img: imagesPath+"f2.jpg",
        winOf:[2],
        loseOf:[0],
    },
    {
        id:2,
        name: "Palma, a proibida",
        type: "Scissors",
        img: imagesPath+"f1.jpg",
        winOf:[0],
        loseOf:[1],
    }
];

async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.volume = 0.5;
    audio.play();
}

async function removeAllCardsImages(){
    let {computerBox, playerBox} = state.playerSides;
    computerBox.querySelectorAll("img").forEach((img) => img.remove());
    playerBox.querySelectorAll("img").forEach((img) => img.remove());
}

async function getRandomCardId(){
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function drawButton(text){
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";
}

async function updateScore(){
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function resetDuel(){
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}

async function checkDuelResults(playerCardId, computerCardId){
    let duelResults = "Empate";
    let playerCard = cardData[playerCardId];

    if(playerCard.winOf.includes(computerCardId)){
        duelResults = "Ganhou";
        state.score.playerScore++;
    }
    else if(playerCard.loseOf.includes(computerCardId)){
        duelResults = "Perdeu";
        state.score.computerScore++;
    }

    await playAudio(duelResults);

    return duelResults;
}

async function hiddenShowCardFieldImages(isTrue){

    if(isTrue){
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    }
    else{
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
}

async function drawCardsInField(cardId, computerCardId){
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function resetCardDetails(){
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerHTML = "";
}

async function setCardsField(cardId){
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    await hiddenShowCardFieldImages(true);
    await resetCardDetails();
    await drawCardsInField(cardId, computerCardId);
    
    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function drawSelectCard(index){
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Atribute: "+cardData[index].type;
}

async function createCardImage(idCard, fieldSide){
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", imagesPath+"cover.jpg");
    cardImage.setAttribute("data-id", idCard);
    cardImage.classList.add("card");

    if(fieldSide===state.playerSides.player){
        cardImage.addEventListener("click", () => setCardsField(cardImage.getAttribute("data-id")));
        cardImage.addEventListener("mouseover", () => drawSelectCard(idCard));
    }

    return cardImage;
}

async function drawCards(cardNumbers, fieldSide){

    for(let i = 0; i<cardNumbers; i++){
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);
        
        document.getElementById(fieldSide).appendChild(cardImage);
    }
};

function init(){
    hiddenShowCardFieldImages(false);

    drawCards(5, state.playerSides.player);
    drawCards(5, state.playerSides.computer);

    const bgm = document.getElementById("bgm");
    bgm.volume = 0.3;
    //bgm.playbackRate = 1.5;
    bgm.play();
}

init();