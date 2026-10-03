using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace QBreak.Quantum
{
    public class QuantumEcho : MonoBehaviour
    {
        [Header("Echo Settings")]
        [SerializeField] private GameObject echoSilhouettePrefab;
        [SerializeField] private float maxRecordTime = 8.0f;
        [SerializeField] private MeshRenderer echoRenderer;

        private List<Vector3> recordedPositions = new List<Vector3>();
        private List<Quaternion> recordedRotations = new List<Quaternion>();
        private bool isRecording = false;
        private bool isPlayingBack = false;
        private Transform targetPlayer;

        public void StartRecording(Transform playerTransform)
        {
            targetPlayer = playerTransform;
            recordedPositions.Clear();
            recordedRotations.Clear();
            isRecording = true;
            StartCoroutine(RecordRoutine());
        }

        private IEnumerator RecordRoutine()
        {
            float elapsed = 0f;
            while (elapsed < maxRecordTime && isRecording)
            {
                if (targetPlayer != null)
                {
                    recordedPositions.Add(targetPlayer.position);
                    recordedRotations.Add(targetPlayer.rotation);
                }
                elapsed += Time.deltaTime;
                yield return null;
            }
            isRecording = false;
        }

        public void PlaybackEcho()
        {
            if (recordedPositions.Count == 0 || isPlayingBack) return;
            StartCoroutine(PlaybackRoutine());
        }

        private IEnumerator PlaybackRoutine()
        {
            isPlayingBack = true;
            if (echoSilhouettePrefab != null) echoSilhouettePrefab.SetActive(true);

            for (int i = 0; i < recordedPositions.Count; i++)
            {
                if (echoSilhouettePrefab != null)
                {
                    echoSilhouettePrefab.transform.position = recordedPositions[i];
                    echoSilhouettePrefab.transform.rotation = recordedRotations[i];
                }
                yield return null;
            }

            if (echoSilhouettePrefab != null) echoSilhouettePrefab.SetActive(false);
            isPlayingBack = false;
        }
    }
}
