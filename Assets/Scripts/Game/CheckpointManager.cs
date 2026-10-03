using UnityEngine;

namespace QBreak.Game
{
    public class CheckpointManager : MonoBehaviour
    {
        public static CheckpointManager Instance { get; private set; }

        [Header("Checkpoint Data")]
        private Vector3 lastCheckpointPosition;
        private Quaternion lastCheckpointRotation;
        private int currentChapter = 1;

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

        public void SaveCheckpoint(Vector3 position, Quaternion rotation, int chapter)
        {
            lastCheckpointPosition = position;
            lastCheckpointRotation = rotation;
            currentChapter = chapter;
            Debug.Log($"[CheckpointManager] Checkpoint saved at Ch.{chapter} ({position})");
        }

        public void RestoreLastCheckpoint()
        {
            GameObject player = GameObject.FindWithTag("Player");
            if (player != null)
            {
                CharacterController cc = player.GetComponent<CharacterController>();
                if (cc != null) cc.enabled = false;

                player.transform.position = lastCheckpointPosition;
                player.transform.rotation = lastCheckpointRotation;

                if (cc != null) cc.enabled = true;
                Debug.Log("[CheckpointManager] Player restored to last checkpoint.");
            }
        }
    }
}
