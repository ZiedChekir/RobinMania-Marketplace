using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;
using UnityEngine.Events;
using DG.Tweening;
public class EnemyBehaviour : MonoBehaviour
{
    EnemyStatus enemyStatus = EnemyStatus.Patrolling;
    //internal


    Rigidbody2D rb;
    NavMeshAgent agent;
    GameObject AlertSprite;
    Animator anim;
    SpriteRenderer SR;
    [SerializeField] private InputReaderSO inputReader;
    [SerializeField] private EnemyHealth enemyHealth;
    [SerializeField] private GameObject DeathParticleEffect;


    //States
    [Header("States")]
    public float sightRange;
    public float attackRange;
    public bool playerInSightRange, playerInAttackRange;
    [SerializeField] float moveSpeed;
    public EnemyType enemyType;
    public float Health = 5;
   



    [Header("Patroling")]
    //patroling
    private Vector3 walkPoint;
    private bool walkPointSet;
    private bool PatrolPaused = false;
    [SerializeField] private float walkPointRange;
    private Transform player;

    //handle player stuck
    private Vector3 LastPosition;
    private int StuckTimer;

    [Header("Attacking")]
    //Attacking
    public float timeBetweenAttacks;
    bool alreadyAttacked;
    public GameObject projectile;
    public float Damage;
    private const float shootAnticipationDelay = .1f;

    [Header("Patroling set of points")]
    public Transform[] points;
    private int destPoint = 0;

    private bool isPlayerDead;


    private Vector3 PreviousPosition;
    private const float moveChekerMinimumDistance = 0.01f ;
    private float moveCheckerTimer;
    private const float moveCheckerInterval = 0.1f;


    public void InitializeEnemy(Sprite EnemySprite, float speed,float health, float MaxHealth,float damage,float timeBetweenAttacks,float sightRange, float AttackRange,AnimatorOverrideController animOverride,EnemyType Type, GameObject projectile)
    {
        GetComponent<SpriteRenderer>().sprite = EnemySprite;
        agent.speed = speed;
        this.Health = health;
        Damage = damage;
        this.timeBetweenAttacks = timeBetweenAttacks;
        this.sightRange = sightRange;
        this.attackRange = AttackRange;
        this.projectile = projectile;
        anim.runtimeAnimatorController = animOverride;
        enemyHealth.InitHealth(Health, MaxHealth);
        enemyType = Type;
    }

    IEnumerator  InitializeEnemy1(Sprite EnemySprite, float speed, float health, float MaxHealth, float damage, float timeBetweenAttacks, float sightRange, float AttackRange, AnimatorOverrideController animOverride, EnemyType Type, GameObject projectile)
    {
        yield return new WaitForSeconds(1);
        GetComponent<SpriteRenderer>().sprite = EnemySprite;
        agent.speed = speed;
        this.Health = health;
        Damage = damage;
        this.timeBetweenAttacks = timeBetweenAttacks;
        this.sightRange = sightRange;
        this.attackRange = AttackRange;
        this.projectile = projectile;
        anim.runtimeAnimatorController = animOverride;
        enemyHealth.InitHealth(Health, MaxHealth);
        enemyType = Type;
    }

    private void Awake()
    {
        player = GameObject.FindGameObjectWithTag("Player").transform;
        isPlayerDead = false;
        rb = GetComponent<Rigidbody2D>();
        agent = GetComponent<NavMeshAgent>();
        anim = GetComponent<Animator>();
        SR = GetComponent<SpriteRenderer>();
        agent.speed = moveSpeed;
        agent.updateRotation = false;
        agent.updateUpAxis = false;
        //agent.autoBraking = false;
        player = GameObject.FindGameObjectWithTag("Player").transform;
        AlertSprite = gameObject.transform.GetChild(0).gameObject;
        AlertSprite.SetActive(false);
        
        
    }

    private void Start()
    {
        PreviousPosition = transform.position;
        moveCheckerTimer = Time.timeSinceLevelLoad;
  
    }
    

    private void Update()
    {
        
        if (anim.GetBool("isDead"))
            return;
        SetEnemyStatus();
        
        switch (enemyStatus)
        {
            case EnemyStatus.Patrolling:

                Patroling();
                break;
            case EnemyStatus.Alert:
                ChasePlayer();
                break;
            case EnemyStatus.Attack :
                AttackPlayer();
                break;

        }
   
      
    }
    private void LateUpdate()
    {
        if (anim.GetBool("isDead"))
            return;
        
       SetAnimation();
    }

