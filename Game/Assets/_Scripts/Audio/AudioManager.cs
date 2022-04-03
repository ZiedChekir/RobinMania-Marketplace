using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AudioManager : MonoBehaviour
{
    // Start is called before the first frame update

    [SerializeField] AudioCueEventChannelSO _SfxChannel;
    [SerializeField] AudioCueEventChannelSO _MusicChannel;

    private List<SoundEmitter> SFXSoundEmitters = new List<SoundEmitter>();
    private List<SoundEmitter> MusicSoundEmitters = new List<SoundEmitter>();

    private GameObject AudioSourcesHolder;

    private void Start()
    {
        AudioSourcesHolder = new GameObject("AudioSourcesHolder");
    }

    void PlayAudio(List<SoundEmitter> SoundEmitters, AudioCueSO audioCue, AudioConfigSO config)
    {
        SoundEmitter tempSE = null;
        foreach (SoundEmitter soundEmitter in SoundEmitters)
        {
            if (!soundEmitter.isPlaying())
                tempSE = soundEmitter;

            if (soundEmitter.isPlaying(audioCue))
            {
                soundEmitter.Play(audioCue,config);
                return;
            }
        }
        if (tempSE != null)
            tempSE.Play(audioCue,config);
        else
        {
            SoundEmitter SE = AddSoundEmitter(SoundEmitters);
            SE.Play(audioCue,config);
            return;
        }
    }
    void PlayAudioSFX(AudioCueSO audioCue, AudioConfigSO config)
    {
        PlayAudio(SFXSoundEmitters, audioCue, config);

    }
    void PlayAudioMusic(AudioCueSO audioCue, AudioConfigSO config)
    {
        PlayAudio(MusicSoundEmitters, audioCue, config);

    }

    SoundEmitter AddSoundEmitter(List<SoundEmitter> SoundEmitters)
    {
        SoundEmitter x = new GameObject("audioEmitter").AddComponent<SoundEmitter>();
        x.transform.parent = AudioSourcesHolder.transform;
        SoundEmitters.Add(x);
        return x;
    }



    public void StopAll()
    {
        StopAllMusic();
        StopAllSFX();
    }

    void StopAllSFX()
    {
        foreach (SoundEmitter se in SFXSoundEmitters)
        {
            se.Stop();
        }
    }

    void StopAllMusic()
    {
        foreach (SoundEmitter se in MusicSoundEmitters)
        {
            se.Stop();
        }
    }
    void StopSFX(AudioCueSO audio)
    {
        foreach (SoundEmitter se in SFXSoundEmitters)
        {
            if (se.isPlaying(audio))
                se.Stop();
        }
    }

    void StopMusic(AudioCueSO audio)
    {
        foreach (SoundEmitter se in MusicSoundEmitters)
        {
            if (se.isPlaying(audio))
                se.Stop();
        }
    }
    private void OnEnable()
    {
        _SfxChannel.audioEvent += PlayAudioSFX;
        _MusicChannel.audioEvent += PlayAudioMusic;
    }


    private void OnDisable()
    {
        _SfxChannel.audioEvent -= PlayAudioSFX;
        _MusicChannel.audioEvent -= PlayAudioMusic;

    }
}
