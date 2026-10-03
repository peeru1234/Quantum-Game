using UnityEngine;

namespace QBreak.Quantum
{
    public class QuantumBridge : MonoBehaviour
    {
        [Header("Bridge Settings")]
        [SerializeField] private Collider bridgeCollider;
        [SerializeField] private MeshRenderer bridgeRenderer;
        [SerializeField] private ParticleSystem bridgeParticles;

        private void Start()
        {
            if (QuantumBasisManager.Instance != null)
            {
                QuantumBasisManager.Instance.OnBasisShiftCompleted += HandleBasisChanged;
                HandleBasisChanged(QuantumBasisManager.Instance.CurrentBasis);
            }
        }

        private void OnDestroy()
        {
            if (QuantumBasisManager.Instance != null)
            {
                QuantumBasisManager.Instance.OnBasisShiftCompleted -= HandleBasisChanged;
            }
        }

        private void HandleBasisChanged(BasisType basis)
        {
            bool isXBasis = basis == BasisType.X;

            if (bridgeCollider != null) bridgeCollider.enabled = isXBasis;
            if (bridgeRenderer != null) bridgeRenderer.enabled = isXBasis;
            if (bridgeParticles != null)
            {
                if (isXBasis) bridgeParticles.Play();
                else bridgeParticles.Stop();
            }
        }
    }
}
