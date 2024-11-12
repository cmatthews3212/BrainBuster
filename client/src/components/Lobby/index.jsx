import './Lobby.css';

const Lobby = ({ gameId }) => {
    return (
        <div className="lobby-container">
            <div className="lobby-content">
                <div className="game-id">
                    Game ID: <span>{gameId}</span>
                </div>
                
                <div className="waiting-message">
                    Waiting for the game to start<span className="loading-dots"></span>
                </div>

                <div className="friends-section">
                    <h2>Your Friends</h2>
                    <div className="friends-list">
                        {/* Your friends list items will go here */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Lobby;