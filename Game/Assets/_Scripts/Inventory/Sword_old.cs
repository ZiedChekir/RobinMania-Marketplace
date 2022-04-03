using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Sword_old : MonoBehaviour
{

    [SerializeField] private InputReaderSO inputReader;
    [SerializeField] private WeaponSO sword;
    public Transform tip;
    public void ResetAttack()
    {
        GetComponent<Animator>().SetBool("attack", false);
    }
    private void OnEnable()
    {
        
   
        //inputReader.PlayerAttackEvent += attack;
    }
    void attack(Weapon weapon,Vector2 dir, Quaternion rot)
    {

        GetComponent<Animator>().SetBool("attack",true);
       
        GameObject projectile = Instantiate(weapon.Projectile, tip.position, rot);
        


        projectile.GetComponent<projectile>().knockback_power = sword.KnockbackPower;
        projectile.GetComponent<projectile>().damage = sword.damage;
        //projectile.GetComponent<projectile>().AddForce((dir / dir.magnitude) * sword.projectileSpeed);


    }
    private void OnDisable()
    {
        //inputReader.PlayerAttackEvent -= attack;
    }

}
