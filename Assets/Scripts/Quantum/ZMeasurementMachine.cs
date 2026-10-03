using UnityEngine;
using QBreak.Interaction;
using QBreak.Audio;
using TMPro;

namespace QBreak.Quantum
{
    public class ZMeasurementMachine : MonoBehaviour, IInteractable
    {
        [Header("Z-Measurement Machine Visuals")]
        [SerializeField] private Light machineLight;
        [SerializeField] private ParticleSystem beamParticles;
        [SerializeField] private TextMeshPro resultDisplayText;

        public string GetInteractionText()
        {
            return "[E] MEASURE IN Z-BASIS";
        }

        public Vector3 GetPosition()
        {
            return transform.position;
        }

        public void Interact()
        {
            if (QuantumBasisManager.Instance == null) return;

            StateType result = QuantumBasisManager.Instance.MeasurePrimaryCoreZ();
            AudioManager.Instance?.PlayMeasurementSound();

            if (beamParticles != null) beamParticles.Play();
            if (resultDisplayText != null)
            {
                resultDisplayText.text = "COLLAPSED Z: " + QuantumMath.GetStringRepresentation(result);
            }
        }
    }
}
