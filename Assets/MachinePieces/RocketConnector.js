#pragma strict

public var rotationGrabberType : GameObject;

public class RocketConnector extends Connector
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
	}
	
/*	function OnMouseDown() {
		var ccc : CreatorControl = GameObject.Find("MainCreatorControl").GetComponent("CreatorControl");
		 	
		if(ccc.actionMode == 3)
		{
			// destroy other rotation grabbers and create a new rotation grabber for this object
			GameObject.Destroy(GameObject.Find("RotationGrabberObject"));
			
			var rGrabber : GameObject = Instantiate(rotationGrabberType,transform.TransformPoint(Vector3(0,2,0)),Quaternion.LookRotation(transform.TransformDirection(Vector3.forward),transform.TransformDirection(Vector3.right)));
			var rGrabberData : RotationGrabber = rGrabber.GetComponent("RotationGrabber");
			rGrabberData.radius = 2;
			rGrabberData.anchorPoint = transform.position;
			rGrabberData.rotationAxis = transform.TransformDirection(Vector3.forward);
			rGrabberData.grabbedObj = this;
			GetComponent(FixedJoint).connectedBody.freezeRotation = true;
			rigidbody.freezeRotation = true;
			rigidbody.detectCollisions = false;
		}
		else if(ccc.actionMode == 4)
		{
			ccc.LinkObjects(this);
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
			
		var rGrabber : GameObject = Instantiate(rotationGrabberType,transform.TransformPoint(Vector3(0,2,0)),Quaternion.LookRotation(transform.TransformDirection(Vector3.forward),transform.TransformDirection(Vector3.right)));
		var rGrabberData : RotationGrabber = rGrabber.GetComponent("RotationGrabber");
		rGrabberData.radius = 2;
		rGrabberData.anchorPoint = transform.position;
		rGrabberData.rotationAxis = transform.TransformDirection(Vector3.forward);
		rGrabberData.grabbedObj = this;
		GetComponent(FixedJoint).connectedBody.freezeRotation = true;
		rigidbody.freezeRotation = true;
		rigidbody.detectCollisions = false;
	}

	function Activate() {
		// TODO figure out why this number needs to be so high
		rigidbody.AddRelativeForce(Vector3.up * 1000);
	}
	
	function rotate(angleToRotate: float)
	{
		// store connected body, break joint, and rejoin after rotation
		var connectedBody = GetComponent(FixedJoint).connectedBody;
		GetComponent(FixedJoint).connectedBody = null;
		
		// rotate around the hinge joint
		var anchorPoint : Vector3 = Vector3.zero;
		transform.RotateAround(transform.TransformPoint(anchorPoint),transform.TransformDirection(Vector3.forward),-angleToRotate);
		rigidbody.angularVelocity = Vector3.zero;
		
		GetComponent(FixedJoint).connectedBody = connectedBody;
	}
	
	function DrawRotationArrow()
	{
		DrawArrow(transform.position,2*transform.TransformDirection(Vector3.up),Color(1,1,1));
	}
}