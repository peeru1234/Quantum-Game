using UnityEngine;
using QBreak.Interaction;

namespace QBreak.Quantum
{
    public class QuantumSnapshot : MonoBehaviour, IInteractable
    {
        [Header("Snapshot Memory")]
        private bool hasSnapshot = false;
        private BasisType savedBasis;
        private StateType savedState;

        public string GetInteractionText()
        {
            if (!hasSnapshot) return "[E] TAKE QUANTUM SNAPSHOT";
            return $"[E] RESTORE SNAPSHOT ({savedBasis} / {savedState})";
        }

        public Vector3 GetPosition()
        {
            return transform.position;
        }

        public void Interact()
        {
            if (QuantumBasisManager.Instance == null) return;

            if (!hasSnapshot)
            {
                savedBasis = QuantumBasisManager.Instance.CurrentBasis;
                savedState = QuantumBasisManager.Instance.PrimaryCoreState;
                hasSnapshot = true;
                Debug.Log($"[QuantumSnapshot] Saved: Basis={savedBasis}, State={savedState}");
            }
            else
            {
                QuantumBasisManager.Instance.SetPrimaryCoreState(savedState);
                Debug.Log($"[QuantumSnapshot] Restored: State={savedState}");
                hasSnapshot = false;
            }
        }
    }
}
