const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = { //Adjust count to adjust the winrate of the user
    A: 6,
    B: 10,
    C: 18,
    D: 24
};

const SYMBOLS_VALUE = {
    A: 10,
    B: 5,
    C: 5,
    D: 3
};

let balance = 0;

document.getElementById('deposit-button').addEventListener('click', () => {
    const depositAmount = parseFloat(document.getElementById('deposit-amount').value);
    if (isNaN(depositAmount) || depositAmount <= 0) {
        alert('Invalid deposit amount');
    } else {
        balance += depositAmount;
        updateBalance();

        // Enable bet button and show play again button if balance is positive
        if (balance > 0) {
            document.getElementById('bet-button').disabled = false;
            document.getElementById('play-again-button').style.display = 'block';
        }
    }
});

document.getElementById('bet-button').addEventListener('click', () => {
    const numLines = parseInt(document.getElementById('numLines').value);
    const betAmount = parseFloat(document.getElementById('bet-amount').value);

    if (isNaN(numLines) || numLines <= 0 || numLines > 3) {
        alert('Invalid number of lines');
        return;
    }
    if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance / numLines) {
        alert('Invalid bet amount');
        return;
    }

    balance -= betAmount * numLines;
    updateBalance();

    const reels = spin();
    const rows = transpose(reels);
    displayReels(rows);

    const winnings = collectWinnings(rows, betAmount, numLines);
    balance += winnings;

    document.getElementById('message').innerText = `You won $${winnings}`;
    updateBalance();

    if (balance <= 0) {
        setTimeout(() => {
            alert('No more money. Please deposit more.');
            document.getElementById('play-again-button').style.display = 'none';
            document.getElementById('bet-button').disabled = true;
        }, 100);
    } else {
        document.getElementById('play-again-button').style.display = 'block';
    }
});

document.getElementById('play-again-button').addEventListener('click', () => {
    document.getElementById('play-again-button').style.display = 'none';
    document.getElementById('message').innerText = '';
    document.getElementById('numLines').value = '';
    document.getElementById('bet-amount').value = '';
    document.getElementById('reels').innerHTML = '';
    document.getElementById('bet-button').disabled = false;
});

const updateBalance = () => {
    document.getElementById('balance').innerText = balance.toFixed(2);
};

const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }

    return reels;
};

const transpose = (reels) => {
    const rows = [];
    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
};

const displayReels = (rows) => {
    const reelsContainer = document.getElementById('reels');
    reelsContainer.innerHTML = ''; 
    rows.forEach(row => {
        const reel = document.createElement('div');
        reel.classList.add('reel');
        row.forEach(symbol => {
            const symbolDiv = document.createElement('div');
            symbolDiv.textContent = symbol;
            reel.appendChild(symbolDiv);
        });
        reelsContainer.appendChild(reel);
    });
};

const collectWinnings = (rows, bet, lines) => {
    let winnings = 0;
    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        if (symbols.every(symbol => symbol === symbols[0])) {
            winnings += bet * SYMBOLS_VALUE[symbols[0]];
        }
    }
    return winnings;
};
