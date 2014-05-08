#pragma strict

private var rocketOn;
public var relatedBM : BattleManager;

function ActivateCollisions()
{	
	// reactivate collisions
	//collider.enabled = false;
	collider.enabled = true;
};

function StopAcceleration()
{
	// stop rocket acceleration
	rocketOn = false;
	rigidbody.useGravity = true;
}

function Start () {
	collider.enabled = false;
	rocketOn = true;
	rigidbody.useGravity = false;
		
	Invoke("ActivateCollisions",.1);
	Invoke("StopAcceleration",.8);
	
	rigidbody.AddRelativeForce(Vector3(0,200,0));
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
	
	GameObject.Destroy(gameObject);
}

function FixedUpdate()
{
	if(rocketOn)
		rigidbody.AddRelativeForce(Vector3(0,23,0));
}