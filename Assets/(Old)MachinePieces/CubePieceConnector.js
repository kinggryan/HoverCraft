#pragma strict

public class CubePieceConnector extends Connector
{
	function Connect(blockObject : GameObject, attachPoint : Vector3, attachDirection : Vector3) {
		var worldSpaceSide : Vector3 = blockObject.transform.TransformPoint(attachPoint);
		var worldSpaceDir : Vector3 = blockObject.transform.TransformDirection(attachDirection);
		
		transform.rotation = Quaternion.LookRotation(worldSpaceDir,blockObject.transform.up);
		transform.position = worldSpaceSide + .5*worldSpaceDir;

		var newJoint : FixedJoint = gameObject.AddComponent("FixedJoint");
		newJoint.anchor = worldSpaceSide;
		newJoint.connectedBody = blockObject.rigidbody;    
/*		var newJoint2 : CompleteFixedJoint = gameObject.AddComponent(CompleteFixedJoint);
		newJoint2.connectedBody = blockObject;
		newJoint2.SetUpJoint(transform,blockObject.transform); */
/*		var newJoint : HingeJoint = gameObject.AddComponent(HingeJoint);
		newJoint.anchor = attachPoint;
		newJoint.axis = attachDirection;
		newJoint.connectedBody = blockObject.rigidbody;
		newJoint.useLimits = true;
		newJoint.limits.max = 0;
		newJoint.limits.min = -0; */
	//	transform.parent = blockObject.transform;
		
		var machinePieceInfo : MachinePieceAttachments = GetComponent("MachinePieceAttachments");
		var index : int = 5;
		
		machinePieceInfo.connectedObjects[index] = blockObject;

		// check neighboring cube spaces to see if there are any cubes asside from the attached cube. Then
		  // create a joint between these cubes
		var colliders : Collider[];
		var checkVector : Vector3;
		
		checkVector = Vector3.right;
		while(checkVector != Vector3.zero) // while we don't hit sentinel vector
		{
			// TODO make all joint connections work
			colliders = Physics.OverlapSphere(transform.position + transform.TransformDirection(checkVector),.2,Physics.AllLayers);
			
			var ind : int;
			
			switch(checkVector)
			{
			case Vector3.right: ind = 0; break;
			case Vector3.left: ind = 1; break;
			case Vector3.up: ind = 2; break;
			case Vector3.down: ind = 3; break;
			case Vector3.forward: ind = 4; break;
			case Vector3.back: ind = 5; break;
			}
			
			if(machinePieceInfo.connectedObjects[ind] == null && colliders.length != 0)
			{
				Debug.Log("Connecting Joints!");
				machinePieceInfo.connectedObjects[ind] = colliders[0].gameObject;
		/*		newJoint = gameObject.AddComponent("FixedJoint");
				newJoint.anchor = transform.position + .5*transform.TransformDirection(checkVector);
				newJoint.connectedBody = colliders[0].rigidbody;	*/
			}
			
			switch(checkVector)
			{
			case Vector3.right: checkVector = Vector3.left; break;
			case Vector3.left: checkVector = Vector3.up; break;
			case Vector3.up: checkVector = Vector3.down; break;
			case Vector3.down: checkVector = Vector3.forward; break;
			case Vector3.forward: checkVector = Vector3.back; break;
			case Vector3.back: checkVector = Vector3.zero; break;
			}
		}	
	}
	
/*	function OnMouseDown()
	{
		var ccc : CreatorControl = GameObject.Find("MainCreatorControl").GetComponent("CreatorControl");
	
		if(ccc.actionMode == 0)
		{
			var ray : Ray = Camera.main.ScreenPointToRay (Input.mousePosition);
			var hit : RaycastHit;
			collider.Raycast(ray,hit,100);
	
			// intersect with box and find local coords
			var clickPoint : Vector3 = collider.ClosestPointOnBounds(hit.point);
			clickPoint = transform.InverseTransformPoint(clickPoint);
	
			var side : Vector3;
			var mBCollider : BoxCollider = collider;
			var index : int;
	
			if(Mathf.Approximately(clickPoint.x, (mBCollider.size.x)/2))
			{
				side = Vector3.right;
				index = 0;
			}
			else if(Mathf.Approximately(clickPoint.x, -(mBCollider.size.x)/2))
			{
				side = Vector3.left;
				index = 1;
			}
			else if(Mathf.Approximately(clickPoint.y, (mBCollider.size.y)/2))
			{
				side = Vector3.up;
				index = 2;
			}
			else if(Mathf.Approximately(clickPoint.y, -(mBCollider.size.y)/2))
			{
				side = Vector3.down;
				index = 3;
			}
			else if(Mathf.Approximately(clickPoint.z, (mBCollider.size.z)/2))
			{
				side = Vector3.forward;
				index = 4;
			}
			else if(Mathf.Approximately(clickPoint.z, -(mBCollider.size.z)/2))
			{
				side = Vector3.back;
				index = 5;
			} 

			ccc.AddPieceToBlock(gameObject,.5*side,side,index);
		}
		else if(ccc.actionMode == 5)
		{
			GameObject.Destroy(gameObject);
		}
	}	 */
	
	function addPieceGeneric()
	{
		var ccc : CreatorControl = GameObject.Find("MainCreatorControl").GetComponent("CreatorControl");
	
		var ray : Ray = Camera.main.ScreenPointToRay (Input.mousePosition);
		var hit : RaycastHit;
		collider.Raycast(ray,hit,100);
	
		// intersect with box and find local coords
		var clickPoint : Vector3 = collider.ClosestPointOnBounds(hit.point);
		clickPoint = transform.InverseTransformPoint(clickPoint);
	
		var side : Vector3;
		var mBCollider : BoxCollider = collider;
		var index : int;
	
		if(Mathf.Approximately(clickPoint.x, (mBCollider.size.x)/2))
		{
			side = Vector3.right;
			index = 0;
		}
		else if(Mathf.Approximately(clickPoint.x, -(mBCollider.size.x)/2))
		{
			side = Vector3.left;
			index = 1;
		}
		else if(Mathf.Approximately(clickPoint.y, (mBCollider.size.y)/2))
		{
			side = Vector3.up;
			index = 2;
		}
		else if(Mathf.Approximately(clickPoint.y, -(mBCollider.size.y)/2))
		{
			side = Vector3.down;
			index = 3;
		}
		else if(Mathf.Approximately(clickPoint.z, (mBCollider.size.z)/2))
		{
			side = Vector3.forward;
			index = 4;
		}
		else if(Mathf.Approximately(clickPoint.z, -(mBCollider.size.z)/2))
		{
			side = Vector3.back;
			index = 5;
		} 

		ccc.AddPieceToBlock(gameObject,.5*side,side,index);
	}	
}