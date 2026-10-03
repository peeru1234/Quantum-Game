using System;
using System.Collections;
using UnityEngine;
using QBreak.Audio;

namespace QBreak.Quantum
{
    public class QuantumBasisManager : MonoBehaviour
    {
        public static QuantumBasisManager Instance { get; private set; }

        [Header("Quantum Reality State")]
        [SerializeField] private BasisType currentBasis = BasisType.Z;
        [SerializeField] private StateType primaryCoreState = StateType.Zero;

        [Header("Reality Colors")]
        [SerializeField] private Color zBasisColor = new Color(0f, 0.95f, 1f); // Cyan #00f3ff
        [SerializeField] private Color xBasisColor = new Color(1f, 0f, 0.63f); // Pink/Magenta #ff00a0

        public event Action<BasisType> OnBasisShiftStarted;
        public event Action<BasisType> OnBasisShiftCompleted;
        public event Action<StateType> OnPrimaryCoreStateChanged;

        private bool isTransitioning = false;

        public BasisType CurrentBasis => currentBasis;
        public StateType PrimaryCoreState => primaryCoreState;
        public Color CurrentRealityColor => currentBasis == BasisType.Z ? zBasisColor : xBasisColor;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
        }

        public void ToggleBasis()
        {
            if (isTransitioning) return;
            BasisType targetBasis = currentBasis == BasisType.Z ? BasisType.X : BasisType.Z;
            StartCoroutine(PerformBasisShift(targetBasis));
        }

        private IEnumerator PerformBasisShift(BasisType targetBasis)
        {
            isTransitioning = true;
            OnBasisShiftStarted?.Invoke(targetBasis);

            AudioManager.Instance?.PlayBasisShiftSound(targetBasis == BasisType.X);

            float duration = 0.6f;
            float elapsed = 0f;

            while (elapsed < duration)
            {
                elapsed += Time.deltaTime;
                yield return null;
            }

            currentBasis = targetBasis;
            OnBasisShiftCompleted?.Invoke(currentBasis);
            isTransitioning = false;
        }

        public void SetPrimaryCoreState(StateType newState)
        {
            primaryCoreState = newState;
            OnPrimaryCoreStateChanged?.Invoke(primaryCoreState);
        }

        public StateType MeasurePrimaryCoreZ()
        {
            StateType result = QuantumMath.MeasureZ(primaryCoreState);
            SetPrimaryCoreState(result);
            return result;
        }

        public StateType MeasurePrimaryCoreX()
        {
            StateType result = QuantumMath.MeasureX(primaryCoreState);
            SetPrimaryCoreState(result);
            return result;
        }

        public void QuantumFlipPrimaryCore()
        {
            StateType result = QuantumMath.QuantumFlip(primaryCoreState);
            SetPrimaryCoreState(result);
        }
    }
}
