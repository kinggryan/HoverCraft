#pragma strict
public class Wheel4Connector extends Connector
{

	function Connect (blockObject : GameObject , attachPoint : Vector3, attachDirection : Vector3){
		var worldSpaceSide : Vector3 = blockObject.transform.TransformPoint(attachPoint);
		var worldSpaceDir : Vector3 = blockObject.transform.TransformDirection(attachDirection);
		
		transform.rotation = Quaternion.identity;
		//transform.rotation = Quaternion.LookRotation(Vector3(worldSpaceDir.y,worldSpaceDir.z,worldSpaceDir.x),worldSpaceDir);
		transform.position = worldSpaceSide; // + transform.TransformPoint(Vector3.up*1.03);
		GetComponent(FixedJoint).connectedBody = blockObject.rigidbody;
		
		var machinePieceInfo : MachinePieceAttachments = GetComponent("MachinePieceAttachments");
		for(var currObj : GameObject in machinePieceInfo.connectedObjects)
			currObj = blockObject;
 	}
 	
 	function DrawMotorArrow()
 	{
 		if(GetComponent(LineRenderer) == null)
 			DrawArrow(transform.position,transform.TransformDirection(-4*motorDirection*Vector3.right),Color(1,1,1));
 	}
}