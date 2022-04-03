using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.Tilemaps;

[CreateAssetMenu(fileName = "Input", menuName = "ScriptableObjects/Events", order = 2)]
public class TileEvents : ScriptableObject
{
    public event UnityAction<Tilemap,Vector3> TileHitEvent;

    public void onTileHit(Tilemap tilemap, Vector3 tilePos)
    {
        if (TileHitEvent != null)
            TileHitEvent.Invoke(tilemap,tilePos);
    }
}
