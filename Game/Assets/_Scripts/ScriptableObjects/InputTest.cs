using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class InputTest : MonoBehaviour
{
    public InputReaderSO inputReader;


    private void Awake()
    {
        
    }

    private void Update()
    {
        if (Input.GetMouseButton(0))
        {
           // inputReader.onAttack();
        }
    }


}
