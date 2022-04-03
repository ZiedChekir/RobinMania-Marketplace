using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.InputSystem;
public class PlayerController : MonoBehaviour
{

    [Header("Scriptable Objects")]
    [SerializeField] private InputReaderSO inputReader;
    [SerializeField] private InventoryEvents inventoryEvents;
    [SerializeField] private Slider HealthBar;

    [SerializeField] private FloatVariable PlayerHP;
    private float PlayerHP1;
    private float MaxHealth = 100;


    [SerializeField] private float MovementSpeed = 1;



    [SerializeField] ParticleSystem DustWalking;

    private Vector2 movePosition = Vector2.zero;
    private Vector3 mousePosition;
    
   public bool isDead;
    bool firing;

    Rigidbody2D rb;
    Animator anim;
    SpriteRenderer SR;
    PlayerInput playerInput;


    public Transform DungeonStartPoint;

    Item EquippedItem;



    void Awake()
    {
        anim = GetComponent<Animator>();
        SR = GetComponent<SpriteRenderer>();
        /*        playerInput = new PlayerInput();
                playerInput.currentActionMap.Enable();*/

        PlayerHP1 = MaxHealth;
        HealthBar.maxValue = 100;
        HealthBar.value = PlayerHP1;
        if (GetComponent<Rigidbody2D>() == null)
            gameObject.AddComponent<Rigidbody2D>();
        if (GetComponent<Collider2D>() == null)
            gameObject.AddComponent<CircleCollider2D>();

        rb = gameObject.GetComponent<Rigidbody2D>();
        rb.gravityScale = 0;
        rb.bodyType = RigidbodyType2D.Dynamic;
        //timers
    }

    

    public void EnterDungeon()
    {
        this.transform.position = DungeonStartPoint.position;
    }


    void Update()
    {

        if (isDead)
            return;
        Move();
     
             Interact();
        Animate();
      

    }
    private void FixedUpdate()
    {
        ProcessMovement();
    }
    public void Move()
    {
        if (isDead)
            return;


        // movePosition.x = Mathf.Lerp(movePosition.x, playerInput.actions["Movement"].ReadValue<Vector2>().x,.1f) ;
        // movePosition.y = Mathf.Lerp(movePosition.y, playerInput.actions["Movement"].ReadValue<Vector2>().y, .1f);
        //movePosition.x = Mathf.Lerp(movePosition.x, playerInput.Ingame.Movement.ReadValue<Vector2>().x, .1f);
        // movePosition.y = Mathf.Lerp(movePosition.y, playerInput.Ingame.Movement.ReadValue<Vector2>().y, .1f);
        movePosition.x = Mathf.Lerp(movePosition.x, Input.GetAxis("Horizontal"), .1f);
        movePosition.y = Mathf.Lerp(movePosition.y, Input.GetAxis("Vertical"), .1f);

        mousePosition = Camera.main.ScreenToWorldPoint(Input.mousePosition);


        if (mousePosition.x - transform.position.x > 0)
        {
            SR.flipX = false;
            
        }
        else if (mousePosition.x - transform.position.x < 0)
        {
            SR.flipX = true;
        }

        //if (movePosition.magnitude != 0)
        //{
        //    DustWalking.Play();
        //    isMoving = true;
        //}

        //else
        //    isMoving = false;
    }

    void Animate()
    {
        if (isDead)
            return;

        if (isMoving())
        {
            anim.SetBool("isWalking", true);

        }
        else
        {
            anim.SetBool("isWalking", false);
        }
    }

    private void ProcessMovement()
    {
        if (isDead)
            return;
        rb.MovePosition(rb.position + movePosition * MovementSpeed * Time.fixedDeltaTime);
    }

