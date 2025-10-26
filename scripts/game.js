// Game logic and state management
class GameManager {
    constructor() {
        this.gameState = {
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
    }

    // Word database - expanded with more words
    wordDatabase = {
        english: {
            random: [
                'computer', 'mountain', 'ocean', 'butterfly', 'keyboard', 'guitar', 'dragon', 
                'pizza', 'robot', 'spaceship', 'volcano', 'rainbow', 'treasure', 'mystery',
                'adventure', 'journey', 'discovery', 'wonder', 'echo', 'shadow', 'whisper',
                'silence', 'moment', 'infinity', 'galaxy', 'universe', 'paradise', 'fantasy',
                'legend', 'hero', 'villain', 'magic', 'secret', 'puzzle', 'riddle', 'code'
            ],
            weather: ['sunny', 'rainy', 'cloudy', 'stormy', 'windy', 'snowy', 'foggy', 'humid', 'freezing', 'hot'],
            animals: ['lion', 'elephant', 'dolphin', 'eagle', 'penguin', 'kangaroo', 'panda', 'octopus', 'tiger', 'whale'],
            food: ['pizza', 'sushi', 'taco', 'burger', 'pasta', 'salad', 'soup', 'sandwich', 'icecream', 'chocolate'],
            technology: ['computer', 'smartphone', 'internet', 'robot', 'algorithm', 'virtual', 'digital', 'ai', 'vr', 'blockchain'],
            sports: ['soccer', 'basketball', 'tennis', 'swimming', 'running', 'cycling', 'boxing', 'golf', 'skiing', 'surfing'],
            movies: ['action', 'comedy', 'drama', 'horror', 'sci-fi', 'romance', 'thriller', 'fantasy', 'documentary', 'animation']
        },
        swedish: {
            random: [
                'dator', 'berg', 'hav', 'fjäril', 'tangentbord', 'gitarr', 'drake', 'pizza',
                'robot', 'rymdskepp', 'vulkan', 'regnbåge', 'skatt', 'mysterium', 'äventyr',
                'resa', 'upptäckt', 'under', 'eko', 'skugga', 'viskning', 'tystnad', 'ögonblick',
                'oändlighet', 'galax', 'universum', 'paradis', 'fantasi', 'legend', 'hjälte',
                'skurk', 'magi', 'hemlighet', 'pussel', 'gåta', 'kod'
            ],
            weather: ['soligt', 'regnig', 'molnigt', 'stormigt', 'blåsigt', 'snöigt', 'dimma', 'fuktigt', 'frysande', 'varmt'],
            animals: ['lejon', 'elefant', 'delfin', 'örn', 'pingvin', 'känguru', 'panda', 'bläckfisk', 'tiger', 'val'],
            food: ['pizza', 'sushi', 'taco', 'hamburgare', 'pasta', 'sallad', 'soppa', 'smörgås', 'glass', 'choklad'],
            technology: ['dator', 'mobil', 'internet', 'robot', 'algoritm', 'virtuell', 'digital', 'ai', 'vr', 'blockkedja'],
            sports: ['fotboll', 'basket', 'tennis', 'simning', 'löpning', 'cykling', 'boxning', 'golf', 'skidåkning', 'surfning'],
            movies: ['action', 'komedi', 'drama', 'skräck', 'science fiction', 'romantik', 'thriller', 'fantasy', 'dokumentär', 'animation']
        }
    };

    initializeGame() {
        this.generatePlayerId();
        this.loadGameState();
        this.setupEventListeners();
    }

    generatePlayerId() {
        if (!this.gameState.playerId) {
            this.gameState.playerId = 'player_' + Math.random().toString(36).substr(2, 9);
        }
    }

    setupEventListeners() {
        // Add any global event listeners here
        document.addEventListener('click', () => {
        });
    }

    // ... rest of the game logic from main.js can be moved here
    // (I'll keep the main logic in main.js for simplicity in this example)
}

// Global game manager
const gameManager = new GameManager();