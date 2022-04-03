using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;


[CreateAssetMenu(fileName = "VoidEvent", menuName = "ScriptableObjects/VoidEvent", order = 2)]
public class VoidEventSO : ScriptableObject
{
    public  UnityAction<string> OnEventRaised;

   public void RaiseEvent(string a)
    {
      
        if (OnEventRaised != null)
            OnEventRaised.Invoke(a);
    }
}
