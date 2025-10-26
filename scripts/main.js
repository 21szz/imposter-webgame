// Game state
let gameState = {
    currentScreen: 'mainMenu',
    playerId: null,
    gameCode: null,
    isHost: false,
    players: [],
    gameSettings: {
        mode: 'classic',
        language: 'english',
        imposters: 1,
        theme: 'random'
    },
    gameWord: null,
    imposterWord: null,
    votes: {},
    timer: null
};

// Expanded word database
const wordDatabase = {
    english: {
        random: [
            'computer', 'mountain', 'ocean', 'butterfly', 'keyboard', 'guitar', 'dragon', 
            'pizza', 'robot', 'spaceship', 'volcano', 'rainbow', 'treasure', 'mystery',
            'adventure', 'journey', 'discovery', 'wonder', 'echo', 'shadow', 'whisper',
            'silence', 'moment', 'infinity', 'galaxy', 'universe', 'paradise', 'fantasy',
            'legend', 'hero', 'villain', 'magic', 'secret', 'puzzle', 'riddle', 'code',
            'crystal', 'phoenix', 'wizard', 'dungeon', 'castle', 'kingdom', 'quest', 'scroll'
        ],
        weather: ['sunny', 'rainy', 'cloudy', 'stormy', 'windy', 'snowy', 'foggy', 'humid', 'freezing', 'hot', 'breezy', 'chilly'],
        animals: ['lion', 'elephant', 'dolphin', 'eagle', 'penguin', 'kangaroo', 'panda', 'octopus', 'tiger', 'whale', 'giraffe', 'zebra'],
        food: ['pizza', 'sushi', 'taco', 'burger', 'pasta', 'salad', 'soup', 'sandwich', 'icecream', 'chocolate', 'pancake', 'smoothie'],
        technology: ['computer', 'smartphone', 'internet', 'robot', 'algorithm', 'virtual', 'digital', 'ai', 'vr', 'blockchain', 'quantum', 'neural'],
        sports: ['soccer', 'basketball', 'tennis', 'swimming', 'running', 'cycling', 'boxing', 'golf', 'skiing', 'surfing', 'volleyball', 'baseball'],
        movies: ['action', 'comedy', 'drama', 'horror', 'sci-fi', 'romance', 'thriller', 'fantasy', 'documentary', 'animation', 'western', 'noir'],
        nature: ['forest', 'river', 'waterfall', 'canyon', 'desert', 'island', 'volcano', 'glacier', 'meadow', 'jungle', 'cave', 'cliff']
    },
    swedish: {
        random: [
            'dator', 'berg', 'hav', 'fjäril', 'tangentbord', 'gitarr', 'drake', 'pizza',
            'robot', 'rymdskepp', 'vulkan', 'regnbåge', 'skatt', 'mysterium', 'äventyr',
            'resa', 'upptäckt', 'under', 'eko', 'skugga', 'viskning', 'tystnad', 'ögonblick',
            'oändlighet', 'galax', 'universum', 'paradis', 'fantasi', 'legend', 'hjälte',
            'skurk', 'magi', 'hemlighet', 'pussel', 'gåta', 'kod', 'kristall', 'fonix',
            'trollkarl', 'fängelsehåla', 'slott', 'konungarike', 'sökande', 'skriftrulle'
        ],
        weather: ['soligt', 'regnig', 'molnigt', 'stormigt', 'blåsigt', 'snöigt', 'dimma', 'fuktigt', 'frysande', 'varmt', 'brisig', 'kylig'],
        animals: ['lejon', 'elefant', 'delfin', 'örn', 'pingvin', 'känguru', 'panda', 'bläckfisk', 'tiger', 'val', 'giraff', 'zebra'],
        food: ['pizza', 'sushi', 'taco', 'hamburgare', 'pasta', 'sallad', 'soppa', 'smörgås', 'glass', 'choklad', 'pannkaka', 'smoothie'],
        technology: ['dator', 'mobil', 'internet', 'robot', 'algoritm', 'virtuell', 'digital', 'ai', 'vr', 'blockkedja', 'kvant', 'neural'],
        sports: ['fotboll', 'basket', 'tennis', 'simning', 'löpning', 'cykling', 'boxning', 'golf', 'skidåkning', 'surfning', 'volleyboll', 'baseboll'],
        movies: ['action', 'komedi', 'drama', 'skräck', 'science fiction', 'romantik', 'thriller', 'fantasy', 'dokumentär', 'animation', 'västern', 'film noir'],
        nature: ['skog', 'flod', 'vattenfall', 'ravin', 'öken', 'ö', 'vulkan', 'glaciär', 'äng', 'djungel', 'grotta', 'klippa']
    }
};

