#pragma strict

public var rotationGrabberType : GameObject;
public var bulletEffect : ParticleSystem;
private var readyToFire : boolean;
private var bulletEffectObject : ParticleSystem;

public class MachineGunConnector extends Connector
{
	function Connect (blockObject : GameObject , attachPoint : Vector3, attachDirection : Vector3){
		var worldSpaceSide : Vector3 = blockObject.transform.TransformPoint(attachPoint);
		var worldSpaceDir : Vector3 = blockObject.transform.TransformDirection(attachDirection);
		
		transform.position = worldSpaceSide;
		transform.rotation = Quaternion.LookRotation(worldSpaceDir,Vector3(worldSpaceDir.y,worldSpaceDir.z,worldSpaceDir.x));
		transform.position += .8 * worldSpaceDir;
		GetComponent(FixedJoint).connectedBody = blockObject.rigidbody;
		
		// attach to block
		var machinePieceInfo : MachinePieceAttachments = GetComponent("MachinePieceAttachments");
		for(var currObj : GameObject in machinePieceInfo.connectedObjects)
			currObj = blockObject;
		
		// don't collide with attached block	
		Physics.IgnoreCollision(collider,blockObject.collider);
		
		gameObject.AddComponent(KeyBindedActivator).key = "1";
		
		// prepare to fire
		readyToFire = true;
		bulletEffectObject = ParticleSystem.Instantiate(bulletEffect,transform.position,Quaternion.LookRotation(transform.up,transform.forward));
		bulletEffectObject.transform.parent = transform;
		bulletEffectObject.enableEmission = false;
	}
	
	function rotatePieceGeneric()
	{
		// destroy other rotation grabbers and create a new rotation grabber for this object
		GameObject.Destroy(GameObject.Find("RotationGrabberObject"));
			
		var rGrabber : GameObject = Instantiate(rotationGrabberType,transform.TransformPoint(Vector3(0,4,0)),Quaternion.identity);
		var rGrabberData : RotationGrabber = rGrabber.GetComponent("RotationGrabber");
		rGrabberData.radius = 4;
		rGrabberData.anchorPoint = transform.position;
		//rGrabberData.rotationAxis = transform.TransformDirection(Vector3.forward);
		rGrabberData.rotationAxis = Vector3.forward;
		rGrabberData.grabbedObj = this;
		
		rGrabber = Instantiate(rotationGrabberType,transform.TransformPoint(Vector3(4,0,0)),Quaternion.identity);
		rGrabberData = rGrabber.GetComponent("RotationGrabber");
		rGrabberData.radius = 4;
		rGrabberData.anchorPoint = transform.position;
		//rGrabberData.rotationAxis = transform.TransformDirection(Vector3.right);
		rGrabberData.rotationAxis = Vector3.up;
		rGrabberData.grabbedObj = this; 
		
		GetComponent(FixedJoint).connectedBody.freezeRotation = true;
		rigidbody.freezeRotation = true;
		rigidbody.detectCollisions = false;
		
		DrawRotationArrow();
	}
	
	function rotate(angleToRotate: float, axis : Vector3)
	{
		// store connected body, break joint, and rejoin after rotation
		var connectedBody = GetComponent(FixedJoint).connectedBody;
		GetComponent(FixedJoint).connectedBody = null;
		
		// rotate around the hinge joint
		var anchorPoint : Vector3 = Vector3.zero;
		transform.RotateAround(transform.TransformPoint(anchorPoint),axis,-angleToRotate);
		rigidbody.angularVelocity = Vector3.zero;
		
		GetComponent(FixedJoint).connectedBody = connectedBody;
		
		DrawRotationArrow();
	}
	
	function DrawRotationArrow()
	{
		DrawArrow(transform.position,2*transform.TransformDirection(Vector3.up),Color(1,1,1));
	}
	
	function ReadyFromFire()
	{
		readyToFire = true;
		bulletEffectObject.enableEmission = false;
	}
	
	function FixedActivate()
	{
		if(readyToFire)
		{
			var hitInfo : RaycastHit;
			// Generate the variation for the fire
			var fireChangeAmount = Random.Range(0,2);
			var fireChangeDirection = Random.Range(0,360);
			
			// Fire and check collisions
			if(Physics.Raycast(transform.position,transform.up,hitInfo));
			{
				Debug.Log("Gun hit : " + hitInfo.collider);
				// actually deal damage
				var tempBM : BattleManager = GetComponent("BattleManager");
				if(hitInfo.collider != null)
				{
					var otherBM : BattleManager = hitInfo.collider.GetComponent("BattleManager");
					if(otherBM != null)
						tempBM.CauseDamage(otherBM);
				}
			}
				
			bulletEffectObject.enableEmission = true;
				
			// Delay until next firing
			readyToFire = false;
			Invoke("ReadyFromFire",.1);
		}
	}
}