#pragma strict
public class SawBladeConnector extends Connector
{
	public var rotationGrabberType : GameObject;

	function Connect (blockObject : GameObject , attachPoint : Vector3, attachDirection : Vector3){
		var worldSpaceSide : Vector3 = blockObject.transform.TransformPoint(attachPoint);
		var worldSpaceDir : Vector3 = blockObject.transform.TransformDirection(attachDirection);
		
		transform.rotation = Quaternion.LookRotation(worldSpaceDir,Vector3(worldSpaceDir.y,worldSpaceDir.z,worldSpaceDir.x));
		transform.position = worldSpaceSide;
		GetComponent(HingeJoint).connectedBody = blockObject.rigidbody;
		Physics.IgnoreCollision(collider,blockObject.collider);
		
		gameObject.AddComponent(KeyBindedActivator).key = "1";
		
		var machinePieceInfo : MachinePieceAttachments = GetComponent("MachinePieceAttachments");
		for(var currObj : GameObject in machinePieceInfo.connectedObjects)
			currObj = blockObject;
 	}
 	
 	function AddMotion(motion : float)
 	{
 		hingeJoint.motor.targetVelocity = motion;
 	}
 	
 	function EnableDisableMotor(mode : boolean)
 	{
 		hingeJoint.useMotor = mode;
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
			
		var rGrabber : GameObject = Instantiate(rotationGrabberType,transform.TransformPoint(Vector3(4,0,0)),Quaternion.identity);
		var rGrabberData : RotationGrabber = rGrabber.GetComponent("RotationGrabber");
		rGrabberData.radius = 4;
		rGrabberData.anchorPoint = transform.position;
		//rGrabberData.rotationAxis = transform.TransformDirection(Vector3.forward);
		rGrabberData.rotationAxis = transform.forward;
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
		var anchorPoint : Vector3 = Vector3.zero;
		transform.RotateAround(transform.TransformPoint(anchorPoint),axis,-angleToRotate);
		rigidbody.angularVelocity = Vector3.zero;
		
		GetComponent(HingeJoint).connectedBody = connectedBody;
	}
	
	function Activate()
	{
		var tempBM : BattleManager = GetComponent("BattleManager");
		tempBM.EnableDisableDamage(true);
		hingeJoint.motor.targetVelocity = 400;
	}
	
	function DeActivate()
	{
		var tempBM : BattleManager = GetComponent("BattleManager");
		tempBM.EnableDisableDamage(false);
	}
}