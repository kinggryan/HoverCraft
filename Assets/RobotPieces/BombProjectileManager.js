#pragma strict

public var explosionDelay : float;
public var relatedBM : BattleManager;
public var explosionEffect : GameObject;

function ActivateCollisions()
{	
	// reactivate collisions
	//collider.enabled = false;
	collider.enabled = true;
};

function Start () {
	//collider.enabled = false;
	
	Physics.IgnoreCollision(collider,relatedBM.collider);
	var machPieces: MachinePieceAttachments = relatedBM.GetComponent("MachinePieceAttachments");
	
	for(var currObj : GameObject in machPieces.connectedObjects)
		Physics.IgnoreCollision(collider,currObj.collider);
				
	//Invoke("ActivateCollisions",.4);
	//Invoke("Explode",explosionDelay);
	
	rigidbody.AddRelativeForce(Vector3(0,350,0));
	rigidbody.velocity = relatedBM.rigidbody.velocity;
}

function OnCollisionEnter() {
	Explode();
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
	
	GameObject.Destroy(GameObject.Instantiate(explosionEffect,transform.position,Quaternion.identity),1.5);
	
	GameObject.Destroy(gameObject);
}