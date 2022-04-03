using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;
public class NavMeshController : MonoBehaviour
{
     NavMeshSurface2d Surface2D;
    public InputReaderSO Events;

    void Start()
    {
        Surface2D = GetComponent<NavMeshSurface2d>();
        Surface2D.BuildNavMeshAsync();
        
    }

    // Update is called once per frame
  

    void HandleSurfaceUpdate()
    {
        StartCoroutine(DelayedSurfaceUpdate());
    }
    IEnumerator DelayedSurfaceUpdate()
    {
        yield return new WaitForSeconds(.1f);
        Surface2D.UpdateNavMesh(Surface2D.navMeshData);
    }
    private void OnEnable()
    {
        Events.SurfaceUpdatedEvent += HandleSurfaceUpdate;

    }
    private void OnDisable()
    {
        Events.SurfaceUpdatedEvent -= HandleSurfaceUpdate;

    }
}