    public void Interact()
    {
    
        if ( EquippedItem is Weapon)
        {
            Weapon EquippedWeapon = (Weapon)EquippedItem;
            if (Input.GetMouseButton(0) )
            {
                if (Time.timeSinceLevelLoad >= EquippedWeapon.cooldownTimer + EquippedWeapon.coolDown && EquippedItem != null)
                {
                    MovementSpeed = 4;
                    EquippedWeapon.cooldownTimer = Time.timeSinceLevelLoad;
                    Vector3 mousePosition;
                    Vector2 mousePosition2D, projectile_direction;
                    float sign, angle;
                    mousePosition = Camera.main.ScreenToWorldPoint(Input.mousePosition);
                    mousePosition2D = new Vector2(mousePosition.x - transform.position.x, mousePosition.y - transform.position.y);
                    sign = 0 < mousePosition2D.y ? 1f : -1f;
                    angle = Vector2.Angle(new Vector2(1f, 0f), mousePosition2D) * sign;
                    Quaternion desiredRotation = Quaternion.Euler(0f, 0f, angle);
                    projectile_direction = (mousePosition - transform.position);
                    inputReader.onPlayerAttack(EquippedWeapon, projectile_direction / projectile_direction.magnitude, desiredRotation);
                }
                }
            else
            {
                MovementSpeed = 6 ;
            }
        }
        else if (Input.GetMouseButtonDown(0) && EquippedItem is Consumable && !isDead)
        {
            Consumable EquippedConsumable = (Consumable)EquippedItem;
            if (Time.timeSinceLevelLoad >= EquippedConsumable.cooldownTimer + EquippedConsumable.coolDown && EquippedItem != null)
            {
                EquippedConsumable.cooldownTimer = Time.timeSinceLevelLoad;
                UpdatePlayerHealth(EquippedConsumable.HealthBuff);
                ToastManager.Instance.AddToast("Item Consumed");

            }
            else
            {
                ToastManager.Instance.AddToast("Item on cooldown. Wait " + Mathf.Floor(EquippedConsumable.cooldownTimer + EquippedConsumable.coolDown - Time.timeSinceLevelLoad + 1)  + " seconds");
            }
        }

    }



    public void UpdatePlayerHealth1(float value)
    {
        PlayerHP1 += value;
        print(PlayerHP1);
        GameObject.FindGameObjectWithTag("health").GetComponent<Slider>().value = PlayerHP1;

    }


    public void UpdatePlayerHealth(float value)
    {
        //modify Hp value

        PlayerHP1 += value;

        PlayerHP1 = Mathf.Clamp(PlayerHP1, 0, MaxHealth);
        if (HealthBar != null)
            HealthBar.value = PlayerHP1;
        else
        {
            GameObject.FindGameObjectWithTag("health").GetComponent<Slider>().value = PlayerHP1;
            print("HP is " + PlayerHP1);
        }

        //check if the player is dead
        if (PlayerHP1 <= 0)
        {
            
            inputReader.onPlayerDead();
            PlayerDead();
        }

        //invoke the event so other listeners can respond to the health change
        //inputReader.onPlayerHealthUpdate(value);

        //handle animation if player recieved damage 
        if (value < 0)
            anim.SetBool("isHit", true);
        else
        {
            //player recieved healing potion or smthing
        }

    }


    public void ResetPlayerHitAnimation()
    {
        anim.SetBool("isHit", false);
    }
    private void PlayerDead()
    {
      //  playerInput.currentActionMap.Disable();
        isDead = true;
        print("deaad");
        anim.SetTrigger("isDead");
    }

    private void onItemEquipped(int itemID)
    {
        EquippedItem = itemID == -1 ? null : ItemDatabase.ItemList[itemID];
    }
    private bool isMoving()
    {
        return movePosition.magnitude > 0.1f;
    }

    private void OnCollisionEnter2D(Collision2D collision)
    {
        
        if(collision.gameObject.CompareTag("enemy_projectile") && collision.gameObject.TryGetComponent<projectile>(out projectile p))
        {
            UpdatePlayerHealth(-p.damage);
        }
    }

    private void OnEnable()
    {
       // playerInput.currentActionMap.Enable();
        inventoryEvents.ItemEquippedEvent += onItemEquipped;
        inputReader.HealthUpdateEvent += UpdatePlayerHealth;
        inputReader.dungeon += EnterDungeon;
       // playerInput.actions["Attack"].performed += EnableAttacking;
       // playerInput.actions["Attack"].canceled += DisableAttacking;

        //  playerInput.actions["Movement"].performed += Move;
    }

    //private void DisableAttacking(InputAction.CallbackContext obj)
    //{
    //    firing = false;
    //}

    //private void EnableAttacking(InputAction.CallbackContext obj)
    //{
    //    firing = true;
    //}

    

    private void OnDisable()
    {
        inventoryEvents.ItemEquippedEvent -= onItemEquipped;
    }


}