    void SetEnemyStatus()
    {
        
        //playerInSightRange =   Physics2D.OverlapCircle(transform.position, sightRange,PlayerMask) != null;
        //playerInAttackRange = Physics2D.OverlapCircle(transform.position, attackRange, PlayerMask) != null;

        Vector2 distanceBetweenPlayerAndEnemy = this.transform.position - player.position;

        playerInSightRange = distanceBetweenPlayerAndEnemy.magnitude <= sightRange;
        playerInAttackRange = distanceBetweenPlayerAndEnemy.magnitude <= attackRange;



        if (playerInAttackRange && !isPlayerDead)
        {
            //player = Physics2D.OverlapCircle(transform.position, sightRange, PlayerMask).transform;

            enemyStatus = EnemyStatus.Attack;
            AlertSprite.SetActive(true);
        }
        else if (playerInSightRange && !isPlayerDead)
        {

            enemyStatus = EnemyStatus.Alert;
            AlertSprite.SetActive(true);
        }
        else
        {

            enemyStatus = EnemyStatus.Patrolling;
            AlertSprite.SetActive(false);
        }
    }



    void SetAnimation()
    {
       
        if(isMoving())
        {
         anim.SetBool("isWalking", true);
        }
        else
        {
            anim.SetBool("isWalking", false);
        }
        
        if (enemyStatus == EnemyStatus.Patrolling)
        {
            
            if (transform.position.x - walkPoint.x > 0  && isMoving())
            {
                SR.flipX = true;
            }

            else if (isMoving())
            {
                SR.flipX = false;
            }

        }
        if (!isPlayerDead && (enemyStatus == EnemyStatus.Alert || enemyStatus == EnemyStatus.Attack))
        {
            if (transform.position.x - player.position.x > 0)
            {

                SR.flipX = true;
            }
            else 
            {
                SR.flipX = false;
            }
        }
    }
    void Patrolling_set_points()
    {

        if (!walkPointSet)
        {

            search_destination_set_points();

        }

        if (walkPointSet)
        {
            if (agent.enabled)
                agent.SetDestination(points[destPoint].position);
        }

        if (!agent.pathPending && Vector2.Distance(transform.position, points[destPoint].position) <= agent.stoppingDistance)
        {


            walkPointSet = false;
        }

    }
    void search_destination_set_points()
    {

        // Returns if no points have been set up
        if (points.Length == 0)
            return;

        // Set the agent to go to the currently selected destination.
        if (agent.enabled)
            agent.SetDestination(points[destPoint].position);

        // Choose the next point in the array as the destination,
        // cycling to the start if necessary.
        destPoint = (destPoint + 1) % points.Length;
        walkPointSet = true;
    }
    private void Patroling()
    {

        if (!walkPointSet)
        {
            SearchWalkPoint();

        }

        if (walkPointSet && !PatrolPaused)
        {
            if (agent.enabled)
                agent.SetDestination(walkPoint);
        }


        HandlePlayerStuck();

        Vector3 distanceToWalkPoint = transform.position - walkPoint;

        //Walkpoint reached
        if (distanceToWalkPoint.magnitude < 0.3f)
        {
            PatrolPaused = true;
            walkPointSet = false;
            
            StartCoroutine(PatrolPause(2));

        }

    }

    private void HandlePlayerStuck()
    {
        
        if(transform.position == LastPosition)
        {
            StuckTimer++;
        }
        else
        {
            StuckTimer = 0;
        }
        
        if(StuckTimer > 600)
        {
            
            //change destination to free the enemy from being stuck
            walkPointSet = false;
            PatrolPaused = false;
        }

        LastPosition = transform.position;
    }
    private void SearchWalkPoint()
    {
        //Calculate random point in range
        Vector3 tempDestination;

            float randomY = Random.Range(-walkPointRange, walkPointRange);
            float randomX = Random.Range(-walkPointRange, walkPointRange);
            tempDestination = new Vector3(transform.position.x + randomX, transform.position.y + randomY);
            
            if (!IsDestinationValid(tempDestination)) return;
        
        walkPoint = tempDestination;

        walkPointSet = true;
    }

    private bool IsDestinationValid(Vector3 targetDestination)
    {
        NavMeshHit hit;
        if (NavMesh.SamplePosition(targetDestination, out hit, 1f, NavMesh.AllAreas))
        {
            return true;
        }
        return false;
    }


    void ChasePlayer()
    {

        if (agent.enabled)
        {

            agent.SetDestination(player.position);
        }



    }
    void AttackPlayer()
    {
        if (agent.enabled)
            agent.SetDestination(transform.position);

       


        if (!alreadyAttacked)
        {

            ///Attack code here

            ///End of attack code
            if(enemyType == EnemyType.melee)
            {
                inputReader.onPlayerHealthUpdate(-Damage);
                //player.GetComponent<PlayerController>().UpdatePlayerHealth(-Damage);
                alreadyAttacked = true;
                
                StartCoroutine(ResetAttack());
                
            }
            else
            {

                float sign, angle;

                sign = 0 < player.transform.position.y ? 1f : -1f;
                angle = Vector2.Angle(new Vector2(1f, 0f), player.transform.position) * sign;
                Quaternion desiredRotation = Quaternion.Euler(0f, 0f, angle);
                transform.DOScale(new Vector2(0.6f, 1.4f), shootAnticipationDelay).OnComplete(() =>
                {
                    projectile p = Instantiate(projectile, transform.position, desiredRotation, this.transform).GetComponent<projectile>();
                    Vector3 dir = (player.transform.position - this.transform.position) / (player.transform.position - this.transform.position).magnitude;
                    p.InitializeProjectile(dir, 500, Damage, 0, ProjectileFrom.enemy, 15);

                    transform.DOScale(1, shootAnticipationDelay);
                });


                alreadyAttacked = true;

                StartCoroutine(ResetAttack());


            }



        }
    }

