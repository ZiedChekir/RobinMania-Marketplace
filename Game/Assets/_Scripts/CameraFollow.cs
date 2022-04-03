
using UnityEngine;

public class CameraFollow : MonoBehaviour
{
    public GameObject target;
    public Vector3 offset = new Vector3(0, 0, -1);

    // Use this for initialization
    void Start()
    {
    }

    // Update is called once per frame
    void FixedUpdate()
    {
        if (target)
        {
            // Always Update to Exactly Targets Position + Offset
            transform.position = new Vector3(
                target.transform.position.x + offset.x,
                target.transform.position.y + offset.y,
                target.transform.position.z + offset.z);
        }
    }
}