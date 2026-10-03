using UnityEngine;
using QBreak.Interaction;
using QBreak.Audio;
using TMPro;

namespace QBreak.Quantum
{
    public class XMeasurementMachine : MonoBehaviour, IInteractable
    {
        [Header("X-Measurement Machine Visuals")]
        [SerializeField] private Light machineLight;
        [SerializeField] private ParticleSystem ringParticles;
        [SerializeField] private TextMeshPro resultDisplayText;

        public string GetInteractionText()
        {
            return "[E] MEASURE IN X-BASIS";
        }

        public Vector3 GetPosition()
        {
            return transform.position;
        }

        public void Interact()
        {
            if (QuantumBasisManager.Instance == null) return;

            StateType result = QuantumBasisManager.Instance.MeasurePrimaryCoreX();
            AudioManager.Instance?.PlayMeasurementSound();

            if (ringParticles != null) ringParticles.Play();
            if (resultDisplayText != null)
            {
                resultDisplayText.text = "COLLAPSED X: " + QuantumMath.GetStringRepresentation(result);
            }
        }
    }
}
