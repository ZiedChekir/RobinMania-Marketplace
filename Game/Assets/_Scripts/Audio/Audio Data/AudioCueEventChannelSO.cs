
using UnityEngine;
using UnityEngine.Events;

[CreateAssetMenu(menuName = "Audio/Audio Channel Event")]

public class AudioCueEventChannelSO :ScriptableObject
{
    public event UnityAction<AudioCueSO,AudioConfigSO> audioEvent;

    public void Raise(AudioCueSO audioCue,AudioConfigSO config)
    {
        if (audioEvent != null)
        {
            audioEvent.Invoke(audioCue,config);
        }
    }

}

