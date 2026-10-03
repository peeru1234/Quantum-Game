using UnityEngine;
using QBreak.Interaction;
using QBreak.Audio;
using TMPro;

namespace QBreak.Quantum
{
    public class QuantumFlipMachine : MonoBehaviour, IInteractable
    {
        [Header("Machine Feedback")]
        [SerializeField] private Transform rotatingCoreMesh;
        [SerializeField] private Light machineLight;
        [SerializeField] private ParticleSystem pulseParticles;
        [SerializeField] private TextMeshPro statusText;

        public string GetInteractionText()
        {
            return "[E] QUANTUM FLIP (|0> ↔ |1>)";
        }

        public Vector3 GetPosition()
        {
            return transform.position;
        }

        public void Interact()
        {
            QuantumBasisManager.Instance?.QuantumFlipPrimaryCore();
            AudioManager.Instance?.PlayQuantumFlipSound();

            if (pulseParticles != null) pulseParticles.Play();
            if (machineLight != null) machineLight.intensity = 4f;

            UpdateVisuals();
        }

        private void Update()
        {
            if (rotatingCoreMesh != null)
            {
                rotatingCoreMesh.Rotate(Vector3.up, 45f * Time.deltaTime);
            }
            if (machineLight != null && machineLight.intensity > 1.5f)
            {
                machineLight.intensity = Mathf.Lerp(machineLight.intensity, 1.5f, Time.deltaTime * 3f);
            }
        }

        private void UpdateVisuals()
        {
            if (statusText != null && QuantumBasisManager.Instance != null)
            {
                statusText.text = "STATE: " + QuantumMath.GetStringRepresentation(QuantumBasisManager.Instance.PrimaryCoreState);
            }
        }
    }
}
