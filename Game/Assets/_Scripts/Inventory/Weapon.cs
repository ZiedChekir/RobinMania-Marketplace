using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Weapon : Item
{

    public float damage;
    public float coolDown;
    public float ProjectileDistance;
    public GameObject Projectile;
    public float ProjectileSpeed;
    public float KnockbackPower;

    public float cooldownTimer;
    public Sprite ProjectileSprite;

    public Weapon(string name, int id, ItemType itemType, Sprite sprite,AudioCueSO audio, float damage , float coolDown , float projectileDistance , GameObject projectile , float projectileSpeed , float knockbackPower  , Sprite projectileSprite, AudioConfigSO config) : base(name, id, itemType, sprite,audio, config)
    {
        this.damage = damage;
        this.coolDown = coolDown;
        ProjectileDistance = projectileDistance;
        Projectile = projectile;
        ProjectileSpeed = projectileSpeed;
        KnockbackPower = knockbackPower;
        ProjectileSprite = projectileSprite;
    }

    public override void Attack()
    {
        base.Attack();
       
    }
}