    IEnumerator shoot()
    {
        float sign, angle;

        sign = 0 < player.transform.position.y ? 1f : -1f;
        angle = Vector2.Angle(new Vector2(1f, 0f), player.transform.position) * sign;
        Quaternion desiredRotation = Quaternion.Euler(0f, 0f, angle);
        transform.DOScale(new Vector2(0.7f, 1.3f), shootAnticipationDelay);
        yield return new WaitForSeconds(shootAnticipationDelay);
        projectile p = Instantiate(projectile, transform.position, desiredRotation, this.transform).GetComponent<projectile>();
        transform.DOScale(1, shootAnticipationDelay);
        Vector3 dir = (player.transform.position - this.transform.position) / (player.transform.position - this.transform.position).magnitude;
        p.InitializeProjectile(dir, 500, Damage, 0, ProjectileFrom.enemy, 15);

        alreadyAttacked = true;
        
        
    }
    IEnumerator wait(float seconds)
    {
        yield return new WaitForSeconds(seconds);
    }
    IEnumerator SquishEnemyAnimation()
    {
        
        transform.localScale = new Vector3(.6f, 1.4f, 1f);
        yield return new WaitForSeconds(.1f);
        transform.localScale = new Vector3(1f, 1, 1f);

    }
    private IEnumerator ResetAttack()
    {
        yield return new WaitForSeconds(timeBetweenAttacks);
        alreadyAttacked = false;
    }




    IEnumerator ResetAgentMovement()
    {
        yield return new WaitForSeconds(.3f);
        rb.velocity = Vector2.zero;
        rb.angularVelocity = 0;
        agent.enabled = true;
        rb.isKinematic = true;
        //  agent.SetDestination(transform.position);

    }
    IEnumerator PatrolPause(float val)
    {
        yield return new WaitForSeconds(val);

        PatrolPaused = false;
    }
    IEnumerator PatrolPause2()
    {
        yield return new WaitForSeconds(0.5f);

        search_destination_set_points();

    }


    private void OnTriggerEnter2D(Collider2D other)
    {
        if (other.CompareTag("player_projectile"))
        {
            
            EnemyGotHit(other);
        }
    }
    void EnemyGotHit(Collider2D other)
    {
        //  anim.SetBool("isHit", true);
        StartCoroutine(EnemyHitFlash());
        transform.DOScale(new Vector2(.7f, 1.3f),.1f).OnComplete(()=> { transform.DOScale(1, .1f); });
        projectile proj = other.GetComponent<projectile>();
        ReduceEnemyHealth(proj.damage);
        //animation + audio Do i need a unityAction ? 
        agent.enabled = false;
        rb.isKinematic = false;
        rb.AddForce(proj.direction.normalized * proj.knockback_power, ForceMode2D.Impulse);
        StartCoroutine(ResetAgentMovement());

    }
    IEnumerator EnemyHitFlash()
    {

        SR.color = Color.red;
      
        yield return new WaitForSeconds(0.1f);
        SR.color = Color.white;

       // transform.localScale = new Vector3(1 * Mathf.Sign(transform.localScale.x), 1, 1);
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
        Instantiate(DeathParticleEffect, transform.position, Quaternion.identity);
        EnemyManager.EnemyNumbers--;
        transform.DORotate(new Vector3(0, 0, 180), .5f).OnComplete(() => { DestroyEnemyOnDeathAnimationFinished(); });
        //anim.SetBool("isDead",true);
        
    }
    public void DestroyEnemyOnDeathAnimationFinished()
    {
        Destroy(this.gameObject);
    }

    void OnPlayerDead()
    {

        isPlayerDead = true;
        enemyStatus = EnemyStatus.Patrolling;
    }

    public void ResetEnemyHitAnimation()
    {
        anim.SetBool("isHit", false);
    }
    private void OnDisable()
    {
        inputReader.PlayerDeadEvent -= OnPlayerDead;
    }
    private void OnEnable()
    {
        inputReader.PlayerDeadEvent += OnPlayerDead;
    }
    bool isMoving()
    {
        return agent.velocity != Vector3.zero;
    }
}



enum EnemyStatus { Patrolling, Alert, Attack };
