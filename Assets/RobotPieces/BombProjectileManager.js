#pragma strict

// BombProjectileManager class. Handles projectile movement and interaction with other pieces

public var relatedBM : BattleManager;

function ActivateCollisions()
{	
	// reactivate collisions
	//collider.enabled = false;
	collider.enabled = true;
};

function Start () {
	//collider.enabled = false;
	
	if(Network.isServer) {
		Physics.IgnoreCollision(collider,relatedBM.collider);
		var machPieces: MachinePieceAttachments = relatedBM.GetComponent("MachinePieceAttachments");
	
		for(var currObj : GameObject in machPieces.connectedObjects) {
			if(currObj != null && currObj.collider != null) {
				Debug.Log("Ignoring " + currObj.collider);
		
				var machPieces2 : MachinePieceAttachments = currObj.GetComponent("MachinePieceAttachments");
				for(var currObj2 : GameObject in machPieces2.connectedObjects)
					if(currObj2 != null)
						Physics.IgnoreCollision(collider,currObj2.collider);
				Physics.IgnoreCollision(collider,currObj.collider);
			}
		}
				
	//Invoke("ActivateCollisions",.4);
	//Invoke("Explode",explosionDelay);
	
		rigidbody.AddRelativeForce(Vector3(0,350,0));
		rigidbody.velocity = relatedBM.rigidbody.velocity;
	}
	else {
		// purge components, including this
		gameObject.Destroy(rigidbody);
		gameObject.Destroy(collider);
		gameObject.Destroy(this);
	}
}

function OnCollisionEnter(col : Collision) {
	Debug.Log("Hit " + col.collider);
	Explode();
}

function Explode()
{	
	var colliders : Collider[] = Physics.OverlapSphere (transform.position, 30);
	
	for (var hit : Collider in colliders) 
	{
			if (hit && hit.rigidbody)
			{
				hit.rigidbody.AddExplosionForce(25, transform.position, 30, 3.0);
				var otherBM : BattleManager = hit.GetComponent("BattleManager");
				if(otherBM != null)
					relatedBM.CauseDamage(otherBM);
			}
	}
	

//	GameObject.Destroy(GameObject.Instantiate(explosionEffect,transform.position,Quaternion.identity),1.5);
	
//	GameObject.Destroy(gameObject);

	// generate effect on players, then destroy self
	var effect : ProjectileEffectNetworked = GetComponent(ProjectileEffectNetworked);
	effect.ExplodeRemote();
	Network.Destroy(networkView.viewID);
}