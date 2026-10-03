using UnityEngine;
using TMPro;

namespace QBreak.AI
{
    public class QIRobot : MonoBehaviour
    {
        [Header("Hover Animation")]
        [SerializeField] private float hoverAmplitude = 0.15f;
        [SerializeField] private float hoverFrequency = 2.0f;
        [SerializeField] private Transform gyroscopeRing;
        [SerializeField] private Light eyeLight;

        [Header("Dialogue HUD")]
        [SerializeField] private TextMeshPro dialogueText;

        private Vector3 startPos;

        private void Start()
        {
            startPos = transform.position;
        }

        private void Update()
        {
            float t = Time.time;
            transform.position = startPos + new Vector3(0f, Mathf.Sin(t * hoverFrequency) * hoverAmplitude, 0f);

            if (gyroscopeRing != null)
            {
                gyroscopeRing.Rotate(Vector3.up, 180f * Time.deltaTime);
                gyroscopeRing.Rotate(Vector3.right, 90f * Time.deltaTime);
            }
        }

        public void SetHint(string hint)
        {
            if (dialogueText != null)
            {
                dialogueText.text = hint;
            }
        }
    }
}