// Initialize the game
function init() {
    // Generate player ID if not exists
    if (!gameState.playerId) {
        gameState.playerId = 'player_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Load saved state
    loadGameState();
    
    // Show initial screen
    showScreen('mainMenu');
    
    // Initialize game manager
    gameManager.initializeGame();
}

// Screen management
function showScreen(screenName) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    document.getElementById(screenName).classList.add('active');
    gameState.currentScreen = screenName;
    
    // Special handling for different screens
    switch(screenName) {
        case 'lobby':
            updateLobby();
            break;
        case 'loading':
            startLoadingAnimation();
            break;
    }
    
    saveGameState();
}

// Create new game
function createGame() {
    const hostName = document.getElementById('hostName').value.trim();
    if (!hostName) {
        alert('Please enter your name');
        return;
    }
    
    // Generate game code
    const gameCode = generateGameCode();
    gameState.gameCode = gameCode;
    gameState.isHost = true;
    
    // Get game settings
    gameState.gameSettings = {
        mode: document.querySelector('input[name="gameMode"]:checked').value,
        language: document.getElementById('language').value,
        imposters: parseInt(document.getElementById('imposterCount').textContent),
        theme: document.getElementById('theme').value
    };
    
    // Add host to players
    gameState.players = [{
        id: gameState.playerId,
        name: hostName,
        isHost: true,
        isImposter: false,
        isEliminated: false
    }];
    
    // Show lobby
    showScreen('lobby');
}

// Join existing game
function joinGame() {
    const gameCode = document.getElementById('gameCode').value.trim();
    const playerName = document.getElementById('playerName').value.trim();
    
    if (!gameCode || gameCode.length !== 7) {
        alert('Please enter a valid 7-digit game code');
        return;
    }
    
    if (!playerName) {
        alert('Please enter your name');
        return;
    }
    
    // In a real app, you would validate the game code with a server
    // For now, we'll simulate joining
    gameState.gameCode = gameCode;
    gameState.isHost = false;
    
    // Add player to game
    gameState.players.push({
        id: gameState.playerId,
        name: playerName,
        isHost: false,
        isImposter: false,
        isEliminated: false
    });
    
    showScreen('lobby');
}

// Generate random game code
function generateGameCode() {
    return Math.floor(1000000 + Math.random() * 9000000).toString();
}

// Update lobby display
function updateLobby() {
    if (!gameState.gameCode) return;
    
    // Update game code display
    document.getElementById('lobbyCode').textContent = gameState.gameCode;
    
    // Update player count
    document.getElementById('playerCount').textContent = gameState.players.length;
    
    // Update players list
    const playersList = document.getElementById('playersList');
    playersList.innerHTML = '';
    
    gameState.players.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.className = `player-card ${player.isHost ? 'host' : ''}`;
        playerCard.innerHTML = `
            <div class="player-name">${player.name}</div>
            <div class="player-status">${player.isHost ? '👑 Host' : 'Player'}</div>
        `;
        playersList.appendChild(playerCard);
    });
    
    // Update settings display
    document.getElementById('displayMode').textContent = 
        gameState.gameSettings.mode === 'classic' ? 'Classic' : 'Hidden Imposter';
    document.getElementById('displayLanguage').textContent = 
        gameState.gameSettings.language.charAt(0).toUpperCase() + gameState.gameSettings.language.slice(1);
    document.getElementById('displayImposters').textContent = gameState.gameSettings.imposters;
    document.getElementById('displayTheme').textContent = 
        gameState.gameSettings.theme.charAt(0).toUpperCase() + gameState.gameSettings.theme.slice(1);
    
    // Enable start button only for host and with enough players
    const startBtn = document.getElementById('startBtn');
    startBtn.disabled = !gameState.isHost || gameState.players.length < 2;
}

