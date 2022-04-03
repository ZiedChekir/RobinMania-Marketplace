using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class WeaponHolder : MonoBehaviour
{
    public InventoryEvents inventoryEvents;
    public InputReaderSO inputReader;
    public Transform ProjectileSpawnPosition;

    [SerializeField] AudioCueEventChannelSO SfxChannel;

    Weapon EquippedWeapon;
    SpriteRenderer SR;
    Animator anim;
    TraumaInducer CameraShaker;


    [SerializeField] Transform WeaponTransform;

    private void Start()
    {
        
        initializeComponent();
    }

    void onItemEquipped(int itemID)
    {

        //if the equipped item is null
        if (itemID == -1)
        {
            EquippedWeapon = null;
            ChangeWeaponUI(null);
            return;
        }
        // the equipped item is not null

        if (ItemDatabase.ItemList[itemID] is Weapon)
        {

            EquippedWeapon = (Weapon)ItemDatabase.ItemList[itemID];
            ChangeWeaponUI(EquippedWeapon.sprite);
        }

    }

    private void Update()
    {
        HandleWeaponRotation();
    }
    void ChangeWeaponUI(Sprite sprite)
    {
        SR.sprite = sprite;
    }

    void initializeComponent()
    {
        if (WeaponTransform.GetComponent<SpriteRenderer>())
            SR = WeaponTransform.GetComponent<SpriteRenderer>();
        else
            SR = WeaponTransform.gameObject.AddComponent<SpriteRenderer>();

        if (WeaponTransform.GetComponent<Animator>())
            anim = WeaponTransform.GetComponent<Animator>();
        else
            anim = WeaponTransform.gameObject.AddComponent<Animator>();
        CameraShaker = GetComponent<TraumaInducer>();

    }


    void HandleWeaponRotation()
    {
        
        if(transform.parent.GetComponent<SpriteRenderer>().flipX)
        {
            SR.flipY = true; 
        }
        else
        {
            SR.flipY = false;
        }

        
        Vector2 direction = Camera.main.ScreenToWorldPoint(Input.mousePosition) - transform.position;
        float angle = Mathf.Atan2(direction.y, direction.x) * Mathf.Rad2Deg;
        Quaternion rotation = Quaternion.AngleAxis(angle, Vector3.forward);
        transform.rotation = Quaternion.Slerp(transform.rotation, rotation, 10);
    }
    void Attack(Weapon weapon, Vector2 dir, Quaternion rot)
    {
        if (transform.parent.GetComponent<PlayerController>().isDead)
            return;
        GameObject proj = Instantiate(EquippedWeapon.Projectile, ProjectileSpawnPosition.position  + (ProjectileSpawnPosition.position - transform.position), rot);
        projectile projectileScript;
        if (proj.GetComponent<projectile>())
        {
            projectileScript = proj.GetComponent<projectile>();
        }
        else
        {
            projectileScript = proj.AddComponent<projectile>();
        }
        //Sword x = (Sword)weapon;
        //  SfxChannel.Raise(weapon.audio,weapon.config);
  
        projectileScript.InitializeProjectile(dir, weapon.ProjectileSpeed, weapon.damage, weapon.KnockbackPower, ProjectileFrom.player, weapon.ProjectileDistance, weapon.ProjectileSprite);
        CameraShaker.ApplyStress();
    }

    public void ResetAttack()
    {
        anim.SetBool("attack", false);
    }

    private void OnEnable()
    {
        inputReader.PlayerAttackEvent += Attack;
        inventoryEvents.ItemEquippedEvent += onItemEquipped;
    }
    private void OnDisable()
    {
        inputReader.PlayerAttackEvent -= Attack;
        inventoryEvents.ItemEquippedEvent -= onItemEquipped;
    }
}
