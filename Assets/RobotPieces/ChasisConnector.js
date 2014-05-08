#pragma strict

public class ChasisConnector extends Connector
{
	private var connectedCount : int;

	// For now, we are initializing connectedCount to 1, as the hoverplate and chasis begin attached to each
	//		other. This will change in the future.
	function Start (){
		connectedCount = 1;
	}

	function Connect(blockObject : GameObject, attachPoint : Vector3, attachDirection : Vector3) {
		var worldSpaceSide : Vector3 = blockObject.transform.TransformPoint(attachPoint);
		var worldSpaceDir : Vector3 = blockObject.transform.TransformDirection(attachDirection);
		
		transform.rotation = Quaternion.LookRotation(worldSpaceDir,blockObject.transform.up);
		transform.position = worldSpaceSide + .5*worldSpaceDir;

		var newJoint : FixedJoint = gameObject.AddComponent("FixedJoint");
		newJoint.anchor = worldSpaceSide;
		newJoint.connectedBody = blockObject.rigidbody;    
		mainJoint = newJoint;
		
		var machinePieceInfo : MachinePieceAttachments = GetComponent("MachinePieceAttachments");
		var index : int = 5;
		
		machinePieceInfo.connectedObjects[index] = blockObject;	
		connectedCount = 1;
	}
	
	function Connect(blockObject : GameObject, relativePosition : Vector3 , rotation : Quaternion) {
		var worldSpaceSide : Vector3 = blockObject.transform.TransformPoint(relativePosition);
		
		transform.rotation = rotation;
		transform.position = worldSpaceSide;

		var newJoint : FixedJoint = gameObject.AddComponent("FixedJoint");
		newJoint.anchor = worldSpaceSide;
		newJoint.connectedBody = blockObject.rigidbody;    
		mainJoint = newJoint;
		
		var machinePieceInfo : MachinePieceAttachments = GetComponent("MachinePieceAttachments");
		var index : int = 5;
		
		machinePieceInfo.connectedObjects[index] = blockObject;	
		connectedCount = 1;
	}
	
	function addPieceGeneric()
	{
		var ccc : CreatorControl = GameObject.Find("MainCreatorControl").GetComponent("CreatorControl");
	
		var ray : Ray = Camera.main.ScreenPointToRay (Input.mousePosition);
		var hit : RaycastHit;
		collider.Raycast(ray,hit,100);
	
		// intersect with box and find local coords
		var clickPoint : Vector3 = collider.ClosestPointOnBounds(hit.point);
		
		clickPoint = transform.InverseTransformPoint(clickPoint);

		ccc.AddPieceToBlock(gameObject,clickPoint,Vector3.up,connectedCount);
		connectedCount++;
	}	
}