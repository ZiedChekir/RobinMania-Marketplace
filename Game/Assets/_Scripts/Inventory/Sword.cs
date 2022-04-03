using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

public class Sword : Weapon
{
    public Sword(string name, int id, ItemType itemType, Sprite sprite,AudioCueSO audio,  float damage , float coolDown , float projectileDistance , GameObject projectile , float projectileSpeed , float knockbackPower , Sprite projectileSprite,AudioConfigSO config ) : base(name, id, itemType, sprite,audio, damage, coolDown, projectileDistance, projectile, projectileSpeed, knockbackPower, projectileSprite,config)
    {
    }

    public override void Attack()
    {
        if(Time.timeSinceLevelLoad >= cooldownTimer + coolDown)
        {
          
        }
    }

    public override void Buff()
    {
        Debug.Log("buff from sword");
    }
}

