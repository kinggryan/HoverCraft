#pragma strict

private var rocketOn;
public var relatedBM : BattleManager;
public var explosionEffect : GameObject;

function ActivateCollisions()
{	
	collider.enabled = true;
};

function StopAcceleration()
{
	// stop rocket acceleration
	rocketOn = false;
	rigidbody.useGravity = true;
}

function Start () {
	rocketOn = true;
	rigidbody.useGravity = false;
		
	Physics.IgnoreCollision(collider,relatedBM.collider);
	var machPieces: MachinePieceAttachments = relatedBM.GetComponent("MachinePieceAttachments");
	
	for(var currObj : GameObject in machPieces.connectedObjects)
		if(currObj != null && currObj.collider != null)
			Physics.IgnoreCollision(collider,currObj.collider);
		
	Invoke("StopAcceleration",.8);
	
	rigidbody.AddRelativeForce(Vector3(0,200,0));
	rigidbody.velocity = relatedBM.rigidbody.velocity;
}

function OnCollisionEnter(collision:Collision)
{
	Debug.Log("hit " + collision.collider.gameObject);
	
	var colliders : Collider[] = Physics.OverlapSphere (transform.position, 30);
	
	for (var hit : Collider in colliders) 
	{
			if (hit && hit.rigidbody)
			{
				hit.rigidbody.AddExplosionForce(15, transform.position, 30, 3.0);
				var otherBM : BattleManager = collision.collider.GetComponent("BattleManager");
				if(otherBM != null)
					relatedBM.CauseDamage(otherBM);
			}
	}
	
	GameObject.Destroy(GameObject.Instantiate(explosionEffect,transform.position,Quaternion.identity),1.5);
	
	GameObject.Destroy(gameObject);
}

function FixedUpdate()
{
	if(rocketOn)
		rigidbody.AddRelativeForce(Vector3(0,23,0));
}