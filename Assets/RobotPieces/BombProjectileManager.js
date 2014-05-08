#pragma strict

public var explosionDelay : float;
public var relatedBM : BattleManager;

function ActivateCollisions()
{	
	// reactivate collisions
	//collider.enabled = false;
	collider.enabled = true;
};

function Start () {
	collider.enabled = false;
	rigidbody.useGravity = false;
		
	Invoke("ActivateCollisions",.2);
	Invoke("Explode",explosionDelay);
	
	rigidbody.AddRelativeForce(Vector3(0,80,0));
}

function Explode()
{	
	var colliders : Collider[] = Physics.OverlapSphere (transform.position, 30);
	
	for (var hit : Collider in colliders) 
	{
			if (hit && hit.rigidbody)
			{
				hit.rigidbody.AddExplosionForce(15, transform.position, 30, 3.0);
				var otherBM : BattleManager = hit.GetComponent("BattleManager");
				if(otherBM != null)
					relatedBM.CauseDamage(otherBM);
			}
	}
	
	GameObject.Destroy(gameObject);
}