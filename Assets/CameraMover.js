#pragma strict

public var lookPos : Vector3;

function Start () {
	transform.position = transform.position + Vector3(0,10,0);
//	transform.rotation.SetLookRotation(Vector3(0,1,-.5));
	lookPos = transform.TransformPoint(0,0,25);
}

function Update () {
	var hMove = Input.GetAxis("Horizontal");
	var	vMove = Input.GetAxis("Vertical") * .35;
	
	if(Input.GetKey("q"))
		transform.RotateAround(lookPos, transform.TransformDirection(Vector3.right), -.5);
	if(Input.GetKey("e"))
		transform.RotateAround(lookPos, transform.TransformDirection(Vector3.right), .5);
		
	transform.RotateAround (lookPos, Vector3.up, hMove);
	transform.position = transform.position + vMove*transform.TransformDirection(Vector3.forward);
}