// Change imposter count
function changeImposters(delta) {
    const countElement = document.getElementById('imposterCount');
    let count = parseInt(countElement.textContent);
    count += delta;
    
    // Ensure count is between 1 and 4
    if (count >= 1 && count <= 4) {
        countElement.textContent = count;
    }
}

// Copy game code to clipboard
function copyGameCode() {
    const code = document.getElementById('lobbyCode').textContent;
    navigator.clipboard.writeText(code).then(() => {
        // Show copied feedback
        const copyBtn = document.querySelector('.copy-btn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    });
}

// Start the game
function startGame() {
    if (!gameState.isHost) return;
    
    // Assign roles
    assignRoles();
    
    // Show loading screen
    showScreen('loading');
    
    // Start game after loading
    setTimeout(() => {
        startActualGame();
    }, 5000); // 5 second loading screen
}

// Assign imposter roles
function assignRoles() {
    const players = [...gameState.players];
    const impostersCount = gameState.gameSettings.imposters;
    
    // Reset all roles
    players.forEach(player => {
        player.isImposter = false;
        player.isEliminated = false;
    });
    
    // Select imposters randomly
    const availablePlayers = players.filter(p => !p.isHost);
    let impostersSelected = 0;
    
    while (impostersSelected < impostersCount && availablePlayers.length > 0) {
        const randomIndex = Math.floor(Math.random() * availablePlayers.length);
        const selectedPlayer = availablePlayers[randomIndex];
        selectedPlayer.isImposter = true;
        availablePlayers.splice(randomIndex, 1);
        impostersSelected++;
    }
    
    // If we still need more imposters and host is available, assign to host
    if (impostersSelected < impostersCount) {
        const host = players.find(p => p.isHost);
        if (host && !host.isImposter) {
            host.isImposter = true;
            impostersSelected++;
        }
    }
    
    gameState.players = players;
}

// Start the actual game
function startActualGame() {
    // Select word based on theme and language
    const language = gameState.gameSettings.language;
    const theme = gameState.gameSettings.theme;
    const words = wordDatabase[language][theme] || wordDatabase[language].random;
    const word = words[Math.floor(Math.random() * words.length)];
    
    // Store game word
    gameState.gameWord = word;
    
    // For hidden imposter mode, select a different word for imposters
    if (gameState.gameSettings.mode === 'hidden') {
        const imposterWords = wordDatabase[language].random.filter(w => w !== word);
        gameState.imposterWord = imposterWords[Math.floor(Math.random() * imposterWords.length)];
    }
    
    // Show game screen
    showScreen('gameScreen');
    
    // Start game timer
    startGameTimer();
    
    // Update player displays
    updateGamePlayers();
    
    // Show player's word
    showPlayerWord();
}

// Show player's assigned word
function showPlayerWord() {
    const currentPlayer = gameState.players.find(p => p.id === gameState.playerId);
    let word = gameState.gameWord;
    let hint = '';
    
    if (currentPlayer.isImposter) {
        if (gameState.gameSettings.mode === 'hidden') {
            word = gameState.imposterWord;
            hint = '🎭 You have a different word - try to blend in!';
        } else {
            hint = '🎭 You are the Imposter - you don\'t know the word!';
            word = '???';
        }
    }
    
    document.getElementById('theWord').textContent = word.toUpperCase();
    document.getElementById('wordHint').textContent = hint;
}

// Update game players display
function updateGamePlayers() {
    const playersDisplay = document.getElementById('gamePlayers');
    playersDisplay.innerHTML = '';
    
    gameState.players.forEach(player => {
        const playerElement = document.createElement('div');
        playerElement.className = `game-player ${player.isEliminated ? 'eliminated' : ''} ${player.isImposter ? 'imposter' : ''}`;
        playerElement.innerHTML = `
            <div class="player-name">${player.name}</div>
            ${player.isHost ? '<div class="player-status">👑</div>' : ''}
            ${player.isEliminated ? '<div class="player-status">❌</div>' : ''}
        `;
        playersDisplay.appendChild(playerElement);
    });
}

// Start game timer
function startGameTimer() {
    let timeLeft = 300; // 5 minutes in seconds
    
    const timerElement = document.getElementById('gameTimer');
    const updateTimer = () => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            endGame('timeout');
            return;
        }
        
        timeLeft--;
        setTimeout(updateTimer, 1000);
    };
    
    updateTimer();
}

// Show voting screen
function showVotingScreen() {
    const votingGrid = document.getElementById('votingGrid');
    votingGrid.innerHTML = '';
    
    // Add voting options for each player (except yourself and eliminated players)
    gameState.players.forEach(player => {
        if (player.id !== gameState.playerId && !player.isEliminated) {
            const voteOption = document.createElement('div');
            voteOption.className = 'vote-option';
            voteOption.innerHTML = `
                <div class="player-name">${player.name}</div>
            `;
            voteOption.onclick = () => selectVote(player.id, voteOption);
            votingGrid.appendChild(voteOption);
        }
    });
    
    document.getElementById('votingScreen').classList.add('active');
}

// Hide voting screen
function hideVotingScreen() {
    document.getElementById('votingScreen').classList.remove('active');
}

// Select vote
let selectedVote = null;
function selectVote(playerId, element) {
    // Deselect previous selection
    document.querySelectorAll('.vote-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Select new one
    element.classList.add('selected');
    selectedVote = playerId;
}

// Submit vote
function submitVote() {
    if (!selectedVote) {
        alert('Please select a player to vote out');
        return;
    }
    
    // In a real app, you would send this to the server
    // For now, we'll simulate the vote
    const votedPlayer = gameState.players.find(p => p.id === selectedVote);
    votedPlayer.isEliminated = true;
    
    // Check game end condition
    checkGameEnd();
    
    hideVotingScreen();
    updateGamePlayers();
}

// Check if game should end
function checkGameEnd() {
    const imposters = gameState.players.filter(p => p.isImposter && !p.isEliminated);
    const innocents = gameState.players.filter(p => !p.isImposter && !p.isEliminated);
    
    if (imposters.length === 0) {
        endGame('innocents_win');
    } else if (imposters.length >= innocents.length) {
        endGame('imposters_win');
    }
}

// End game and show results
function endGame(reason) {
    let title = '';
    let content = '';
    let resultClass = '';
    
    const currentPlayer = gameState.players.find(p => p.id === gameState.playerId);
    const imposters = gameState.players.filter(p => p.isImposter);
    
    switch(reason) {
        case 'innocents_win':
            title = 'INNOCENTS WIN!';
            content = `The imposters have been eliminated!<br><br>
                      The word was: <strong>${gameState.gameWord}</strong><br><br>
                      Imposters: ${imposters.map(p => p.name).join(', ')}`;
            resultClass = currentPlayer.isImposter ? 'lose' : 'win';
            break;
            
        case 'imposters_win':
            title = 'IMPOSTERS WIN!';
            content = `The imposters have taken over!<br><br>
                      The word was: <strong>${gameState.gameWord}</strong><br><br>
                      Imposters: ${imposters.map(p => p.name).join(', ')}`;
            resultClass = currentPlayer.isImposter ? 'win' : 'lose';
            break;
            
        case 'timeout':
            title = 'TIME\'S UP!';
            content = `Time ran out!<br><br>
                      The word was: <strong>${gameState.gameWord}</strong><br><br>
                      Imposters: ${imposters.map(p => p.name).join(', ')}`;
            resultClass = 'lose';
            break;
    }
    
    document.getElementById('resultTitle').textContent = title;
    document.getElementById('resultContent').innerHTML = content;
    document.getElementById('resultCard').className = `result-card ${resultClass}`;
    
    showScreen('resultsScreen');
}

// Return to lobby
function returnToLobby() {
    // Reset game state but keep players and settings
    gameState.players.forEach(player => {
        player.isImposter = false;
        player.isEliminated = false;
    });
    
    showScreen('lobby');
}

// Return to main menu
function returnToMenu() {
    // Reset game state
    gameState.gameCode = null;
    gameState.isHost = false;
    gameState.players = [];
    gameState.gameWord = null;
    gameState.imposterWord = null;
    gameState.votes = {};
    
    if (gameState.timer) {
        clearTimeout(gameState.timer);
        gameState.timer = null;
    }
    
    showScreen('mainMenu');
}

// Save game state to localStorage
function saveGameState() {
    localStorage.setItem('imposterGameState', JSON.stringify(gameState));
}

// Load game state from localStorage
function loadGameState() {
    const saved = localStorage.getItem('imposterGameState');
    if (saved) {
        const parsed = JSON.parse(saved);
        gameState = { ...gameState, ...parsed };
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', init);