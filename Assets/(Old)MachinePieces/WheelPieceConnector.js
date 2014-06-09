#pragma strict
public class WheelPieceConnector extends Connector
{

	function Connect (blockObject : GameObject , attachPoint : Vector3, attachDirection : Vector3){
		var worldSpaceSide : Vector3 = blockObject.transform.TransformPoint(attachPoint);
		var worldSpaceDir : Vector3 = blockObject.transform.TransformDirection(attachDirection);
		
		transform.rotation = Quaternion.LookRotation(Vector3(worldSpaceDir.y,worldSpaceDir.z,worldSpaceDir.x),worldSpaceDir);
		transform.position = worldSpaceSide + transform.TransformPoint(Vector3.up);
		GetComponent(ConfigurableJoint).connectedBody = blockObject.rigidbody;
		
		var machinePieceInfo : MachinePieceAttachments = GetComponent("MachinePieceAttachments");
		for(var currObj : GameObject in machinePieceInfo.connectedObjects)
			currObj = blockObject;
 	}
 	
 	function Activate () {
 		var currJoint : ConfigurableJoint = GetComponent(ConfigurableJoint);
 		currJoint.targetAngularVelocity = motorDirection * Vector3(5,0,0);
 	}
 	
 	function AddMotion(motion : float)
 	{
 		var currJoint : ConfigurableJoint = GetComponent(ConfigurableJoint);
 		currJoint.targetAngularVelocity = Vector3(motion,0,0);
 	}
 	
 	function DrawMotorArrow()
 	{
 		if(GetComponent(LineRenderer) == null)
 			DrawArrow(transform.position,transform.TransformDirection(-4*motorDirection*Vector3.right),Color(1,1,1));
 	}
 	
 /*	function OnMouseDown()
	{
		var ccc : CreatorControl = GameObject.Find("MainCreatorControl").GetComponent("CreatorControl");
		if(ccc.actionMode == 4)
		{
			ccc.LinkObjects(this);
		}
		else if(ccc.actionMode == 2)
			ChangeMotorDirection();
		else if(ccc.actionMode == 5)
		{
			GameObject.Destroy(gameObject);
		}
	} */
	
	function Update()
	{
		if(rigidbody.angularVelocity.x < -.4 || rigidbody.angularVelocity.x > .4)
		{
			ActivateLinkedPiece();
		}
	}
}