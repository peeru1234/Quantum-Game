using UnityEngine;

namespace QBreak.Quantum
{
    public class EntangledObject : MonoBehaviour
    {
        [Header("Entanglement Links")]
        [SerializeField] private EntangledObject pairedPartner;
        [SerializeField] private LineRenderer entanglementBeam;
        [SerializeField] private Transform coreMesh;

        [Header("Entangled State")]
        [SerializeField] private bool isPrimaryNode = true;

        private void Update()
        {
            if (coreMesh != null)
            {
                float speed = isPrimaryNode ? 90f : -90f;
                coreMesh.Rotate(Vector3.up, speed * Time.deltaTime);
            }

            if (entanglementBeam != null && pairedPartner != null)
            {
                entanglementBeam.SetPosition(0, transform.position);
                entanglementBeam.SetPosition(1, pairedPartner.transform.position);
            }
        }

        public void NotifyStateChanged(StateType newState)
        {
            if (pairedPartner != null && isPrimaryNode)
            {
                pairedPartner.ReceiveEntangledState(newState);
            }
        }

        public void ReceiveEntangledState(StateType state)
        {
            // Partner receives inverted or correlated phase
            StateType inverted = QuantumMath.QuantumFlip(state);
            Debug.Log($"[EntangledObject] Node {gameObject.name} entangled state synchronized to: {inverted}");
        }
    }
}
