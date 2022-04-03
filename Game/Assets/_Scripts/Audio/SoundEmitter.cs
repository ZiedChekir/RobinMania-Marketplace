using UnityEngine;

public class SoundEmitter: MonoBehaviour
{

    private AudioSource audioSource;

    private AudioCueSO audioCue;

    private int currentNumberOfInstancesPlaying = 0;

    private void OnEnable()
    {
        if(!TryGetComponent<AudioSource>(out audioSource))
        {
            audioSource = gameObject.AddComponent<AudioSource>();
        }
       
    }

    public bool isPlaying()
    {
        return audioSource.isPlaying;
    }
    public bool isPlaying(AudioCueSO audioCueSo)
    {
        return audioCue == audioCueSo && isPlaying();
    }

    public void Play(AudioCueSO audioCueSO,AudioConfigSO config)
    {
        if (isPlaying(audioCueSO) 
            && audioCueSO.maxNumberOfInstancesPlayingAtTheSameTime > currentNumberOfInstancesPlaying)
        {
            audioCue = audioCueSO;
            currentNumberOfInstancesPlaying++;
            ApplyConfig(config);
            if (!audioCueSO.looping)
                audioSource.PlayOneShot(audioCueSO.GetNextClip());
            else
            {
                audioSource.loop = true;
                audioSource.clip = audioCueSO.GetNextClip();
                audioSource.Play();
            }
        }
        else if (!isPlaying())
        {
            audioCue = audioCueSO;
            currentNumberOfInstancesPlaying = 0;
            ApplyConfig(config);
            if (!audioCueSO.looping)
                audioSource.PlayOneShot(audioCueSO.GetNextClip());
            else
            {
                audioSource.loop = true;
                audioSource.clip = audioCueSO.GetNextClip();
                audioSource.Play();
            }
        }
        else
        {
            print("too much instances are playing at the same time");
        }

    }
    public void ApplyConfig(AudioConfigSO config)
    {
        config.ApplyTo(audioSource);
    }


    public void Stop()
    {
        audioSource.Stop();
    }
}
