using UnityEngine.Tilemaps;
using UnityEngine;

public class TileInRespawnQueue
{
    public Tile tile;
    public float TimeToBeRespawned;
    public int attempts;
    public Vector3Int SpawnPosition;
    public Tilemap tilemap;

    public TileInRespawnQueue(Tile tile, float timeToBeRespawned, Vector3Int SpawnPosition, Tilemap tilemap)
    {
        this.tile = tile;
        TimeToBeRespawned = timeToBeRespawned;
        this.attempts = 0;
        this.SpawnPosition = SpawnPosition;
        this.tilemap = tilemap;
    }
}