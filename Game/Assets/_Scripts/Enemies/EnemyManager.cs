using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EnemyManager : MonoBehaviour
{
    public static Dictionary<int, EnemySO> EnemyDataBase = new Dictionary<int, EnemySO>();

    [SerializeField] Transform EnemyParent;
    [SerializeField] private EnemyBehaviour EnemyPrefab;
    [SerializeField] private Transform[] EnemiesSpawnLocation;
    public int EnemyCount;
    public bool dontSpawnEnemies;
    
    public bool SpawnRandomlyOnMap;
    public static int EnemyNumbers;
    public InputReaderSO inputEvents;


    private void LoadEnemies()
    {
        var Enemies = Resources.LoadAll<EnemySO>("Enemies");
        foreach (var enemy in Enemies)
        {
            EnemyDataBase.Add(enemy.EnemyID, enemy);
        }
    }

    private void Start()
    {
        LoadEnemies();

        if (dontSpawnEnemies)
            return;

        if(SpawnRandomlyOnMap)
        {
            for (int i = 0; i < EnemyCount; i++)
            {

           
            float x = Random.Range(-70, 70);
            float y = Random.Range(-42, 54);
            int randomEnemy = Random.Range(0, EnemyDataBase.Count);

            EnemyBehaviour a = Instantiate(EnemyPrefab, new Vector2(x, y), Quaternion.identity, EnemyParent);
            var enemy = EnemyDataBase[randomEnemy];
            a.InitializeEnemy(enemy.EnemySrptie, enemy.EnemySpeed, enemy.MaxHealth, enemy.MaxHealth, enemy.Damage, enemy.TimeBetweenAttacks, enemy.sightRange, enemy.attackRange, enemy.animator, enemy.enemyType, enemy.Projectile);
            }
            return;
        }

        for (int i = 0; i < EnemyCount; i++)
        {


            foreach (var enemy in EnemyDataBase)
            {
                if (enemy.Value.enemyType == EnemyType.boss)
                {
                    //Boss b = Instantiate(EnemyPrefab, Vector2.zero, Quaternion.identity, EnemyParent);
                }

                float x = Random.Range(-3, 3);
                float y = Random.Range(-3, 3);
                EnemyBehaviour a = Instantiate(EnemyPrefab, new Vector2(x, y) ,Quaternion.identity, EnemyParent) ;
                EnemyNumbers++;
                a.InitializeEnemy(enemy.Value.EnemySrptie, enemy.Value.EnemySpeed, enemy.Value.MaxHealth, enemy.Value.MaxHealth, enemy.Value.Damage, enemy.Value.TimeBetweenAttacks, enemy.Value.sightRange, enemy.Value.attackRange, enemy.Value.animator, enemy.Value.enemyType,enemy.Value.Projectile);
           
            }

        }

    }

     void SpawnEnemyInRandomPlaces(int EnemyCount, int EnemyID)
    {
        foreach (var enemy in EnemyDataBase)
        {
            if (enemy.Value.EnemyID == EnemyID)
            {
                for (int i = 0; i < EnemyCount; i++)
                {
                    int randomLocation = Random.Range(0, EnemiesSpawnLocation.Length);
                    EnemyBehaviour a = Instantiate(EnemyPrefab, EnemiesSpawnLocation[i].position, Quaternion.identity, EnemyParent);
                    EnemyNumbers++;
                    a.InitializeEnemy(enemy.Value.EnemySrptie, enemy.Value.EnemySpeed, enemy.Value.MaxHealth, enemy.Value.MaxHealth, enemy.Value.Damage, enemy.Value.TimeBetweenAttacks, enemy.Value.sightRange, enemy.Value.attackRange, enemy.Value.animator, enemy.Value.enemyType, enemy.Value.Projectile);
                }
            }
        }
    }
    private void OnEnable()
    {
        inputEvents.SpawnEnemyEvent += SpawnEnemyInRandomPlaces;
    }
    private void OnDisable()
    {
        inputEvents.SpawnEnemyEvent -= SpawnEnemyInRandomPlaces;

    }
}
