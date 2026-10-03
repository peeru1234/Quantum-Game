using UnityEngine;
using QBreak.Interaction;
using QBreak.Audio;
using TMPro;

namespace QBreak.Quantum
{
    public class QuantumDoor : MonoBehaviour, IInteractable
    {
        [Header("Door Requirements")]
        [SerializeField] private BasisType requiredBasis = BasisType.Z;
        [SerializeField] private StateType requiredState = StateType.One;

        [Header("Door Components")]
        [SerializeField] private Transform doorWingLeft;
        [SerializeField] private Transform doorWingRight;
        [SerializeField] private Vector3 leftOpenOffset = new Vector3(-2.5f, 0f, 0f);
        [SerializeField] private Vector3 rightOpenOffset = new Vector3(2.5f, 0f, 0f);
        [SerializeField] private TextMeshPro doorStatusText;

        private bool isOpen = false;
        private Vector3 leftClosedPos;
        private Vector3 rightClosedPos;

        private void Start()
        {
            if (doorWingLeft != null) leftClosedPos = doorWingLeft.localPosition;
            if (doorWingRight != null) rightClosedPos = doorWingRight.localPosition;
            UpdateStatusDisplay();
        }

        public string GetInteractionText()
        {
            if (isOpen) return "[E] DOOR OPEN";

            bool basisMet = QuantumBasisManager.Instance != null && QuantumBasisManager.Instance.CurrentBasis == requiredBasis;
            bool stateMet = QuantumBasisManager.Instance != null && QuantumBasisManager.Instance.PrimaryCoreState == requiredState;

            if (basisMet && stateMet) return "[E] UNLOCK QUANTUM DOOR";
            return "[E] LOCKED (REQ: Z-BASIS + |1>)";
        }

        public Vector3 GetPosition()
        {
            return transform.position;
        }

        public void Interact()
        {
            if (isOpen) return;

            bool basisMet = QuantumBasisManager.Instance != null && QuantumBasisManager.Instance.CurrentBasis == requiredBasis;
            bool stateMet = QuantumBasisManager.Instance != null && QuantumBasisManager.Instance.PrimaryCoreState == requiredState;

            if (basisMet && stateMet)
            {
                isOpen = true;
                AudioManager.Instance?.PlayDoorOpenSound();
                UpdateStatusDisplay();
            }
            else
            {
                AudioManager.Instance?.PlayFailureSound();
            }
        }

        private void Update()
        {
            if (doorWingLeft != null)
            {
                Vector3 target = isOpen ? leftClosedPos + leftOpenOffset : leftClosedPos;
                doorWingLeft.localPosition = Vector3.Lerp(doorWingLeft.localPosition, target, Time.deltaTime * 3f);
            }
            if (doorWingRight != null)
            {
                Vector3 target = isOpen ? rightClosedPos + rightOpenOffset : rightClosedPos;
                doorWingRight.localPosition = Vector3.Lerp(doorWingRight.localPosition, target, Time.deltaTime * 3f);
            }
        }

        private void UpdateStatusDisplay()
        {
            if (doorStatusText != null)
            {
                doorStatusText.text = isOpen ? "DOOR 01: UNLOCKED" : "DOOR 01: REQ Z-BASIS & |1>";
                doorStatusText.color = isOpen ? Color.green : Color.red;
            }
        }
    }
}
