using UnityEngine;

namespace QBreak.Audio
{
    public class AudioManager : MonoBehaviour
    {
        public static AudioManager Instance { get; private set; }

        [Header("Audio Sources")]
        [SerializeField] private AudioSource sfxSource;
        [SerializeField] private AudioSource ambientSource;

        [Header("Sound Clips")]
        [SerializeField] private AudioClip basisShiftClip;
        [SerializeField] private AudioClip measurementClip;
        [SerializeField] private AudioClip flipClip;
        [SerializeField] private AudioClip doorOpenClip;
        [SerializeField] private AudioClip failureClip;
        [SerializeField] private AudioClip ambientDroneClip;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }

        private void Start()
        {
            if (ambientSource != null && ambientDroneClip != null)
            {
                ambientSource.clip = ambientDroneClip;
                ambientSource.loop = true;
                ambientSource.Play();
            }
        }

        public void PlayBasisShiftSound(bool isXBasis)
        {
            if (sfxSource != null && basisShiftClip != null)
            {
                sfxSource.pitch = isXBasis ? 1.2f : 0.8f;
                sfxSource.PlayOneShot(basisShiftClip);
            }
        }

        public void PlayMeasurementSound()
        {
            if (sfxSource != null && measurementClip != null)
            {
                sfxSource.pitch = 1.0f;
                sfxSource.PlayOneShot(measurementClip);
            }
        }

        public void PlayQuantumFlipSound()
        {
            if (sfxSource != null && flipClip != null)
            {
                sfxSource.pitch = 1.1f;
                sfxSource.PlayOneShot(flipClip);
            }
        }

        public void PlayDoorOpenSound()
        {
            if (sfxSource != null && doorOpenClip != null)
            {
                sfxSource.pitch = 1.0f;
                sfxSource.PlayOneShot(doorOpenClip);
            }
        }

        public void PlayFailureSound()
        {
            if (sfxSource != null && failureClip != null)
            {
                sfxSource.pitch = 0.9f;
                sfxSource.PlayOneShot(failureClip);
            }
        }
    }
}
