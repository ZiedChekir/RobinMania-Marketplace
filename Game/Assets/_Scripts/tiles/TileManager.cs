using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Tilemaps;
public class TileManager : MonoBehaviour
{
    [SerializeField] TileEvents tileEvents;
    private Dictionary<Vector3Int, TileInstance> TileListDestroyable = new Dictionary<Vector3Int, TileInstance>();

    public static Dictionary<Tile, TileSO> TileDatabase = new Dictionary<Tile, TileSO>();

    public Tilemap DestroyableTilemap;

    //respawn variables
    public List<TileInRespawnQueue> RespawnQueue = new List<TileInRespawnQueue>();

    private const int RespawnQueueInterval = 5;
    private float RespawnQueueTimer;


    [SerializeField] Transform TilemapHolder;
    Tilemap[] Tilemaps;

    [SerializeField] InputReaderSO Events;


    //in the future load all the tilemap layers not only the destroyable tilemap 
    //for building and farming system
    void LoadDestroyableTilesinList()
    {

        var tilesSOs = Resources.LoadAll<TileSO>("tiles");
        foreach (var tileSo in tilesSOs)
        {
            TileDatabase.Add(tileSo.tile, tileSo);
        }
        foreach (var position in DestroyableTilemap.cellBounds.allPositionsWithin)
        {
            if (!DestroyableTilemap.HasTile(position))
            {
                continue;
            }
            if (TileDatabase.ContainsKey(DestroyableTilemap.GetTile<Tile>(position)))
            {
                TileListDestroyable.Add((Vector3Int)position, new TileInstance(TileDatabase[DestroyableTilemap.GetTile<Tile>(position)]));
            }

        }
    }


    private void Start()
    {
        LoadDestroyableTilesinList();
        RespawnQueueTimer = Time.timeSinceLevelLoad;
        Tilemaps = new Tilemap[TilemapHolder.childCount];
        for (int i = 0; i < TilemapHolder.childCount; i++)
        {

            Tilemaps[i] = TilemapHolder.GetChild(i).GetComponent<Tilemap>();
        }


    }

    private void LateUpdate()
    {
        HandleRespawn();

        //if (Input.GetMouseButtonDown(1))
        //{
        //    Vector3 x = Camera.main.ScreenToWorldPoint(Input.mousePosition);
        //    x.z = 0;
        //    //print(Tilemaps[3].WorldToCell(x));
        //    ////print(DestroyableTilemap.GetTile(DestroyableTilemap.WorldToCell(Camera.main.ScreenToWorldPoint(Input.mousePosition))));
        //    //print(Tilemaps[3].GetTile(Tilemaps[3].WorldToCell(x)));

        //    print(GetTileInfo(x));

        //}

    }

    void HandleTileHit(Tilemap tilemap, Vector3 pos)
    {

        if (!tilemap.HasTile(tilemap.WorldToCell(pos)))
        {
            return;
        }

        if (!TileListDestroyable.ContainsKey(tilemap.WorldToCell(pos)))
        {
            return;
        }

        TileInstance tileHitInstance = TileListDestroyable[tilemap.WorldToCell(pos)];
        Destroy(Instantiate(tileHitInstance.tileData.HitParticleEffect, pos, Quaternion.identity), 1);
        tileHitInstance.currentHealth--;
        //instantiate particle Effect
        if (tileHitInstance.currentHealth <= 0)
        {
            if (tileHitInstance.tileData.respawnable)
            {
                PushTileInstanceToRespawnQueue(tileHitInstance.tileData.tile, Time.timeSinceLevelLoad + tileHitInstance.tileData.respawnTime, tilemap.WorldToCell(pos), tilemap);
            }
            TileListDestroyable.Remove(tilemap.WorldToCell(pos));
            tilemap.SetTile(tilemap.WorldToCell(pos), null);


            Events.onSurfaceUpdated();
            //remove tile from tileListDestroyable or handle respawn
        }



    }



    void PushTileInstanceToRespawnQueue(Tile tile, float timeToBeResapwnedAt, Vector3Int position, Tilemap tilemap)
    {
        RespawnQueue.Add(new TileInRespawnQueue(tile, timeToBeResapwnedAt, position, tilemap));
    }



    void HandleRespawn()
    {
        if (Time.timeSinceLevelLoad > RespawnQueueTimer + RespawnQueueInterval)
        {
            RespawnQueueTimer = Time.timeSinceLevelLoad;
            if (RespawnQueue.Count > 0)
            {
                for (int i = 0; i < RespawnQueue.Count; i++)

                {
                    if (RespawnQueue[i].TimeToBeRespawned <= Time.timeSinceLevelLoad)
                    {
                        if (!RespawnQueue[i].tilemap.HasTile(RespawnQueue[i].SpawnPosition)
                            && !TileListDestroyable.ContainsKey(RespawnQueue[i].SpawnPosition))
                        {

                            Vector3 raycastOrigin = new Vector3(RespawnQueue[i].SpawnPosition.x + 0.5f, RespawnQueue[i].SpawnPosition.y + 0.5f, -10);

                            RaycastHit2D hit = Physics2D.Raycast(raycastOrigin, Vector3.forward);

                            if (!hit.collider)
                            {


                                TileListDestroyable.Add(RespawnQueue[i].SpawnPosition, new TileInstance(TileDatabase[RespawnQueue[i].tile]));
                                RespawnQueue[i].tilemap.SetTile(RespawnQueue[i].SpawnPosition, RespawnQueue[i].tile);
                                
                                RespawnQueue.RemoveAt(i);

                                Events.onSurfaceUpdated();
                            }
                            else
                            {
                                RespawnQueue[i].attempts++;
                            }
                        }
                        else
                        {
                            RespawnQueue[i].attempts++;
                        }
                    }
                }
            }
        }
    }


    Tile GetTileInfo(Vector3 position)
    {
        position.z = 0;
        int maxSortingLayer = -1000;
        Tile temp = null;
        for (int i = 0; i < Tilemaps.Length; i++)
        {
            if (Tilemaps[i].GetComponent<TilemapRenderer>().sortingOrder >= maxSortingLayer 
                && Tilemaps[i].GetTile(Tilemaps[i].WorldToCell(position)) != null)
            {
                maxSortingLayer = Tilemaps[i].GetComponent<TilemapRenderer>().sortingOrder;
                temp = (Tile)Tilemaps[i].GetTile(Tilemaps[i].WorldToCell(position));
            }
        }
        return temp;

    }
    private void OnEnable()
    {
        tileEvents.TileHitEvent += HandleTileHit;
    }
    private void OnDisable()
    {
        tileEvents.TileHitEvent -= HandleTileHit;
    }
}
