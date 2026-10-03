using UnityEngine;
using UnityEngine.Events;
using TMPro;

namespace QBreak.UI
{
    public class Terminal3D : MonoBehaviour
    {
        [Header("Terminal Configuration")]
        [SerializeField] private string terminalTitle = "TERMINAL";
        [SerializeField] private TextMeshPro titleText;
        [SerializeField] private MeshRenderer frameRenderer;
        [SerializeField] private Light terminalLight;
        [SerializeField] private UnityEvent onSelected;

        private bool isHovered = false;
        private Color defaultColor = new Color(0f, 0.95f, 1f, 0.4f);
        private Color hoverColor = new Color(1f, 0f, 0.63f, 0.8f);

        private void Start()
        {
            if (titleText != null)
            {
                titleText.text = terminalTitle;
            }
        }

        private void OnMouseEnter()
        {
            isHovered = true;
            if (terminalLight != null) terminalLight.intensity = 3f;
            if (frameRenderer != null && frameRenderer.material != null)
            {
                frameRenderer.material.color = hoverColor;
            }
        }

        private void OnMouseExit()
        {
            isHovered = false;
            if (terminalLight != null) terminalLight.intensity = 1.5f;
            if (frameRenderer != null && frameRenderer.material != null)
            {
                frameRenderer.material.color = defaultColor;
            }
        }

        private void OnMouseDown()
        {
            onSelected?.Invoke();
        }

        public void TriggerSelect()
        {
            onSelected?.Invoke();
        }
    }
}
