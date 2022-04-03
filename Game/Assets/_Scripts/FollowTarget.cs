using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FollowTarget : MonoBehaviour
{
    [SerializeField] Transform Target;
    public Vector3 Offset;

    private void LateUpdate()
    {
        transform.position = Target.position;
       
    }
}
