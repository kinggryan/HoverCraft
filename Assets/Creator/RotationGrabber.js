#pragma strict

public var rotationAxis : Vector3;
public var anchorPoint : Vector3;
public var radius : float;
public var grabbedObj : Connector;
private var currentAngle : float;

function Start () {
	currentAngle = 0;
	for(var piece in GameObject.FindGameObjectsWithTag("piece"))
		if(piece.collider != null)
			Physics.IgnoreCollision(collider,piece.collider);
}

function OnMouseDrag() {
	// find distance to camera and draw ray to mouse point
	var distanceToCamera : float = Vector3.Distance(transform.position,Camera.main.transform.position);
	var ray : Ray = Camera.main.ScreenPointToRay (Input.mousePosition);
	var checkPlane : Plane = Plane(rotationAxis,anchorPoint);
	var dist : float;
	checkPlane.Raycast(ray, dist);
	var clickPoint : Vector3 = ray.GetPoint(dist);
	
//	Debug.Log("click point : "+ clickPoint);
//	Debug.Log("checkPlane : " + checkPlane.normal);
	//Debug.Log("pos : " + transform.position);
	
	// rotate around anchor point into that position
	var angleToRotate : float = Vector3.Angle(anchorPoint - transform.position,anchorPoint - clickPoint);
	//Debug.Log("angle : " + angleToRotate);
	
	checkPlane.SetNormalAndPosition(checkPlane.normal,Vector3.zero);
	if(!checkPlane.GetSide(Vector3.Cross(anchorPoint - transform.position,anchorPoint - clickPoint)))
		angleToRotate *= -1;
		
//	Debug.Log("newangle : " + angleToRotate);
	
	transform.RotateAround(anchorPoint,rotationAxis,angleToRotate);
	grabbedObj.rotate(-angleToRotate,rotationAxis);
}