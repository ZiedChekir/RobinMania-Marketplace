using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;
using DG.Tweening;

public class Boss : MonoBehaviour
{

    int currentBossState;
    bool isStateSet;
    public float raduis;
    public GameObject Projectile;
    public int MaxNumberOfProjectiles;
    public int MinNumberOfProjectiles;
    [SerializeField] Transform ProjectileParent;
    Transform[] Projectiles;
    public float minSpeedProjectile;
    [SerializeField] Transform player;
    SpriteRenderer SR;
    [SerializeField] private EnemyHealth enemyHealth;
    public float maxSpeedProjectile;
    private NavMeshAgent agent;
    private bool canChargeAtPlayer;
    private float Health = 60;
    public InputReaderSO inputEvents;
    private bool alreadyAttacked;
    public float timeBetweenAttacks = .5f;

    public float AttackRange;
    private Animator anim;

    public GameObject WinPanel;


    public float Attack1Duration;
    public float Attack2Duration;
    public float ChargeDuration;
    public float SpawnDuration;
    
    // Start is called before the first frame update
    void Start()
    {
        SR = GetComponent<SpriteRenderer>();
        currentBossState = SetBossState(-1);
        isStateSet = true;
        agent = GetComponent<NavMeshAgent>();
        enemyHealth.InitHealth(Health, Health);
        anim = GetComponent<Animator>();
      
    }

    // Update is called once per frame
    void Update()
    {
        if (isStateSet)
        {
            isStateSet = false;
            if (currentBossState == 0)
            {
                attack1();

            }
            else if (currentBossState == 1)
            {
                attack2();
                
            }
            else if (currentBossState == 2)
            {


                canChargeAtPlayer = true;
                StartCoroutine(ResetState(ChargeDuration));
            }
            else if (currentBossState == 3)
            {
                SpawnEnemies();
                StartCoroutine(ResetState(SpawnDuration));
            }
        }
        SetAnimation();
        //if (canChargeAtPlayer)
        //    //chargeAtPlayer();
    }
    bool isMoving()
    {
        return agent.velocity != Vector3.zero;
    }

    void SetAnimation()
    {
       

        if (isMoving())
        {
         
            anim.SetBool("isWalking", true);
        }
        else
        {
            anim.SetBool("isWalking", false);
        }

    

            if (transform.position.x - agent.destination.x > 0 && isMoving())
            {
                SR.flipX = true;
            }

            else if (isMoving())
            {
                SR.flipX = false;
            }

        
        

    }

   
    private void SpawnEnemies()
    {
        inputEvents.onEnemySpawn(4, Random.Range(0, 2)) ;
    }

    private void chargeAtPlayer()
    {

        agent.SetDestination(player.position);
        if (!alreadyAttacked && Vector2.Distance(transform.position, player.position) <= AttackRange)
        {
            player.GetComponent<PlayerController>().UpdatePlayerHealth(-10);
            alreadyAttacked = true;
            Invoke(nameof(ResetAttack), timeBetweenAttacks);
            alreadyAttacked = true;
        }
      

    }
    void ResetAttack()
    {
        alreadyAttacked = false;
    }


    private void OnCollisionEnter2D(Collision2D other)
    {
        if (other.gameObject.CompareTag("player_projectile"))
        {

            EnemyGotHit(other.gameObject);
        }
    }
    private void OnTriggerEnter2D(Collider2D other)
    {
        if (other.gameObject.CompareTag("player_projectile"))
        {

            EnemyGotHit(other.gameObject);
        }
    }
    void EnemyGotHit(GameObject other)
    {
        //  anim.SetBool("isHit", true);
      
        StartCoroutine(EnemyHitFlash());
        transform.DOScale(new Vector2(.7f, 1.3f), .1f).OnComplete(() => { transform.DOScale(1, .1f); });
        projectile proj = other.gameObject.GetComponent<projectile>();

        ReduceEnemyHealth(proj.damage);




    }

    void ReduceEnemyHealth(float value)
    {
        Health -= value;
        enemyHealth.SetHealth(Health);
        if (Health <= 0)
        {
            EnemyDead();
        }
    }


    void EnemyDead()
    {
        // rb.bodyType = RigidbodyType2D.Static;
        transform.DORotate(new Vector3(0, 0, 180), .5f).OnComplete(() => { DestroyEnemyOnDeathAnimationFinished(); });
        //anim.SetBool("isDead",true);

        WinPanel.SetActive(true);

    }

