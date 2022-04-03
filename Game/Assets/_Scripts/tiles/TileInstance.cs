

public class TileInstance 
{
    public TileSO tileData;
    public float currentHealth;

    public TileInstance(TileSO tileData)
    {
        this.tileData = tileData;
        currentHealth = tileData.maxHealth;
    }
}
