using System.Collections;
using UnityEngine;

namespace QBreak.Quantum
{
    public class BasisStorm : MonoBehaviour
    {
        [Header("Storm Parameters")]
        [SerializeField] private float shiftInterval = 3.0f;
        [SerializeField] private ParticleSystem stormParticles;

        private bool isActive = false;

        private void OnTriggerEnter(Collider other)
        {
            if (other.CompareTag("Player") && !isActive)
            {
                isActive = true;
                if (stormParticles != null) stormParticles.Play();
                StartCoroutine(StormRoutine());
            }
        }

        private void OnTriggerExit(Collider other)
        {
            if (other.CompareTag("Player"))
            {
                isActive = false;
                if (stormParticles != null) stormParticles.Stop();
            }
        }

        private IEnumerator StormRoutine()
        {
            while (isActive)
            {
                yield return new WaitForSeconds(shiftInterval);
                if (QuantumBasisManager.Instance != null && isActive)
                {
                    QuantumBasisManager.Instance.ToggleBasis();
                }
            }
        }
    }
}
