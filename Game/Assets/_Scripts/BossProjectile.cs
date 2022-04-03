using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class  BossProjectile : MonoBehaviour
{



    [HideInInspector] public float DistanceBeforeDestruction;
    [HideInInspector] public Vector2 currentPos, spawningPos;
    [HideInInspector] public ProjectileFrom projectileFrom;
    [HideInInspector] public float knockback_power;
    [HideInInspector] public float damage;
    private float speed;
    [HideInInspector] public Vector2 direction;

    Collider2D colider;
    SpriteRenderer SR;

    public GameObject onDestroyEffect;
    public GameObject OnInstantiateEffect;

    public void InitializeProjectile(Vector2 dir, float speed, float damage, float knockback_power, ProjectileFrom sender, float distanceBeforeDestruction, Sprite sprite = null)
    {
        direction = dir;
        this.speed = speed;
        this.damage = damage;
        this.knockback_power = knockback_power;
        projectileFrom = sender;
        SetProjectileTag();
        this.DistanceBeforeDestruction = distanceBeforeDestruction;
        if (sprite != null)
            SR.sprite = sprite;
        ColiderReset();
        MoveProjectile(direction * speed);


    }
    void ColiderReset()
    {
        if (GetComponent<Collider2D>())
            Destroy(GetComponent<Collider2D>());

        colider = gameObject.AddComponent<BoxCollider2D>();
        colider.isTrigger = false;

    }
    void SetProjectileTag()
    {
        if (projectileFrom == ProjectileFrom.enemy)
        {
            gameObject.tag = "enemy_projectile";
        }
        else if (projectileFrom == ProjectileFrom.player)
        {
            gameObject.tag = "player_projectile";
        }
    }

    private void Awake()
    {
        InitializeComponents();
    }
    private void Start()
    {
        spawningPos = transform.position;
        Destroy(Instantiate(OnInstantiateEffect, transform.position, Quaternion.identity), 1);
    }

    private void Update()
    {

        currentPos.x = transform.position.x;
        currentPos.y = transform.position.y;

        if ((spawningPos - currentPos).magnitude > DistanceBeforeDestruction)
        {
            onDestroy();
        }


    }
    void MoveProjectile(Vector2 dir)
    {

        GetComponent<Rigidbody2D>().AddForce(dir);

    }

    void InitializeComponents()
    {


        if (GetComponent<SpriteRenderer>())
            SR = GetComponent<SpriteRenderer>();
        else
            SR = gameObject.AddComponent<SpriteRenderer>();

    }

    // void OnTriggerEnter2D(Collider2D col)
    // {
    //     if (!col.CompareTag("Player"))
    //     {
    //         onDestroy();
    //     }

    // }
    private void OnCollisionEnter2D(Collision2D other)
    {

        
    }


    private void OnTriggerEnter2D(Collider2D collision)
    {
        
    }
    void onDestroy()
    {

        Destroy(this.gameObject);
        Destroy(Instantiate(onDestroyEffect, transform.position, Quaternion.identity), 1);

    }
}
public enum ProjectileFrom { player, enemy }
