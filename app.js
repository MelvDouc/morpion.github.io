// ===== ===== ===== ===== =====
// Add boxes
// ===== ===== ===== ===== =====

const boxes = [];
for (let i = 0; i < 9; i++) {
    const element = document.createElement("div");
    element.classList.add("box");
    document.querySelector("#gameBoard").append(element);

    const box = {
        element: element,
        marked: undefined
    }

    boxes.push(box);
}

// ===== ===== ===== ===== =====
// Functions
// ===== ===== ===== ===== =====

const playText = document.querySelector("h1");
const replayButton = document.querySelector("#replayButton");
const playerOne = "O";
const playerTwo = "X";
let currentPlayer = playerOne;
let gameOver = false;
const scores = document.querySelector("#scores");
const onMove = document.querySelector("#onMove");

function changeCurrentPlayer() {
    currentPlayer = (currentPlayer === playerOne) ? playerTwo : playerOne;
    onMove.dataset.move = currentPlayer;
}

function getAlignedBoxes() {
    const alignedBoxes = [];
    const lines = {
        rows: [
            [boxes[0], boxes[1], boxes[2]],
            [boxes[3], boxes[4], boxes[5]],
            [boxes[6], boxes[7], boxes[8]]
        ],
        columns: [
            [boxes[0], boxes[3], boxes[6]],
            [boxes[1], boxes[4], boxes[7]],
            [boxes[2], boxes[5], boxes[8]]
        ],
        diagonals: [
            [boxes[0], boxes[4], boxes[8]],
            [boxes[2], boxes[4], boxes[6]]
        ]
    }
    Object.values(lines).forEach(line => {
        line.forEach(boxes => {
            if (
                boxes[0].marked != undefined
                && boxes[0].marked === boxes[1].marked
                && boxes[0].marked === boxes[2].marked
            ) {
                alignedBoxes.push(boxes.flat());
                return;
            }
        })
    })
    if (alignedBoxes.length < 1) return false;
    return alignedBoxes.flat();
}

// ===== ===== ===== ===== =====
// Click events
// ===== ===== ===== ===== =====

boxes.forEach((box, i) => {
    box.element.addEventListener("click", function () {
        if (!gameOver && !box.element.dataset.mark) {
            box.element.dataset.mark = currentPlayer;
            boxes[i].marked = currentPlayer;
            changeCurrentPlayer();

            if (getAlignedBoxes().length > 0) {
                changeCurrentPlayer()
                let winner, score;
                switch (currentPlayer) {
                    case playerOne:
                        winner = "les cercles"
                        score = "<b>1</b> &mdash; <b>0</b>"
                        break;
                    case playerTwo:
                        winner = "les croix"
                        score = "<b>0</b> &mdash; <b>1</b>"
                        break;
                }
                playText.innerHTML = `${winner} gagnent&thinsp;!`;
                const alignedBoxes = getAlignedBoxes();
                alignedBoxes.forEach(alignedBox => alignedBox.element.style.backgroundColor = "#66ff66");
                replayButton.classList.add("fade-in");
                const li = document.createElement("li");
                li.innerHTML = `<span>(${new Date().toLocaleTimeString()})</span> Cercles ${score} Croix`;
                scores.append(li);
                gameOver = true;
                return;
            }
            if (boxes.every(box => box.marked != undefined) && !getAlignedBoxes()) {
                playText.innerHTML = `Partie nulle&thinsp;!`;
                replayButton.classList.add("fade-in");
                const li = document.createElement("li");
                li.innerHTML = `<span>(${new Date().toLocaleTimeString()})</span> Cercles ½ &mdash; ½ Croix`;
                scores.append(li);
                gameOver = true;
                return;
            }
        }
    });
});

replayButton.addEventListener("click", function () {
    playText.innerHTML = `jouer au morpion`;
    currentPlayer = playerOne;
    onMove.dataset.move = playerOne;
    boxes.forEach(box => {
        box.marked = undefined;
        delete box.element.dataset.mark;
        box.element.removeAttribute("style");
    });
    gameOver = false;
});