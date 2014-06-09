#pragma strict

public var rotationGrabberType : GameObject;
public var armJointConnectorType : GameObject;
private var primaryJoint : HingeJoint;
private var secondaryJoint : HingeJoint;
private var secondaryJointAngle : float;
private var armJointConnector : GameObject;

public class Arm2Connector extends Connector
{
	function Connect (blockObject : GameObject , attachPoint : Vector3, attachDirection : Vector3){
		var worldSpaceSide : Vector3 = blockObject.transform.TransformPoint(attachPoint);
		var worldSpaceDir : Vector3 = blockObject.transform.TransformDirection(attachDirection);
		
		transform.position = worldSpaceSide;
		transform.rotation = Quaternion.LookRotation(Vector3(worldSpaceDir.y,worldSpaceDir.z,worldSpaceDir.x),worldSpaceDir);
		transform.position += transform.TransformDirection(.75 * Vector3.forward) + transform.TransformDirection(.9*Vector3.up);
		primaryJoint = GetComponent(HingeJoint);
		GetComponent(HingeJoint).connectedBody = blockObject.rigidbody;
		
		var machinePieceInfo : MachinePieceAttachments = GetComponent("MachinePieceAttachments");
		for(var currObj : GameObject in machinePieceInfo.connectedObjects)
			currObj = blockObject;
	}
	
	function FixedUpdate()
	{
		if(secondaryJoint != null)
		{
			secondaryJointAngle = primaryJoint.angle;
			secondaryJoint.limits.min = secondaryJointAngle-2;
			secondaryJoint.limits.max = secondaryJointAngle+2;
		}
	}
	
	function addPieceGeneric()
	{
		var ccc : CreatorControl = GameObject.Find("MainCreatorControl").GetComponent("CreatorControl");
		
		var machinePieceInfo : MachinePieceAttachments = GetComponent("MachinePieceAttachments");
		armJointConnector = Instantiate(armJointConnectorType,transform.TransformPoint(Vector3(0,4.5,.75)), Quaternion.LookRotation(transform.TransformDirection(Vector3.forward),transform.TransformDirection(Vector3.up)));
		
		if(machinePieceInfo.connectedObjects[1] == machinePieceInfo.connectedObjects[0])
		{
			ccc.AddPieceToArm(gameObject, gameObject,Vector3(0,4.5,.5),Vector3.up);
			
			// retrieve newly connected object and modify it's fixed joint - ie the arm connecting joint -
			// into a hinge joint
			
			//UnityEngine.Object.Destroy(machinePieceInfo.connectedObjects[1].GetComponent(FixedJoint),0);
		/*	secondaryJoint = gameObject.AddComponent(HingeJoint);
			secondaryJoint.connectedBody = armJointConnector.rigidbody;
			secondaryJoint.anchor = Vector3(0,4.5,.5);
			secondaryJoint.axis = Vector3(0,-1,0);
			secondaryJointAngle = 0;
			secondaryJoint.useLimits = true;
			secondaryJoint.limits.min = secondaryJointAngle-.5;
			secondaryJoint.limits.max = secondaryJointAngle+.5; */
		}
	}
	
	function rotatePieceGeneric()
	{
			// destroy other rotation grabbers and create a new rotation grabber for this object
			GameObject.Destroy(GameObject.Find("RotationGrabberObject"));
			
			var rGrabber : GameObject = Instantiate(rotationGrabberType,transform.TransformPoint(Vector3(3,0,-.5)),Quaternion.LookRotation(transform.TransformDirection(Vector3.forward),transform.TransformDirection(Vector3.right)));
			var rGrabberData : RotationGrabber = rGrabber.GetComponent("RotationGrabber");
			rGrabberData.radius = 3;
			rGrabberData.anchorPoint = transform.position;
			rGrabberData.rotationAxis = transform.TransformDirection(Vector3.up);
			rGrabberData.grabbedObj = this;
			hingeJoint.connectedBody.freezeRotation = true;
			rigidbody.freezeRotation = true;
			rigidbody.detectCollisions = false;
	}

	function Activate() {
		// TODO figure out why this number needs to be so high
			GetComponent(HingeJoint).motor.targetVelocity = motorDirection*180;
			GetComponent(HingeJoint).motor.force = 200;
	}
	
	function rotate(angleToRotate: float)
	{
		// rotate around the hinge joint
		var anchorPoint : Vector3 = hingeJoint.anchor;
		transform.RotateAround(transform.TransformPoint(anchorPoint),transform.TransformDirection(hingeJoint.axis),angleToRotate);
		rigidbody.angularVelocity = Vector3.zero;
	}
}