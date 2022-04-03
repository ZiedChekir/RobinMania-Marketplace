
using UnityEngine;
using UnityEngine.Tilemaps;

[CreateAssetMenu(fileName = "tiles", menuName = "ScriptableObjects/Tiles", order = 1)]

public class TileSO : ScriptableObject
{
    public int TileID;
    public Tile tile;
    public bool destroyable;
    public float maxHealth;
    public bool haveLoot;
    public GameObject loot;
    public bool respawnable;
    public float respawnTime;
    public GameObject HitParticleEffect;
}
