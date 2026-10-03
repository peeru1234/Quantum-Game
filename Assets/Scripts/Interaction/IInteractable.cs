using UnityEngine;

namespace QBreak.Interaction
{
    public interface IInteractable
    {
        string GetInteractionText();
        void Interact();
        Vector3 GetPosition();
    }
}
