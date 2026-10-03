using System.Collections;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace QBreak.UI
{
    public class MainMenu3DManager : MonoBehaviour
    {
        [Header("Cinematic Camera")]
        [SerializeField] private Transform cinematicCameraTransform;
        [SerializeField] private Transform cameraOrbitTarget;
        [SerializeField] private float orbitSpeed = 5.0f;
        [SerializeField] private float orbitRadius = 8.0f;
        [SerializeField] private float orbitHeight = 2.5f;

        [Header("3D Title Animation")]
        [SerializeField] private Transform titleTransform;
        [SerializeField] private float titleFloatSpeed = 1.5f;
        [SerializeField] private float titleFloatAmplitude = 0.1f;

        [Header("Scene Transition Settings")]
        [SerializeField] private string gameplaySceneName = "GameScene";
        [SerializeField] private CanvasGroup fadeCanvasGroup;

        private bool isTransitioning = false;
        private float angle = 0f;

        private void Update()
        {
            if (isTransitioning) return;

            // Slow cinematic orbit around central Quantum Core
            if (cinematicCameraTransform != null && cameraOrbitTarget != null)
            {
                angle += orbitSpeed * Time.deltaTime;
                float radians = angle * Mathf.Deg2Rad;

                Vector3 targetPos = cameraOrbitTarget.position + new Vector3(
                    Mathf.Cos(radians) * orbitRadius,
                    orbitHeight,
                    Mathf.Sin(radians) * orbitRadius
                );

                cinematicCameraTransform.position = Vector3.Lerp(cinematicCameraTransform.position, targetPos, Time.deltaTime * 2f);
                cinematicCameraTransform.LookAt(cameraOrbitTarget.position + Vector3.up * 1.5f);
            }

            // Floating title animation
            if (titleTransform != null)
            {
                float y = Mathf.Sin(Time.time * titleFloatSpeed) * titleFloatAmplitude;
                titleTransform.localPosition = new Vector3(titleTransform.localPosition.x, y, titleTransform.localPosition.z);
                titleTransform.Rotate(Vector3.up, 5f * Time.deltaTime);
            }
        }

        public void StartGame()
        {
            if (isTransitioning) return;
            StartCoroutine(PerformStartGameTransition());
        }

        private IEnumerator PerformStartGameTransition()
        {
            isTransitioning = true;

            // Fast camera zoom towards core
            float timer = 0f;
            float duration = 1.5f;
            Vector3 startCamPos = cinematicCameraTransform.position;
            Vector3 endCamPos = cameraOrbitTarget != null ? cameraOrbitTarget.position + Vector3.forward * 2f : startCamPos + Vector3.forward * 5f;

            while (timer < duration)
            {
                timer += Time.deltaTime;
                float progress = timer / duration;

                if (cinematicCameraTransform != null)
                {
                    cinematicCameraTransform.position = Vector3.Lerp(startCamPos, endCamPos, progress * progress);
                }

                if (fadeCanvasGroup != null)
                {
                    fadeCanvasGroup.alpha = progress;
                }

                yield return null;
            }

            // Load GameScene synchronously or asynchronously
            SceneManager.LoadScene(gameplaySceneName);
        }
    }
}
