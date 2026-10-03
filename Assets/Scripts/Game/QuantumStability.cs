using System;
using UnityEngine;
using QBreak.Audio;

namespace QBreak.Game
{
    public class QuantumStability : MonoBehaviour
    {
        public static QuantumStability Instance { get; private set; }

        [Header("Stability Parameters")]
        [SerializeField] private float maxStability = 100f;
        [SerializeField] private float currentStability = 100f;
        [SerializeField] private float regenRate = 5f;

        public event Action<float> OnStabilityChanged;
        public event Action OnRealityCollapse;

        public float StabilityPercentage => currentStability / maxStability;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
        }

        private void Update()
        {
            if (currentStability < maxStability)
            {
                currentStability = Mathf.Min(maxStability, currentStability + regenRate * Time.deltaTime);
                OnStabilityChanged?.Invoke(currentStability);
            }
        }

        public void TakeDamage(float amount)
        {
            currentStability = Mathf.Max(0f, currentStability - amount);
            OnStabilityChanged?.Invoke(currentStability);

            if (currentStability <= 0f)
            {
                TriggerCollapse();
            }
        }

        private void TriggerCollapse()
        {
            AudioManager.Instance?.PlayFailureSound();
            OnRealityCollapse?.Invoke();
            CheckpointManager.Instance?.RestoreLastCheckpoint();
            currentStability = maxStability;
        }
    }
}
