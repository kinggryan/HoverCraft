#pragma strict

public var rotationGrabberType : GameObject;

public class LegConnector extends Connector
{
	function Connect (blockObject : GameObject , attachPoint : Vector3, attachDirection : Vector3){
		var worldSpaceSide : Vector3 = blockObject.transform.TransformPoint(attachPoint);
		var worldSpaceDir : Vector3 = blockObject.transform.TransformDirection(attachDirection);
		
		transform.rotation = Quaternion.LookRotation(worldSpaceDir,Vector3(worldSpaceDir.y,worldSpaceDir.z,worldSpaceDir.x));
		transform.position = worldSpaceSide + attachDirection*.1 + transform.TransformDirection(Vector3.up);//transform.TransformPoint(.5*Vector3.down + Vector3.right*.1);
		GetComponent(FixedJoint).connectedBody = blockObject.rigidbody;
		
		var machinePieceInfo : MachinePieceAttachments = GetComponent("MachinePieceAttachments");
		for(var currObj : GameObject in machinePieceInfo.connectedObjects)
			currObj = blockObject;
	}
	
/*	function OnMouseDown() {
		var ccc : CreatorControl = GameObject.Find("MainCreatorControl").GetComponent("CreatorControl");
		 	
		if(ccc.actionMode == 3)
		{
			// destroy other rotation grabbers and create a new rotation grabber for this object
			GameObject.Destroy(GameObject.Find("RotationGrabberObject"));
			
			var rGrabber : GameObject = Instantiate(rotationGrabberType,transform.TransformPoint(Vector3(0,-2,0)),Quaternion.LookRotation(transform.TransformDirection(Vector3.forward),transform.TransformDirection(Vector3.right)));
			var rGrabberData : RotationGrabber = rGrabber.GetComponent("RotationGrabber");
			rGrabberData.radius = 2;
			rGrabberData.anchorPoint = transform.position + transform.TransformDirection(.5*Vector3.down);
			rGrabberData.rotationAxis = transform.TransformDirection(Vector3.forward);
			rGrabberData.grabbedObj = this;
			GetComponent(FixedJoint).connectedBody.freezeRotation = true;
			rigidbody.freezeRotation = true;
			rigidbody.detectCollisions = false;
		}
		else if(ccc.actionMode == 5)
		{
			GameObject.Destroy(gameObject);
		}
	} */
	
	function rotatePieceGeneric()
	{
		// destroy other rotation grabbers and create a new rotation grabber for this object
		GameObject.Destroy(GameObject.Find("RotationGrabberObject"));
			
		var rGrabber : GameObject = Instantiate(rotationGrabberType,transform.TransformPoint(Vector3(0,-2,0)),Quaternion.LookRotation(transform.TransformDirection(Vector3.forward),transform.TransformDirection(Vector3.right)));
		var rGrabberData : RotationGrabber = rGrabber.GetComponent("RotationGrabber");
		rGrabberData.radius = 2;
		rGrabberData.anchorPoint = transform.position + transform.TransformDirection(.5*Vector3.down);
		rGrabberData.rotationAxis = transform.TransformDirection(Vector3.forward);
		rGrabberData.grabbedObj = this;
		GetComponent(FixedJoint).connectedBody.freezeRotation = true;
		rigidbody.freezeRotation = true;
		rigidbody.detectCollisions = false;
	}
	
	function rotate(angleToRotate: float)
	{
		// store connected body, break joint, and rejoin after rotation
		var connectedBody = GetComponent(FixedJoint).connectedBody;
		GetComponent(FixedJoint).connectedBody = null;
		
		// rotate around the hinge joint
		var anchorPoint : Vector3 = .5*Vector3.down;
		transform.RotateAround(transform.TransformPoint(anchorPoint),transform.TransformDirection(Vector3.forward),-angleToRotate);
		rigidbody.angularVelocity = Vector3.zero;
		
		GetComponent(FixedJoint).connectedBody = connectedBody;
	}
}