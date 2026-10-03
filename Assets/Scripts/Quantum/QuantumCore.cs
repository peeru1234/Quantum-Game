using UnityEngine;
using TMPro;

namespace QBreak.Quantum
{
    public class QuantumCore : MonoBehaviour
    {
        [Header("Animated Tokamak Components")]
        [SerializeField] private Transform innerRing;
        [SerializeField] private Transform midRing;
        [SerializeField] private Transform outerRing;
        [SerializeField] private Transform plasmaSphere;
        [SerializeField] private Light coreLight;
        [SerializeField] private TextMeshPro stateHologramText;

        [Header("Rotation Speeds")]
        [SerializeField] private float innerSpeed = 90f;
        [SerializeField] private float midSpeed = -120f;
        [SerializeField] private float outerSpeed = 60f;

        private void Start()
        {
            if (QuantumBasisManager.Instance != null)
            {
                QuantumBasisManager.Instance.OnBasisShiftCompleted += HandleBasisChanged;
                QuantumBasisManager.Instance.OnPrimaryCoreStateChanged += HandleStateChanged;
                HandleBasisChanged(QuantumBasisManager.Instance.CurrentBasis);
                HandleStateChanged(QuantumBasisManager.Instance.PrimaryCoreState);
            }
        }

        private void OnDestroy()
        {
            if (QuantumBasisManager.Instance != null)
            {
                QuantumBasisManager.Instance.OnBasisShiftCompleted -= HandleBasisChanged;
                QuantumBasisManager.Instance.OnPrimaryCoreStateChanged -= HandleStateChanged;
            }
        }

        private void Update()
        {
            float delta = Time.deltaTime;

            if (innerRing != null) innerRing.Rotate(Vector3.up, innerSpeed * delta);
            if (midRing != null) midRing.Rotate(Vector3.right, midSpeed * delta);
            if (outerRing != null) outerRing.Rotate(Vector3.forward, outerSpeed * delta);

            if (plasmaSphere != null)
            {
                float scale = 1.0f + Mathf.Sin(Time.time * 4f) * 0.1f;
                plasmaSphere.localScale = new Vector3(scale, scale, scale);
            }
        }

        private void HandleBasisChanged(BasisType basis)
        {
            Color targetColor = QuantumBasisManager.Instance != null ? QuantumBasisManager.Instance.CurrentRealityColor : Color.cyan;
            if (coreLight != null)
            {
                coreLight.color = targetColor;
            }
        }

        private void HandleStateChanged(StateType state)
        {
            if (stateHologramText != null)
            {
                stateHologramText.text = "CORE 01: " + QuantumMath.GetStringRepresentation(state);
            }
        }
    }
}
