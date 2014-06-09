#pragma strict

public var rotationGrabberType : GameObject;
private var fuel : int;

public class ThrusterConnector extends Connector
{
	function Connect (blockObject : GameObject , attachPoint : Vector3, attachDirection : Vector3){
		var worldSpaceSide : Vector3 = blockObject.transform.TransformPoint(attachPoint);
		var worldSpaceDir : Vector3 = blockObject.transform.TransformDirection(attachDirection);
		
		transform.position = worldSpaceSide;
		transform.rotation = Quaternion.LookRotation(worldSpaceDir,Vector3(worldSpaceDir.y,worldSpaceDir.z,worldSpaceDir.x));
		transform.position += 0.26 * worldSpaceDir;
		GetComponent(FixedJoint).connectedBody = blockObject.rigidbody;
		
		var machinePieceInfo : MachinePieceAttachments = GetComponent("MachinePieceAttachments");
		for(var currObj : GameObject in machinePieceInfo.connectedObjects)
			currObj = blockObject;
			
		gameObject.AddComponent(KeyBindedActivator).key = "2";	
		// initialize starting fuel
		fuel = 10000;
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

	function FixedActivate() {
		// TODO figure out why this number needs to be so high
		if(fuel > 0)
		{
			Debug.Log("activation");
			rigidbody.AddRelativeForce(Vector3.up * 50);
			fuel--;
		}	
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
}