using System;
using UnityEngine;

namespace QBreak.Game
{
    public enum GameState
    {
        MainMenu,
        Playing,
        Paused,
        PuzzleInteraction,
        Cinematic,
        GameOver,
        Victory
    }

    public class GameStateManager : MonoBehaviour
    {
        public static GameStateManager Instance { get; private set; }

        public GameState CurrentState { get; private set; } = GameState.MainMenu;

        public event Action<GameState> OnStateChanged;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }

        public void SetState(GameState newState)
        {
            if (CurrentState == newState) return;
            CurrentState = newState;

            switch (newState)
            {
                case GameState.MainMenu:
                case GameState.Paused:
                case GameState.GameOver:
                case GameState.Victory:
                    Time.timeScale = (newState == GameState.Paused) ? 0f : 1f;
                    break;
                case GameState.Playing:
                case GameState.Cinematic:
                case GameState.PuzzleInteraction:
                    Time.timeScale = 1f;
                    break;
            }

            OnStateChanged?.Invoke(CurrentState);
        }
    }
}
