using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Toast : MonoBehaviour
{
    public float timeAtCreation;
    public TMPro.TMP_Text text;

    public void UpdateText(string text)
    {
       this.text.text = text;
        timeAtCreation = Time.time;
    }

}
