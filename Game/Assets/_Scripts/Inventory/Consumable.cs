using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

public class Consumable : Item
{
    public float HealthBuff;
    public float cooldownTimer;
    public float coolDown;
    public Consumable(string name, int id, ItemType itemType,  Sprite spritee,AudioCueSO audio,float healthBuff,float coolDown, AudioConfigSO config) : base(name, id, itemType,  spritee,audio,config)
    {
        this.HealthBuff = healthBuff;
        this.coolDown = coolDown;
        cooldownTimer = Time.timeSinceLevelLoad - coolDown ;
    }

    public override void Buff()
    {
        Debug.Log("buff from consumable");
    }
}

