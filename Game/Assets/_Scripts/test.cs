using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class test : MonoBehaviour
{
    public AudioCueEventChannelSO sfx;
    public AudioCueEventChannelSO music;

    public AudioCueSO[] a;

    public AudioConfigSO config;


    private void Start()
    {

    }

    private void Update()
    {
        if (Input.GetKeyDown(KeyCode.A))
            sfx.Raise(a[Random.Range(0, a.Length)],config);
        if (Input.GetKeyDown(KeyCode.Z))
            music.Raise(a[Random.Range(0, a.Length)],config);
        
    }

}

    



