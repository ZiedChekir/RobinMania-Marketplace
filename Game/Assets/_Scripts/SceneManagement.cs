using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
public class SceneManagement : MonoBehaviour
{
    [SerializeField] AudioCueSO Music;
    [SerializeField] AudioConfigSO config;

    [SerializeField] AudioCueEventChannelSO MusicEventChannel;


    private void Start()
    {
        StartCoroutine(lateMusicCall());
    }

    IEnumerator lateMusicCall()
    {
        yield return new WaitForSeconds(1);
        MusicEventChannel.Raise(Music, config);
    }

}
