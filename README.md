#  Memory Matching Game

This is an interactive **Memory Matching Game** where players flip cards to find matching pairs. The game features different difficulty levels, a real-time timer, and a high-score system.

##  Features

###  Gameplay
- Flip cards to find matching pairs.
- Choose from **Easy (10 pairs), Medium (14 pairs), or Hard (22 pairs)** difficulty levels.
- Timer keeps track of elapsed time.
- Scores are saved and displayed for each difficulty level.

###  Game Logic
- Cards are shuffled randomly each game.
- Two flipped cards either match (stay revealed) or flip back after 1 second.
- The game ends when all pairs are matched.

###  High Score System
- Scores are stored in **sessionStorage**.
- Displays top scores for each difficulty.
- Allows replaying the game after completion.

##  Technologies Used

- **HTML5** – Game structure.
- **CSS3** – Styling and layout.
- **JavaScript (ES6)** – Game logic, DOM manipulation, timers, and local storage.
- **SessionStorage** – Stores high scores.

##  File Structure
- **index.html**  The main game interface
- **styles.css**  Styles for the game board and UI 
- **script.js**  Handles game logic, interactions, and high-score management

## 🚀 How to Play

1. Clone the repository:
   ```bash
   git clone <repository-url>
