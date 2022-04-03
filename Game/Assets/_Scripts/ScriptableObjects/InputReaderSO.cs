using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;
[CreateAssetMenu(fileName = "Input", menuName = "ScriptableObjects/inputReader", order = 1)]
public class InputReaderSO : ScriptableObject
{

    public event UnityAction<Vector2> moveEvent;
    public event UnityAction<Weapon,Vector2,Quaternion> PlayerAttackEvent;
    public event UnityAction<float> HealthUpdateEvent;
    public event UnityAction PlayerDeadEvent;
    public event UnityAction SurfaceUpdatedEvent;
    public event UnityAction<int, int> SpawnEnemyEvent;

    public event UnityAction dungeon;



    public void onEnemySpawn(int enemyCount, int enemyID)
    {
        if (SpawnEnemyEvent != null)
            SpawnEnemyEvent.Invoke(enemyCount,enemyID);
    }
    public void onPlayerDead()
    {
        if (PlayerDeadEvent != null)
            PlayerDeadEvent.Invoke();
    }
    

    public void onPlayerAttack(Weapon weapon,Vector2 direction , Quaternion rot)
    {
        if (PlayerAttackEvent != null)
            PlayerAttackEvent.Invoke(weapon, direction,rot);
    }

    void onMove(Vector2 pos)
    {
        if (moveEvent != null)
            moveEvent.Invoke(pos);
    }
    public void ondun()
    {
        if (dungeon != null)
            dungeon.Invoke();
    }
    public void onPlayerHealthUpdate(float newValue)
    {
        if (HealthUpdateEvent != null)
        HealthUpdateEvent.Invoke(newValue);
    }

    public void onSurfaceUpdated()
    {
        if (SurfaceUpdatedEvent != null)
            SurfaceUpdatedEvent.Invoke();
    }

}