    public void DestroyEnemyOnDeathAnimationFinished()
    {
        Destroy(this.gameObject);
    }
    IEnumerator EnemyHitFlash()
    {

        SR.color = Color.red;

        yield return new WaitForSeconds(0.1f);
        SR.color = Color.white;

        // transform.localScale = new Vector3(1 * Mathf.Sign(transform.localScale.x), 1, 1);
    }

    private void attack2()
    {
        int NumberOfProjectiles = Random.Range(MinNumberOfProjectiles, MaxNumberOfProjectiles);
        Projectiles = new Transform[NumberOfProjectiles];
        float x0 = transform.position.x;
        float y0 = transform.position.y;
        float angularDistanceBetweenProjectiles = 2 * Mathf.PI / NumberOfProjectiles;

        float angle = Random.Range(0, 2 * Mathf.PI);
        for (int i = 0; i < NumberOfProjectiles; i++)
        {
            float x = x0 + raduis * Mathf.Cos(angle + i * angularDistanceBetweenProjectiles);
            float y = y0 + raduis * Mathf.Sin(angle + i * angularDistanceBetweenProjectiles);
            Quaternion desiredRot = Quaternion.Euler(0, 0, Mathf.Rad2Deg * (angle + i * angularDistanceBetweenProjectiles));

            Projectiles[i] = Instantiate(Projectile, new Vector2(x, y), desiredRot, ProjectileParent).transform;
        }
        ProjectileParent.DORotate(new Vector3(0, 0, 180), 1).OnComplete(() =>
        {
            float speedProjectile = Random.Range(minSpeedProjectile, maxSpeedProjectile);
            foreach (Transform proj in ProjectileParent)
            {
                Vector3 dir = (proj.position - transform.position) / (proj.position - transform.position).magnitude;
                Vector3 perpondicular = Vector2.Perpendicular(dir);
                Vector3[] path = new Vector3[] { proj.position + dir * 10 + perpondicular * 15, proj.position, proj.position + dir * 10 };

                proj.DOPath(path, speedProjectile, PathType.CubicBezier).OnComplete(() =>
                {
                    Destroy(proj.gameObject);
                    ProjectileParent.rotation = Quaternion.Euler(0, 0, 0);
                });

            }


        });
        StartCoroutine(ResetState(Attack2Duration));
    }

    private void attack1()
    {
        int NumberOfProjectiles = Random.Range(MinNumberOfProjectiles, MaxNumberOfProjectiles);
        Projectiles = new Transform[NumberOfProjectiles];
        Projectiles = new Transform[NumberOfProjectiles];
        float x0 = transform.position.x;
        float y0 = transform.position.y;
        float angularDistanceBetweenProjectiles = 2 * Mathf.PI / NumberOfProjectiles;

        float angle = Random.Range(0, 2 * Mathf.PI);
        for (int i = 0; i < NumberOfProjectiles; i++)
        {
            float x = x0 + raduis * Mathf.Cos(angle + i * angularDistanceBetweenProjectiles);
            float y = y0 + raduis * Mathf.Sin(angle + i * angularDistanceBetweenProjectiles);
            Quaternion desiredRot = Quaternion.Euler(180, 0, Mathf.Rad2Deg * (angle + i * angularDistanceBetweenProjectiles));
            
            Projectiles[i] = Instantiate(Projectile, new Vector3(x, y,0), desiredRot, ProjectileParent).transform;
            
        }
        ProjectileParent.DORotate(new Vector3(0, 0, 180), 1).OnComplete(() =>
        {
            float speedProjectile = Random.Range(minSpeedProjectile, maxSpeedProjectile);

            foreach (Transform proj in ProjectileParent)
            {
                Vector3 dir = (proj.position - transform.position) / (proj.position - transform.position).magnitude;

                proj.DOMove(proj.position + dir * 11, speedProjectile).OnComplete(() =>
                {
                    Destroy(proj.gameObject);
                    ProjectileParent.rotation = Quaternion.Euler(0, 0, 0);
                });
            }


        });

        StartCoroutine(ResetState(Attack1Duration));
        
    }

    IEnumerator ResetState(float time)
    {

        yield return new WaitForSeconds(time);
        currentBossState = SetBossState(currentBossState);
        isStateSet = true;
        canChargeAtPlayer = false;

    }

    int SetBossState(int lastState)
    {
        int x = Random.Range(0, 4);
        if (x == lastState)
        {
            return SetBossState(lastState);
        }
        else
        {
            isStateSet = true;
            return x;
        }
    }
}
