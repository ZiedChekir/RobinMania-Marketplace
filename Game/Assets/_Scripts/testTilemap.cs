using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Tilemaps;

public class testTilemap : MonoBehaviour
{
    public VoidEventSO a;

    private void OnEnable()
    {
        a.OnEventRaised += x;
    }
    private void OnDisable()
    {
        a.OnEventRaised -= x;
    }
    void x (string a)
    {
        print(a);
    }
}
