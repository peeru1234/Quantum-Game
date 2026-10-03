using UnityEngine;
using TMPro;

namespace QBreak.Interaction
{
    public class PlayerInteraction : MonoBehaviour
    {
        [Header("Raycast Settings")]
        [SerializeField] private Camera playerCamera;
        [SerializeField] private float maxDistance = 4.5f;
        [SerializeField] private LayerMask interactableLayer;

        [Header("UI Feedback")]
        [SerializeField] private GameObject interactionPromptContainer;
        [SerializeField] private TextMeshProUGUI promptTextGUI;
        [SerializeField] private TextMeshPro promptTextWorld;

        private IInteractable currentInteractable;

        private void Update()
        {
            PerformCenterRaycast();
        }

        private void PerformCenterRaycast()
        {
            if (playerCamera == null) playerCamera = Camera.main;
            if (playerCamera == null) return;

            Ray ray = playerCamera.ViewportPointToRay(new Vector3(0.5f, 0.5f, 0f));
            RaycastHit hit;

            if (Physics.Raycast(ray, out hit, maxDistance, interactableLayer))
            {
                IInteractable interactable = hit.collider.GetComponent<IInteractable>();
                if (interactable == null)
                {
                    interactable = hit.collider.GetComponentInParent<IInteractable>();
                }

                if (interactable != null)
                {
                    currentInteractable = interactable;
                    ShowPrompt(interactable.GetInteractionText(), hit.point);
                    return;
                }
            }

            currentInteractable = null;
            HidePrompt();
        }

        public void TriggerInteraction()
        {
            if (currentInteractable != null)
            {
                currentInteractable.Interact();
            }
        }

        private void ShowPrompt(string text, Vector3 position)
        {
            if (promptTextGUI != null)
            {
                promptTextGUI.text = text;
            }
            if (interactionPromptContainer != null)
            {
                interactionPromptContainer.SetActive(true);
            }
            if (promptTextWorld != null)
            {
                promptTextWorld.gameObject.SetActive(true);
                promptTextWorld.text = text;
                promptTextWorld.transform.position = position + Vector3.up * 0.3f;
                promptTextWorld.transform.rotation = Quaternion.LookRotation(promptTextWorld.transform.position - playerCamera.transform.position);
            }
        }

        private void HidePrompt()
        {
            if (interactionPromptContainer != null)
            {
                interactionPromptContainer.SetActive(false);
            }
            if (promptTextWorld != null)
            {
                promptTextWorld.gameObject.SetActive(false);
            }
        }
    }
}
