using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[CreateAssetMenu()]
public class ItemSO : ScriptableObject
{

    public string Name;
    public int id;
    public ItemType itemType;
    public float damage;
    public float healthbuff;
    public Sprite sprite;
    public bool stackable;
    public AudioCueSO audio;
    public AudioConfigSO audioConfig;
    public float coolDown;
    public float ProjectileDistance;
    public GameObject Projectile;
    public Sprite ProjectileSprite;
    public float ProjectileSpeed;
    public float KnockbackPower;
    public AnimatorOverrideController AttackAnim;

    


}
