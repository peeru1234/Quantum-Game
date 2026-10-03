using UnityEngine;

namespace QBreak.Game
{
    [System.Serializable]
    public class SaveData
    {
        public int chapter = 1;
        public float masterVolume = 1.0f;
        public float sfxVolume = 1.0f;
        public float mouseSensitivity = 0.15f;
    }

    public class SaveManager : MonoBehaviour
    {
        public static SaveManager Instance { get; private set; }

        private const string SAVE_KEY = "QBREAK_SAVE_DATA";
        private SaveData currentSave = new SaveData();

        public SaveData CurrentSave => currentSave;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);
            Load();
        }

        public void Save()
        {
            string json = JsonUtility.ToJson(currentSave);
            PlayerPrefs.SetString(SAVE_KEY, json);
            PlayerPrefs.Save();
        }

        public void Load()
        {
            if (PlayerPrefs.HasKey(SAVE_KEY))
            {
                string json = PlayerPrefs.GetString(SAVE_KEY);
                currentSave = JsonUtility.FromJson<SaveData>(json);
            }
        }
    }
}
