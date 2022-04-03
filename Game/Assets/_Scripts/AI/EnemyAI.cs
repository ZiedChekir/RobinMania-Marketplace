using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;

public class EnemyAI : MonoBehaviour
{
    [SerializeField] private float startingHealth;
    [SerializeField] private float lowHealthThreshold;
    [SerializeField] private float healthRestoreRate;

    [SerializeField] private float chasingRange;
    [SerializeField] private float shootingRange;


    [SerializeField] private Transform playerTransform;
   



    private SpriteRenderer Sprite;
    private Transform bestCoverSpot;
    private NavMeshAgent agent;

    private Node topNode;

    private float _currentHealth;
    public float currentHealth
    {
        get { return _currentHealth; }
        set { _currentHealth = Mathf.Clamp(value, 0, startingHealth); }
    }

    private void Awake()
    {
        agent = GetComponent<NavMeshAgent>();
        Sprite = GetComponent<SpriteRenderer>();
    }

    private void Start()
    {
        _currentHealth = startingHealth;
        ConstructBehahaviourTree();
    }

    private void ConstructBehahaviourTree()
    {
    
        ChaseNode chaseNode = new ChaseNode(playerTransform, agent, this);
        RangeNode chasingRangeNode = new RangeNode(chasingRange, playerTransform, transform);
        RangeNode shootingRangeNode = new RangeNode(shootingRange, playerTransform, transform);
        ShootNode shootNode = new ShootNode(agent, this, playerTransform);
        WaitNode waitNode = new WaitNode(10,this);

        Sequence chaseSequence = new Sequence(new List<Node> { chasingRangeNode,waitNode, chaseNode });
        Sequence shootSequence = new Sequence(new List<Node> { shootingRangeNode,  shootNode });


        topNode = new Selector(new List<Node> { shootSequence, chaseSequence });


    }

    private void Update()
    {
        topNode.Evaluate();
        if (topNode.nodeState == NodeState.FAILURE)
        {
            SetColor(Color.red);
            agent.isStopped = true;
        }
        currentHealth += Time.deltaTime * healthRestoreRate;
    }
    private void LateUpdate()
    {
        transform.rotation = Quaternion.Euler(0,0,0);

    }


    public void TakeDamage(float damage)
    {
        currentHealth -= damage;
    }

    public void SetColor(Color color)
    {
        Sprite.color = color;
    }

}