#pragma strict
public class HammerConnector extends Connector
{
	public var rotationGrabberType : GameObject;
	private var readyToSmash : boolean;

	function Connect (blockObject : GameObject , attachPoint : Vector3, attachDirection : Vector3){
		var worldSpaceSide : Vector3 = blockObject.transform.TransformPoint(attachPoint);
		var worldSpaceDir : Vector3 = blockObject.transform.TransformDirection(attachDirection);
		
		transform.rotation = Quaternion.LookRotation(Vector3(worldSpaceDir.y,worldSpaceDir.z,worldSpaceDir.x),worldSpaceDir);
		transform.position = worldSpaceSide + transform.TransformPoint(.45,.5,0);
		GetComponent(HingeJoint).connectedBody = blockObject.rigidbody;
		Physics.IgnoreCollision(collider,blockObject.collider);
		
		var machinePieceInfo : MachinePieceAttachments = GetComponent("MachinePieceAttachments");
		for(var currObj : GameObject in machinePieceInfo.connectedObjects)
			currObj = blockObject;
			
		readyToSmash = true;
		gameObject.AddComponent(KeyBindedActivator).key = "1";
		Physics.IgnoreCollision(collider,blockObject.collider);
 	}
 	
 	function ReadyForSmashing()
 	{
 		readyToSmash = true;
 		hingeJoint.motor.targetVelocity = 0;
 		var tempBM : BattleManager = GetComponent("BattleManager");
 		tempBM.EnableDisableDamage(false);
 	}
 	
 	function PullArmBack()
 	{
 		hingeJoint.motor.targetVelocity = -500;
 	}
 	
 	function Activate() {
 		if(readyToSmash)
 		{
 			hingeJoint.motor.targetVelocity = 500;
 			
 			// Setpull back timer
 			readyToSmash = false;
 			Invoke("PullArmBack",.3);
 			Invoke("ReadyForSmashing",.6);
 			var tempBM : BattleManager = GetComponent("BattleManager");
 			tempBM.EnableDisableDamage(true);
 		}
 	}
 	
 	function DrawMotorArrow()
 	{
 		if(GetComponent(LineRenderer) == null)
 			DrawArrow(transform.position,transform.TransformDirection(-4*motorDirection*Vector3.right),Color(1,1,1));
 	}
 	
 		function rotatePieceGeneric()
	{
		// destroy other rotation grabbers and create a new rotation grabber for this object
		GameObject.Destroy(GameObject.Find("RotationGrabberObject"));
			
		var rGrabber : GameObject = Instantiate(rotationGrabberType,transform.TransformPoint(Vector3(0,4,0)),Quaternion.identity);
		var rGrabberData : RotationGrabber = rGrabber.GetComponent("RotationGrabber");
		rGrabberData.radius = 4;
		rGrabberData.anchorPoint = hingeJoint.anchor;
		//rGrabberData.rotationAxis = transform.TransformDirection(Vector3.forward);
		rGrabberData.rotationAxis = Vector3.forward;
		rGrabberData.grabbedObj = this;
		
		rGrabber = Instantiate(rotationGrabberType,transform.TransformPoint(Vector3(4,0,0)),Quaternion.identity);
		rGrabberData = rGrabber.GetComponent("RotationGrabber");
		rGrabberData.radius = 4;
		rGrabberData.anchorPoint = hingeJoint.anchor;
		//rGrabberData.rotationAxis = transform.TransformDirection(Vector3.right);
		rGrabberData.rotationAxis = Vector3.up;
		rGrabberData.grabbedObj = this; 
		
		GetComponent(HingeJoint).connectedBody.freezeRotation = true;
		rigidbody.freezeRotation = true;
		rigidbody.detectCollisions = false;
	}
	
	function rotate(angleToRotate: float, axis : Vector3)
	{
		// store connected body, break joint, and rejoin after rotation
		var connectedBody = GetComponent(HingeJoint).connectedBody;
		GetComponent(HingeJoint).connectedBody = null;
		
		// rotate around the hinge joint
		transform.RotateAround(transform.TransformPoint(hingeJoint.anchor),axis,-angleToRotate);
		rigidbody.angularVelocity = Vector3.zero;
		
		GetComponent(HingeJoint).connectedBody = connectedBody;
	}
}