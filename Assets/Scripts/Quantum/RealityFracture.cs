using UnityEngine;
using QBreak.Interaction;

namespace QBreak.Quantum
{
    public class RealityFracture : MonoBehaviour, IInteractable
    {
        [Header("Fracture Visuals")]
        [SerializeField] private Transform fractureGeometry;
        [SerializeField] private ParticleSystem energyParticles;
        [SerializeField] private GameObject alternatePathwayObject;

        private bool isOpen = false;

        private void Update()
        {
            if (fractureGeometry != null)
            {
                fractureGeometry.Rotate(Vector3.up, 30f * Time.deltaTime);
                fractureGeometry.Rotate(Vector3.right, 15f * Time.deltaTime);
            }
        }

        public string GetInteractionText()
        {
            return isOpen ? "[E] REALITY FRACTURE STABILIZED" : "[E] ENTER REALITY FRACTURE";
        }

        public Vector3 GetPosition()
        {
            return transform.position;
        }

        public void Interact()
        {
            isOpen = !isOpen;
            if (alternatePathwayObject != null)
            {
                alternatePathwayObject.SetActive(isOpen);
            }
            if (energyParticles != null)
            {
                if (isOpen) energyParticles.Play();
                else energyParticles.Stop();
            }
        }
    }
}
