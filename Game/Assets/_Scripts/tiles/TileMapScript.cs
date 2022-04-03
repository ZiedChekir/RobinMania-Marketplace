using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Tilemaps;

public class TileMapScript : MonoBehaviour
{

    [SerializeField] TileEvents tileEvents;
    private Tilemap tilemap;


    private void Start()
    {
        this.transform.position = Vector2.zero;
        tilemap = GetComponent<Tilemap>();

        tilemap.CompressBounds();

    }

    private void OnCollisionEnter2D(Collision2D other)
    {

        if (other.transform.CompareTag("player_projectile") || other.transform.CompareTag("enemy_projectile"))
        {
            Vector3 hitPosition = Vector3.zero;
            ContactPoint2D hit = other.contacts[0];
            hitPosition.x = hit.point.x + .1f * hit.normal.x;
            hitPosition.y = hit.point.y + .1f * hit.normal.y;
            tileEvents.onTileHit(tilemap, hitPosition);

        }
    }
}
