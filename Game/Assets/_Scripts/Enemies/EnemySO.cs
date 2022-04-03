using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[CreateAssetMenu(fileName = "enemies", menuName = "ScriptableObjects/Enemies", order = 3)]
public class EnemySO : ScriptableObject
{
    public string Name;
    public int EnemyID;
    public EnemyType enemyType;


    public Sprite EnemySrptie;
    

    public float EnemySpeed;
    public float MaxHealth;

    public float Damage;
    public float TimeBetweenAttacks;
    public GameObject Projectile;

    public float sightRange;
    public float attackRange;
    public PatrolType patrolType;

    public AnimatorOverrideController animator;


}

public enum EnemyType { melee , ranged,boss}
public enum PatrolType { PatrolPoints, wander }