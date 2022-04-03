using System.Collections;
using System.Collections.Generic;
using UnityEngine;
[CreateAssetMenu()]
public class WeaponSO : ScriptableObject
{
    public int ID;
    public string Name;
    public AnimationClip Animation;
    
    public Sprite sprite;
    public float damage;
    public float RecoilTime;
    public float KnockbackPower;

    public GameObject Projectile;
    public float projectileSpeed;


}
