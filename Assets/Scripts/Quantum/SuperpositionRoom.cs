using UnityEngine;
using QBreak.Interaction;
using QBreak.Audio;

namespace QBreak.Quantum
{
    public class SuperpositionRoom : MonoBehaviour, IInteractable
    {
        [Header("Superposition Configurations")]
        [SerializeField] private GameObject realityA;
        [SerializeField] private GameObject realityB;
        [SerializeField] private MeshRenderer overlayMeshA;
        [SerializeField] private MeshRenderer overlayMeshB;

        private bool isCollapsed = false;
        private BasisType collapsedBasis = BasisType.Z;

        private void Start()
        {
            SetSuperpositionVisuals();
        }

        public string GetInteractionText()
        {
            if (isCollapsed) return "[E] SUPERPOSITION COLLAPSED (" + collapsedBasis + ")";
            return "[E] OBSERVE & COLLAPSE ROOM SUPERPOSITION";
        }

        public Vector3 GetPosition()
        {
            return transform.position;
        }

        public void Interact()
        {
            if (isCollapsed) return;

            isCollapsed = true;
            collapsedBasis = QuantumBasisManager.Instance != null ? QuantumBasisManager.Instance.CurrentBasis : BasisType.Z;

            AudioManager.Instance?.PlayMeasurementSound();
            ApplyCollapse();
        }

        private void SetSuperpositionVisuals()
        {
            if (realityA != null) realityA.SetActive(true);
            if (realityB != null) realityB.SetActive(true);
        }

        private void ApplyCollapse()
        {
            if (collapsedBasis == BasisType.Z)
            {
                if (realityA != null) realityA.SetActive(true);
                if (realityB != null) realityB.SetActive(false);
            }
            else
            {
                if (realityA != null) realityA.SetActive(false);
                if (realityB != null) realityB.SetActive(true);
            }
        }
    }
}
