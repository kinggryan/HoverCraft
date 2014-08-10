#pragma strict

/**********************************
	
	Projectile Manager Networked class
	Handles visuals and physics of a projectile on server and client
	
	********************************/

private var rocketOn;
public var relatedBM : BattleManager;
public var explosionEffect : GameObject;

/**************

	Server-side handles:
		- acceleration and collision triggering, as well as other Physics
		- call destruction on clients
		
		***********/

function ActivateCollisions()
{	
	collider.enabled = true;
}

function StopAcceleration()
{
	// stop rocket acceleration
	rocketOn = false;
	rigidbody.useGravity = true;
}

function Start () {
	if (Network.isServer) {
		rocketOn = true;
		rigidbody.useGravity = false;
		
		Physics.IgnoreCollision(collider,relatedBM.collider);
		var machPieces: MachinePieceAttachments = relatedBM.GetComponent("MachinePieceAttachments");
		
		for(var currObj : GameObject in machPieces.connectedObjects)
			if(currObj != null && currObj.collider != null)
				Physics.IgnoreCollision(collider,currObj.collider);
		
		Invoke("StopAcceleration",.8);
	
		rigidbody.AddRelativeForce(Vector3(0,200,0));
		rigidbody.velocity = relatedBM.GetVelocity();
	}
	else if (Network.isClient) {
		gameObject.Destroy(rigidbody);
		gameObject.Destroy(collider);
	}
}

function OnCollisionEnter(collision:Collision)
{
	if(Network.isServer) {
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
		
		networkView.RPC("ExplodeOnClients",RPCMode.All,transform.position);
	
		gameObject.Destroy(gameObject);
	}
}

function FixedUpdate()
{
	if(Network.isServer && rocketOn)
		rigidbody.AddRelativeForce(Vector3(0,23,0));
}

/************

	Client-side handles:
	- show explosion on destruction
	
	*********/
	
@RPC
function ExplodeOnClients(position: Vector3) {
	GameObject.Destroy(GameObject.Instantiate(explosionEffect,position,Quaternion.identity),1.5);
	gameObject.Destroy(gameObject);
}