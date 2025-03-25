
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
    playerSides: {
        player1: "player-cards",
        playerBox: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBox: document.querySelector("#computer-cards"),
    },

    actions: {
        button: document.getElementById("next-duel"),
    },
}



const pathImages = "./src/assets/icons/";

const cardData = [
    {
        id:0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2],
    },
    {
        id:1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        WinOf: [2],
        LoseOf: [0],
    },
    {
        id:2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [1],
    },
];

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id
};

async function createCardImage(idCard, fieldSilde) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", idCard);
    cardImage.classList.add("card");

    if(fieldSilde === state.playerSides.player1){
        cardImage.addEventListener("click", ()=>{
            setCardsFild(cardImage.getAttribute("data-id"));
        });

        cardImage.addEventListener("mouseover", () =>{
            drawSelectCard(idCard);
        });
    }

   

    return cardImage;
}

async function setCardsFild(cardId) {
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
    await showHiddenCardFildsImages(true);
    drawCardsInfild(cardId, computerCardId);
    
}

async function drawCardsInfild(cardId, computerCardId) {
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function showHiddenCardFildsImages(value) {
    if(value === true){
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    }else if(value === false){
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none"
    }
}

async function hideenCardDetails() {
    state.cardSprites.src = "";
    state.cardSprites.name.innerText = "Escolha";
    state.cardSprites.type.innerText = "Uma Carta"
}

async function updateScore() {
    state.score.scoreBox.innerText = `win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function drawButton(text) {
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "Empate";
    let playerCard = cardData[playerCardId];

    if(playerCard.WinOf.includes(computerCardId)){
        duelResults = "Ganhou";
        state.score.playerScore++;
        await playAudio("win.wav")
    }

    if(playerCard.LoseOf.includes(computerCardId)){
        duelResults = "Perdeu";
        state.score.computerScore++
        await playAudio("lose.wav")
    }

    return duelResults;
}

async function removeAllCardsImages(params) {
    let {playerBox, computerBox} = state.playerSides;
    let imgElements = computerBox.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = playerBox.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

async function drawSelectCard (index){
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attibute : " + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSilde) {
    for(let i = 0; i < cardNumbers; i++){
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSilde);

        document.getElementById(fieldSilde).appendChild(cardImage);
    }
}

function resetDuel(){
   state.cardSprites.avatar.src = "";
   state.actions.button.style.display = "none";

   state.fieldCards.player.style.display = "none";
   state.fieldCards.computer.style.display = "none";
   init();
   hideenCardDetails();
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}`)
    audio.play();
};

function init(){
    

    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);
    showHiddenCardFildsImages(false);

    const bgm = document.getElementById("bgm");
    //bgm.play();
}

init();